#!/usr/bin/env python3
"""Visually classify hotel photos with Gemini Flash and copy them into structured folders."""

from __future__ import annotations

import io
import json
import os
import re
import shutil
import sys
import time
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

from google import genai
from google.genai import types
from PIL import Image
from tqdm import tqdm

ROOT = Path(__file__).resolve().parent
SOURCE_DIR = ROOT / "Hotel"
RAW_PHOTOS_DIR = ROOT / "raw_photos"
OUTPUT_ROOT = ROOT / "public" / "images" / "hotel"

CATEGORIES = [
    "rooms_presidential_suite",
    "rooms_king_bed",
    "rooms_queen_bed",
    "rooms_family_room",
    "bathrooms",
    "lobby_and_front_desk",
    "lounge_and_seating",
    "patio_and_rooftop",
    "dining_and_food_court",
    "closets_and_details",
    "exterior_and_views",
    "uncategorized",
]

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic", ".heif"}
MODEL_NAME = "gemini-3.1-flash-lite"
MAX_API_EDGE = 1280
MAX_SLUG_LEN = 80
MAX_RETRIES = 5
RETRY_BASE_SECONDS = 2.0
MAX_WORKERS = 4

PROMPT = """You are a hotel photo classifier. Inspect ONLY the visual content of this image.
Ignore any filename, photographer label, EXIF, or assumed metadata.

Choose exactly one category from this list:
- rooms_presidential_suite: luxury suite living area, multiple rooms, sofa + bedroom together, premium suite lounge
- rooms_king_bed: guest room whose primary bed is a single large king bed
- rooms_queen_bed: guest room whose primary bed is a queen bed (one queen, not two)
- rooms_family_room: room with two beds, extra beds, bunks, or an obviously family-oriented layout
- bathrooms: toilet, shower, bathtub, vanity, or bathroom fixtures as the main subject
- lobby_and_front_desk: hotel lobby, reception, front desk, check-in area
- lounge_and_seating: indoor lounge, waiting area, sofas/armchairs not inside a guest bedroom
- patio_and_rooftop: outdoor terrace, patio, balcony seating, rooftop deck
- dining_and_food_court: restaurant, dining room, breakfast area, food, plated dishes, kitchen service
- closets_and_details: wardrobe, closet, mini-bar, amenities tray, decor close-ups, fixtures, textiles
- exterior_and_views: building exterior, facade, mountains, landscape, street, window views of outdoors
- uncategorized: not a hotel interior, exterior, amenity, or room photo, or too unclear to classify

Rules:
- Classify from what you see, not from labels.
- If two categories could apply, pick the most specific primary subject.
- If it is clearly a hotel photo but the room type is uncertain, pick the closest room/area category rather than uncategorized.
- slug must be kebab-case (lowercase letters, digits, hyphens), 3 to 8 words, describing visible content, e.g. rooftop-seating-mountain-view.
- Do not include the category name in the slug unless it is visually necessary.
- Return JSON only.
"""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "category": {"type": "string", "enum": CATEGORIES},
        "slug": {
            "type": "string",
            "description": "kebab-case visual description, 3-8 words",
        },
    },
    "required": ["category", "slug"],
}


def collect_api_keys() -> list[str]:
    keys: list[str] = []
    seen: set[str] = set()
    for name in ("GEMINI_API_KEY", "GEMINI_API_KEY_1", "GEMINI_API_KEY_2"):
        value = (os.environ.get(name) or "").strip()
        if value and value not in seen:
            keys.append(value)
            seen.add(value)
    return keys


def list_images(source_dir: Path) -> list[Path]:
    files: list[Path] = []
    for path in sorted(source_dir.iterdir(), key=lambda p: p.name.lower()):
        if path.is_file() and path.suffix.lower() in IMAGE_EXTENSIONS:
            files.append(path)
    return files


def sanitize_slug(raw: str, fallback: str) -> str:
    text = (raw or "").strip().lower().replace("_", "-")
    text = re.sub(r"[^a-z0-9-]+", "-", text)
    text = re.sub(r"-{2,}", "-", text).strip("-")
    if not text:
        text = fallback
    return text[:MAX_SLUG_LEN].strip("-") or fallback


def unique_destination(directory: Path, slug: str, suffix: str) -> Path:
    candidate = directory / f"{slug}{suffix}"
    if not candidate.exists():
        return candidate
    n = 2
    while True:
        candidate = directory / f"{slug}-{n}{suffix}"
        if not candidate.exists():
            return candidate
        n += 1


def image_to_jpeg_bytes(path: Path) -> bytes:
    with Image.open(path) as img:
        img = img.convert("RGB")
        width, height = img.size
        longest = max(width, height)
        if longest > MAX_API_EDGE:
            scale = MAX_API_EDGE / float(longest)
            img = img.resize(
                (max(1, int(width * scale)), max(1, int(height * scale))),
                Image.Resampling.LANCZOS,
            )
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=85, optimize=True)
        return buffer.getvalue()


def is_retryable(error: Exception) -> bool:
    message = str(error).lower()
    retry_tokens = (
        "429",
        "resource exhausted",
        "rate",
        "quota",
        "unavailable",
        "503",
        "500",
        "timeout",
        "temporarily",
        "try again",
    )
    return any(token in message for token in retry_tokens)


_CLIENTS: dict[str, genai.Client] = {}
_CLIENTS_LOCK = Lock()


def get_client(api_key: str) -> genai.Client:
    with _CLIENTS_LOCK:
        client = _CLIENTS.get(api_key)
        if client is None:
            client = genai.Client(api_key=api_key)
            _CLIENTS[api_key] = client
        return client


def classify_image(image_bytes: bytes, keys: list[str], key_index: int) -> dict:
    last_error: Exception | None = None
    for attempt in range(MAX_RETRIES):
        key = keys[(key_index + attempt) % len(keys)]
        try:
            client = get_client(key)
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    PROMPT,
                ],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_json_schema=RESPONSE_SCHEMA,
                    thinking_config=types.ThinkingConfig(thinking_level="minimal"),
                ),
            )
            payload = json.loads(response.text or "{}")
            category = payload.get("category")
            slug = payload.get("slug", "")
            if category not in CATEGORIES:
                raise ValueError(f"invalid category: {category!r}")
            return {"category": category, "slug": slug}
        except Exception as error:  # noqa: BLE001 - classify all SDK/network failures
            last_error = error
            if attempt < MAX_RETRIES - 1 and is_retryable(error):
                time.sleep(RETRY_BASE_SECONDS * (2**attempt))
                continue
            if attempt < MAX_RETRIES - 1 and isinstance(error, (json.JSONDecodeError, ValueError)):
                time.sleep(1.0)
                continue
            break
    raise RuntimeError(f"classification failed: {last_error}") from last_error


def ensure_directories() -> None:
    RAW_PHOTOS_DIR.mkdir(parents=True, exist_ok=True)
    for category in CATEGORIES:
        (OUTPUT_ROOT / category).mkdir(parents=True, exist_ok=True)


def main() -> int:
    keys = collect_api_keys()
    if not keys:
        print(
            "No Gemini API key found. Set GEMINI_API_KEY, GEMINI_API_KEY_1, or GEMINI_API_KEY_2.",
            file=sys.stderr,
        )
        return 1

    if not SOURCE_DIR.is_dir():
        print(f"Source folder not found: {SOURCE_DIR}", file=sys.stderr)
        return 1

    ensure_directories()
    images = list_images(SOURCE_DIR)
    if not images:
        print(f"No images found in {SOURCE_DIR}")
        return 0

    print(f"Classifying {len(images)} images from {SOURCE_DIR} with {MODEL_NAME}")
    counts: Counter[str] = Counter()
    failures: list[str] = []
    io_lock = Lock()

    def process_one(index_and_path: tuple[int, Path]) -> tuple[str, str | None]:
        index, path = index_and_path
        fallback_slug = sanitize_slug(path.stem, "hotel-photo")
        try:
            image_bytes = image_to_jpeg_bytes(path)
            result = classify_image(image_bytes, keys, index)
            category = result["category"]
            slug = sanitize_slug(result["slug"], fallback_slug)
            error_text = None
        except Exception as error:  # noqa: BLE001
            category = "uncategorized"
            slug = fallback_slug
            error_text = f"{path.name}: {error}"

        dest_dir = OUTPUT_ROOT / category
        with io_lock:
            dest = unique_destination(dest_dir, slug, path.suffix.lower())
            shutil.copy2(path, dest)
        return category, error_text

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {
            executor.submit(process_one, (index, path)): path
            for index, path in enumerate(images)
        }
        for future in tqdm(as_completed(futures), total=len(futures), desc="Sorting hotel photos", unit="img"):
            category, error_text = future.result()
            counts[category] += 1
            if error_text:
                failures.append(error_text)
                tqdm.write(f"Fallback uncategorized for {error_text}")

    print("\nCategory counts:")
    for category in CATEGORIES:
        print(f"  {category}: {counts.get(category, 0)}")
    print(f"  total: {sum(counts.values())}")

    if failures:
        print(f"\n{len(failures)} file(s) fell back to uncategorized due to errors:")
        for line in failures:
            print(f"  - {line}")
    else:
        print("\nNo classification failures.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
