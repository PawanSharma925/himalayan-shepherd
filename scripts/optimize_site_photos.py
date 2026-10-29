"""Curate, brighten, and compress hotel photos for a fast luxury site."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
HOTEL = ROOT / "public" / "images" / "hotel"
MAX_EDGE = 2560
JPEG_QUALITY = 90

KEEP = {
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
}


def enhance(img: Image.Image) -> Image.Image:
    img = ImageOps.autocontrast(img, cutoff=1)
    img = ImageEnhance.Color(img).enhance(1.07)
    img = ImageEnhance.Contrast(img).enhance(1.05)
    img = ImageEnhance.Brightness(img).enhance(1.04)
    img = ImageEnhance.Sharpness(img).enhance(1.1)
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


def main() -> None:
    kept = 0
    removed = 0
    missing = []
    for rel in sorted(KEEP):
        path = HOTEL / rel.replace("/", "\\") if "\\" in str(HOTEL) else HOTEL / rel
        path = HOTEL / Path(*rel.split("/"))
        if not path.exists():
            missing.append(rel)
            continue
        with Image.open(path) as raw:
            img = ImageOps.exif_transpose(raw).convert("RGB")
            img = enhance(fit(img))
            img.save(path, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        kept += 1
        print(f"kept {rel} -> {path.stat().st_size // 1024}kb")

    for path in HOTEL.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
            continue
        rel = path.relative_to(HOTEL).as_posix()
        if rel not in KEEP:
            path.unlink()
            removed += 1

    for folder in HOTEL.iterdir():
        if folder.is_dir() and not any(folder.iterdir()):
            folder.rmdir()

    remaining = list(HOTEL.rglob("*.jpg"))
    total = sum(p.stat().st_size for p in remaining)
    print(f"\nkept={kept} removed={removed} remaining={len(remaining)} totalMB={total / 1_000_000:.1f}")
    if missing:
        print("missing keepers:")
        for item in missing:
            print(f"  {item}")


if __name__ == "__main__":
    main()
