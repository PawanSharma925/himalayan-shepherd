"""Restore keeper photos from git originals and re-export at desktop quality."""

from __future__ import annotations

import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HOTEL = ROOT / "public" / "images" / "hotel"
SOURCE_COMMIT = "85c428e"
MAX_EDGE = 2560
JPEG_QUALITY = 90

KEEP = [
    "rooms_presidential_suite/presidential-suite-modern-hotel-room-with-king-bed-balcony.jpg",
    "rooms_presidential_suite/presidential-suite-modern-hotel-room-king-bed-daybed.jpg",
    "rooms_presidential_suite/presidential-suite-modern-hotel-bedroom-with-attached-bathroom.jpg",
    "rooms_presidential_suite/presidential-suite-modern-king-bedroom-with-chaise-lounge.jpg",
    "rooms_presidential_suite/presidential-suite-king-bed-room-with-daybed.jpg",
    "rooms_presidential_suite/presidential-suite-modern-hotel-room-with-king-bed-2.jpg",
    "rooms_presidential_suite/presidential-suite-hotel-bedroom-with-king-bed-and-daybed.jpg",
    "rooms_king_bed/modern-hotel-bedroom-king-bed.jpg",
    "rooms_king_bed/modern-hotel-bedroom-king-bed-2.jpg",
    "rooms_king_bed/modern-hotel-room-with-king-bed-3.jpg",
    "rooms_king_bed/hotel-bedroom-with-king-bed.jpg",
    "rooms_king_bed/cozy-modern-hotel-room-king-bed.jpg",
    "rooms_queen_bed/cozy-hotel-room-with-queen-bed.jpg",
    "rooms_queen_bed/modern-hotel-room-with-queen-bed.jpg",
    "rooms_family_room/two-twin-beds-hotel-room.jpg",
    "rooms_family_room/two-twin-beds-with-wooden-headboard.jpg",
    "rooms_family_room/two-twin-beds-with-shared-nightstand.jpg",
    "rooms_family_room/two-twin-beds-with-modern-headboard.jpg",
    "bathrooms/modern-bathroom-with-glass-shower-stall.jpg",
    "bathrooms/modern-marble-tiled-shower-enclosure.jpg",
    "bathrooms/modern-stone-tiled-bathroom-interior.jpg",
    "bathrooms/modern-bathroom-with-white-tiled-shower.jpg",
    "lobby_and_front_desk/hotel-reception-desk-with-logo-signage.jpg",
    "lobby_and_front_desk/hotel-reception-desk-with-illuminated-sign.jpg",
    "lobby_and_front_desk/hotel-hallway-with-seating-area.jpg",
    "lobby_and_front_desk/hotel-front-desk-reception-logo-sign.jpg",
    "lounge_and_seating/indoor-seating-area-with-rattan-furniture.jpg",
    "lounge_and_seating/two-yellow-armchairs-round-table.jpg",
    "lounge_and_seating/rattan-furniture-with-green-cushions.jpg",
    "lounge_and_seating/cozy-armchairs-by-window-view.jpg",
    "lounge_and_seating/rattan-sofa-set-in-lounge.jpg",
    "lounge_and_seating/rattan-furniture-set-with-green-cushions.jpg",
    "patio_and_rooftop/outdoor-terrace-seating-with-street-view.jpg",
    "patio_and_rooftop/outdoor-terrace-seating-with-wicker-chairs.jpg",
    "patio_and_rooftop/outdoor-terrace-seating-with-tables.jpg",
    "patio_and_rooftop/outdoor-terrace-seating-with-rattan-chairs.jpg",
    "dining_and_food_court/cafe-seating-with-blue-cushioned-benches.jpg",
    "dining_and_food_court/cappuccino-with-heart-latte-art.jpg",
    "dining_and_food_court/restaurant-dining-room-with-colorful-chairs.jpg",
    "dining_and_food_court/hotel-breakfast-area-with-tables-chairs.jpg",
    "dining_and_food_court/wooden-dining-table-and-hotel-room-doors.jpg",
    "dining_and_food_court/cafe-dining-area-with-cushioned-seating.jpg",
    "dining_and_food_court/restaurant-seating-with-yellow-chairs.jpg",
    "closets_and_details/wooden-wardrobe-with-rattan-detailing.jpg",
]

LOCAL_ORIGINALS = {
    "lobby_and_front_desk/hotel-reception-desk-with-illuminated-sign.jpg": ROOT
    / "Hotel"
    / "IMG_4254.JPG",
}


def enhance(img: Image.Image) -> Image.Image:
    img = ImageOps.autocontrast(img, cutoff=0.4)
    img = ImageEnhance.Color(img).enhance(1.04)
    img = ImageEnhance.Contrast(img).enhance(1.03)
    img = ImageEnhance.Brightness(img).enhance(1.03)
    img = ImageEnhance.Sharpness(img).enhance(1.06)
    return img


def fit(img: Image.Image) -> Image.Image:
    width, height = img.size
    longest = max(width, height)
    if longest <= MAX_EDGE:
        return img
    scale = MAX_EDGE / float(longest)
    return img.resize(
        (max(1, int(width * scale)), max(1, int(height * scale))),
        Image.Resampling.LANCZOS,
    )


def load_original(rel: str) -> Image.Image:
    local = LOCAL_ORIGINALS.get(rel)
    if local and local.exists():
        with Image.open(local) as raw:
            return ImageOps.exif_transpose(raw).convert("RGB")

    git_path = f"public/images/hotel/{rel}"
    data = subprocess.check_output(
        ["git", "show", f"{SOURCE_COMMIT}:{git_path}"],
        cwd=ROOT,
    )
    with Image.open(BytesIO(data)) as raw:
        return ImageOps.exif_transpose(raw).convert("RGB")


def save(img: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def main() -> None:
    total = 0
    for rel in KEEP:
        path = HOTEL / Path(*rel.split("/"))
        img = enhance(fit(load_original(rel)))
        save(img, path)
        total += path.stat().st_size
        print(f"{rel} {img.size[0]}x{img.size[1]} {path.stat().st_size // 1024}kb")

    print(f"\nfiles={len(KEEP)} totalMB={total / 1_000_000:.1f}")


if __name__ == "__main__":
    main()
