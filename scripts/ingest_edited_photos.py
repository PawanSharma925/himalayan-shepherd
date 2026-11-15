"""Ingest edited photos → optimized public/images/hotel + lib/images.ts."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "edited photos"
HOTEL = ROOT / "public" / "images" / "hotel"
OUT_TS = ROOT / "lib" / "images.ts"
MAX_EDGE = 2560
JPEG_QUALITY = 90

# (relative path under edited photos, public folder slug, category, group label)
FOLDER_MAP: list[tuple[str, str, str, str]] = [
    ("View", "view", "view", "Views"),
    ("exec suite", "exec-suite", "exec", "Executive Suite"),
    (
        "Standard rooms/Floor 3 lobby",
        "exec-suite",
        "exec",
        "Executive Suite",
    ),
    ("Floor 2 premium", "floor-2-premium", "premium", "Premium Room"),
    ("extras", "floor-2-premium", "premium", "Premium Room"),
    (
        "Standard rooms/Standard Double bed",
        "standard-double",
        "double",
        "Double Room",
    ),
    (
        "Standard rooms/Standard Large rooms",
        "standard-double",
        "double",
        "Double Room",
    ),
    (
        "Standard rooms/Standard Single bed room",
        "standard-twin",
        "twin",
        "Twin Room",
    ),
    ("Reception lobby", "reception-lobby", "lobby", "Reception & Lobby"),
    ("Restaurant", "restaurant", "restaurant", "Restaurant"),
    ("Sundeck", "sundeck", "sundeck", "Sundeck"),
]

FEATURED_SLUGS = {
    "himalayan-shepherd-01-lake-and-mountains-hd",
    "himalayan-shepherd-04-lake-to-sunset-hd",
    "warmly-lit-executive-suite-at-night-1",
    "bright-hotel-room-clear-views-1",
    "sunlit-hotel-room-clear-mountain-view-2",
    "warm-nighttime-standard-room-1",
    "bright-himalayan-shepherd-twin-room-7",
    "waving-receptionist-at-himalayan-shepherd-hotel-1",
    "warm-lounge-with-blue-seating",
    "sunlit-himalayan-shepherd-dining-room-2",
    "warm-himalayan-shepherd-coffee-moment-2",
    "himalayan-shepherd-hotel-terrace-3",
    "himalayan-shepherd-outdoor-bbq-amenity-2",
    "warm-nighttime-executive-suite-2",
}

UNKNOWN_RE = re.compile(r"^unknown(\s+copy)?([\s\-_]?\d+)?$", re.I)


def slugify(name: str) -> str:
    stem = Path(name).stem
    stem = stem.replace("_", "-").replace(",", "")
    stem = re.sub(r"\s+", "-", stem.strip())
    stem = re.sub(r"[^a-zA-Z0-9\-]+", "", stem)
    stem = re.sub(r"-{2,}", "-", stem).strip("-").lower()
    return stem or "photo"


def title_from_stem(stem: str) -> str:
    # strip trailing -N counters
    cleaned = re.sub(r"-\d+$", "", stem)
    cleaned = cleaned.replace("-", " ").replace("_", " ")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    # Drop leading brand + sequence numbers from View exports
    cleaned = re.sub(r"^himalayan\s+shepherd\s+", "", cleaned, flags=re.I)
    cleaned = re.sub(r"^\d+\s+", "", cleaned)
    cleaned = re.sub(r"\s+hd$", "", cleaned, flags=re.I)
    cleaned = re.sub(r"\s+at himalayan shepherd( hotel)?$", "", cleaned, flags=re.I)
    # Title-case lightly but keep short words
    words = cleaned.split(" ")
    out: list[str] = []
    for i, w in enumerate(words):
        if not w:
            continue
        if i > 0 and w.lower() in {"a", "an", "the", "and", "or", "of", "at", "to", "in", "with"}:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:] if w else w)
    text = " ".join(out)
    text = re.sub(r"\bhimalayan shepherd\b", "Himalayan Shepherd", text, flags=re.I)
    text = re.sub(r"\bbbq\b", "BBQ", text, flags=re.I)
    return text or "Hotel photograph"


def is_unknown(path: Path) -> bool:
    return bool(UNKNOWN_RE.match(Path(path).stem.strip()))


def fit(img: Image.Image) -> Image.Image:
    w, h = img.size
    longest = max(w, h)
    if longest <= MAX_EDGE:
        return img
    scale = MAX_EDGE / longest
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def convert(src: Path, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as img:
        img = img.convert("RGB")
        img = fit(img)
        img.save(dest, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def collect_sources() -> list[tuple[Path, str, str, str]]:
    """Return list of (source_path, public_slug_folder, category, group)."""
    by_folder: dict[str, list[Path]] = {}
    for rel, slug, category, group in FOLDER_MAP:
        folder = SOURCE / rel
        if not folder.exists():
            continue
        key = f"{slug}|{category}|{group}"
        files = [
            p
            for p in folder.iterdir()
            if p.is_file() and p.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp"}
        ]
        by_folder.setdefault(key, []).extend(files)

    results: list[tuple[Path, str, str, str]] = []
    for key, files in by_folder.items():
        slug, category, group = key.split("|", 2)
        named = [p for p in files if not is_unknown(p)]
        unknowns = [p for p in files if is_unknown(p)]
        # Skip Unknown* when the folder already has clearly named shots
        keep = named if named else unknowns
        # Deduplicate by slug within this destination folder
        seen: set[str] = set()
        for path in sorted(keep, key=lambda p: p.name.lower()):
            s = slugify(path.name)
            if s in seen:
                continue
            seen.add(s)
            results.append((path, slug, category, group))
    return results


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Missing source folder: {SOURCE}")

    if HOTEL.exists():
        shutil.rmtree(HOTEL)
    HOTEL.mkdir(parents=True, exist_ok=True)

    entries: list[str] = []
    used_slugs: dict[str, int] = {}
    index = 0

    for src, folder_slug, category, group in collect_sources():
        base = slugify(src.name)
        n = used_slugs.get(f"{folder_slug}/{base}", 0)
        used_slugs[f"{folder_slug}/{base}"] = n + 1
        file_slug = base if n == 0 else f"{base}-{n + 1}"
        dest = HOTEL / folder_slug / f"{file_slug}.jpg"
        convert(src, dest)

        title = title_from_stem(Path(src.name).stem if not is_unknown(src) else folder_slug)
        if is_unknown(src):
            title = title_from_stem(folder_slug)
        alt = f"{title} at Himalayan Shepherd, Pokhara"
        featured = "true" if file_slug in FEATURED_SLUGS or base in FEATURED_SLUGS else "false"
        web_src = f"/images/hotel/{folder_slug}/{file_slug}.jpg"

        entries.append(
            "  {\n"
            f'    id: "{category}-{index}",\n'
            f'    src: "{web_src}",\n'
            f"    title: {json.dumps(title)},\n"
            f"    alt: {json.dumps(alt)},\n"
            f'    category: "{category}",\n'
            f"    group: {json.dumps(group)},\n"
            f"    featured: {featured},\n"
            "  }"
        )
        index += 1
        print(f"  {src.relative_to(SOURCE)} → {dest.relative_to(ROOT)}")

    body = ",\n".join(entries)
    content = f"""export type ImageCategory =
  | "exec"
  | "premium"
  | "double"
  | "twin"
  | "lobby"
  | "restaurant"
  | "sundeck"
  | "view";

export type HotelImage = {{
  id: string;
  src: string;
  title: string;
  alt: string;
  category: ImageCategory;
  group: string;
  featured: boolean;
}};

export const hotelImages: HotelImage[] = [
{body}
];

export const imagesByCategory = (category: ImageCategory) =>
  hotelImages.filter((image) => image.category === category);

export const firstImage = (category: ImageCategory) =>
  imagesByCategory(category)[0];
"""
    OUT_TS.write_text(content, encoding="utf-8")
    print(f"\nWrote {len(entries)} images to {OUT_TS}")


if __name__ == "__main__":
    main()
