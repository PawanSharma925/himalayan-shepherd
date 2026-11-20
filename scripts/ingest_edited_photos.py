"""Ingest edited photos → optimized public/images/hotel + lib/images.ts."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

from PIL import Image, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "edited photos"
HOTEL = ROOT / "public" / "images" / "hotel"
OUT_TS = ROOT / "lib" / "images.ts"
MAX_SHORT_EDGE = 1600
JPEG_QUALITY = 92
MIN_SHARPNESS = 450

# (relative path under edited photos, public folder slug, category, group label)
FOLDER_MAP: list[tuple[str, str, str, str]] = [
    ("View", "view", "view", "Views"),
    (
        "Floor 2 Large Premium",
        "floor-2-large-premium",
        "largePremium",
        "Large Premium Room",
    ),
    (
        "Floor 2 Premium Room",
        "floor-2-premium",
        "premium",
        "Premium Room",
    ),
    (
        "Standard rooms/Standard Double bed",
        "standard-double",
        "double",
        "Double Room",
    ),
    (
        "Standard rooms/Standard Large rooms",
        "standard-large",
        "large",
        "Large Room",
    ),
    (
        "Standard rooms/Standard Single bed room",
        "standard-twin",
        "twin",
        "Twin Room",
    ),
    ("Dining Room", "dining", "dining", "Dining Room"),
    (
        "Coffee & Drinks Lounge",
        "drinks-lounge",
        "drinksLounge",
        "Coffee & Drinks Lounge",
    ),
    ("Sundeck", "rooftop", "rooftop", "Rooftop Terrace"),
]

# Near-duplicate / misplaced / ignored sources.
SKIP_FILES = {
    # Twin layout wrongly sitting in Large Premium.
    "Floor 2 Large Premium/Warm nighttime glow in Room 303.png",
    # Double Room near-duplicate vanity.
    "Standard rooms/Standard Double bed/Warm nighttime Himalayan Shepherd room-6.png",
    # Same Floor 3 lounge already taken from Standard Large.
    "Standard rooms/Standard Double bed/Floor 3 lounge.png",
    # Lounge shots duplicated into Premium Room folder (kept from Large Premium).
    "Floor 2 Premium Room/Sunlit hotel room, clear mountain view-2.png",
    "Floor 2 Premium Room/Sunlit hotel room, naturally balanced-3.png",
    # Twin near-dups still present under Standard Single.
    "Standard rooms/Standard Single bed room/Himalayan Shepherd Twin Room at Dusk-6.png",
}

# Always keep these even if soft or Unknown among named siblings.
FORCE_INCLUDE = {
    "Coffee & Drinks Lounge/Warm Himalayan Shepherd coffee moment-2.png",
    "Sundeck/Unknown-2.png",
}

# Path → (public slug folder, category, group)
FILE_OVERRIDES: dict[str, tuple[str, str, str]] = {
    # Floor 2 shared lounge (door 202) — stay with Large Premium + Photobook lounge tab.
    "Floor 2 Large Premium/Bright hotel room, clear views-1.png": (
        "floor-2-lounge",
        "largePremium",
        "Floor 2 Premium Room Lounge",
    ),
    "Floor 2 Large Premium/Sunlit hotel room, clear mountain view-2.png": (
        "floor-2-lounge",
        "largePremium",
        "Floor 2 Premium Room Lounge",
    ),
    "Floor 2 Large Premium/Sunlit hotel room, naturally balanced-3.png": (
        "floor-2-lounge",
        "largePremium",
        "Floor 2 Premium Room Lounge",
    ),
    # Floor 3 standard lounge (file lives under standard room folders).
    "Standard rooms/Standard Large rooms/Floor 3 lounge.png": (
        "floor-3-lounge",
        "floor3Lounge",
        "Floor 3 Standard Room Lounge",
    ),
    "Standard rooms/Standard Double bed/Floor 3 lounge.png": (
        "floor-3-lounge",
        "floor3Lounge",
        "Floor 3 Standard Room Lounge",
    ),
    # Same outdoor terrace / sundeck — keep under Rooftop Terrace.
    "Sundeck/Himalayan Shepherd Hotel Terrace-3.png": (
        "rooftop",
        "rooftop",
        "Rooftop Terrace",
    ),
    "Sundeck/Unknown-2.png": (
        "rooftop",
        "rooftop",
        "Rooftop Terrace",
    ),
    # Receptionist for About mosaic only.
    "Reception lobby/Waving receptionist at Himalayan Shepherd hotel-1.png": (
        "reception-lobby",
        "lobby",
        "Reception",
    ),
}

# Categories that keep sharp Unknown* studies (few named exports).
KEEP_UNKNOWNS = {"large", "largePremium", "premium", "double"}

FEATURED_SLUGS = {
    "himalayan-shepherd-02-golden-peak-telephoto",
    "warm-nighttime-hotel-room-4",
    "warm-nighttime-himalayan-shepherd-hotel-room-1",
    "warm-nighttime-standard-room-2",
    "himalayan-shepherd-twin-room-warmly-retouched-5",
    "bright-himalayan-shepherd-dining-room-3",
    "himalayan-shepherd-hotel-terrace-3",
    "warm-lounge-with-blue-seating",
    "himalayan-shepherd-outdoor-bbq-amenity-2",
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
    cleaned = re.sub(r"-\d+$", "", stem)
    cleaned = cleaned.replace("-", " ").replace("_", " ")
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = re.sub(r"^himalayan\s+shepherd\s+", "", cleaned, flags=re.I)
    cleaned = re.sub(r"^\d+\s+", "", cleaned)
    cleaned = re.sub(r"\s+hd$", "", cleaned, flags=re.I)
    cleaned = re.sub(r"\s+at himalayan shepherd( hotel)?$", "", cleaned, flags=re.I)
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
    shortest = min(w, h)
    if shortest <= MAX_SHORT_EDGE:
        return img
    scale = MAX_SHORT_EDGE / shortest
    return img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)


def sharpness(img: Image.Image) -> float:
    gray = img.convert("L")
    gray.thumbnail((1200, 1200))
    return ImageStat.Stat(gray.filter(ImageFilter.FIND_EDGES)).var[0]


def convert(src: Path, dest: Path) -> tuple[int, int]:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as img:
        img = img.convert("RGB")
        img = fit(img)
        img = img.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=2))
        img.save(
            dest,
            "JPEG",
            quality=JPEG_QUALITY,
            optimize=True,
            progressive=True,
            subsampling=0,
        )
        return img.size


def collect_sources() -> list[tuple[Path, str, str, str]]:
    """Return list of (source_path, public_slug_folder, category, group)."""
    by_folder: dict[str, list[Path]] = {}
    for rel, slug, category, group in FOLDER_MAP:
        folder = SOURCE / rel
        if not folder.exists():
            print(f"  missing folder: {rel}")
            continue
        key = f"{slug}|{category}|{group}"
        files = []
        for p in folder.iterdir():
            if not p.is_file() or p.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
                continue
            file_rel = p.relative_to(SOURCE).as_posix()
            if file_rel in SKIP_FILES:
                print(f"  skip (near-duplicate): {file_rel}")
                continue
            files.append(p)
        by_folder.setdefault(key, []).extend(files)

    # One-off files only present via overrides (Reception waving).
    for rel, (slug, category, group) in FILE_OVERRIDES.items():
        path = SOURCE / rel
        if not path.is_file():
            continue
        # Already collected from a FOLDER_MAP folder — override applied later.
        already = any(path in files for files in by_folder.values())
        if already:
            continue
        if rel in SKIP_FILES:
            continue
        key = f"{slug}|{category}|{group}"
        by_folder.setdefault(key, []).append(path)

    results: list[tuple[Path, str, str, str]] = []
    for key, files in by_folder.items():
        slug, category, group = key.split("|", 2)
        named = [p for p in files if not is_unknown(p)]
        unknowns = [p for p in files if is_unknown(p)]
        forced = [
            p
            for p in files
            if p.relative_to(SOURCE).as_posix() in FORCE_INCLUDE
        ]
        keep = (
            named + unknowns
            if (named and category in KEEP_UNKNOWNS)
            else (named if named else unknowns)
        )
        # Ensure forced Unknown / soft lifestyle shots are not dropped.
        for path in forced:
            if path not in keep:
                keep.append(path)
        best: dict[str, tuple[float, Path, str, str, str]] = {}
        for path in sorted(keep, key=lambda p: p.name.lower()):
            file_rel = path.relative_to(SOURCE).as_posix()
            out_slug, out_category, out_group = FILE_OVERRIDES.get(
                file_rel, (slug, category, group)
            )
            with Image.open(path) as img:
                score = sharpness(img.convert("RGB"))
            if (
                out_category != "view"
                and score < MIN_SHARPNESS
                and file_rel not in FORCE_INCLUDE
            ):
                print(f"  skip (soft, {score:.0f}): {file_rel}")
                continue
            title = (
                f"{out_group} study {slugify(path.stem)}".lower()
                if is_unknown(path)
                else title_from_stem(path.stem).lower()
            )
            dedupe_key = f"{out_category}:{title}"
            if dedupe_key in best and best[dedupe_key][0] >= score:
                print(f"  skip (duplicate of sharper shot): {file_rel}")
                continue
            if dedupe_key in best:
                print(
                    f"  skip (duplicate of sharper shot): "
                    f"{best[dedupe_key][1].relative_to(SOURCE)}"
                )
            best[dedupe_key] = (score, path, out_slug, out_category, out_group)
        for _, path, out_slug, out_category, out_group in sorted(
            best.values(), key=lambda item: item[1].name.lower()
        ):
            results.append((path, out_slug, out_category, out_group))
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
        width, height = convert(src, dest)

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
            f"    width: {width},\n"
            f"    height: {height},\n"
            f"    title: {json.dumps(title)},\n"
            f"    alt: {json.dumps(alt)},\n"
            f'    category: "{category}",\n'
            f"    group: {json.dumps(group)},\n"
            f"    featured: {featured},\n"
            "  }"
        )
        index += 1
        print(f"  {src.relative_to(SOURCE)} → {dest.relative_to(ROOT)} [{category}/{group}]")

    body = ",\n".join(entries)
    content = f"""export type ImageCategory =
  | "largePremium"
  | "premium"
  | "double"
  | "large"
  | "twin"
  | "dining"
  | "drinksLounge"
  | "rooftop"
  | "floor3Lounge"
  | "lobby"
  | "view";

export type HotelImage = {{
  id: string;
  src: string;
  width: number;
  height: number;
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

export const imagesByGroup = (group: string) =>
  hotelImages.filter((image) => image.group === group);

export const firstImage = (category: ImageCategory) =>
  imagesByCategory(category)[0];

export const imageBySrc = (src: string) =>
  hotelImages.find((image) => image.src === src);
"""
    OUT_TS.write_text(content, encoding="utf-8")
    print(f"\nWrote {len(entries)} images to {OUT_TS}")


if __name__ == "__main__":
    main()
