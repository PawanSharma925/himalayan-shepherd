from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOTEL = ROOT / "public" / "images" / "hotel"
OUT = ROOT / "lib" / "images.ts"

FOLDER_META = {
    "rooms_presidential_suite": ("presidential", "Presidential Suite"),
    "rooms_king_bed": ("king", "Deluxe King Room"),
    "rooms_queen_bed": ("queen", "Deluxe Queen Room"),
    "rooms_family_room": ("family", "Family Suite"),
    "bathrooms": ("bathrooms", "Bathrooms"),
    "lobby_and_front_desk": ("lobby", "Lobby & Front Desk"),
    "lounge_and_seating": ("lounge", "Lounge"),
    "patio_and_rooftop": ("patio", "Rooftop & Patio"),
    "dining_and_food_court": ("dining", "Dining"),
    "closets_and_details": ("details", "Details"),
}

FEATURED = {
    "presidential-suite-modern-hotel-room-with-king-bed-balcony.jpg",
    "presidential-suite-modern-king-bedroom-with-chaise-lounge.jpg",
    "modern-hotel-bedroom-king-bed.jpg",
    "cozy-hotel-room-with-queen-bed.jpg",
    "two-twin-beds-hotel-room.jpg",
    "modern-marble-tiled-shower-enclosure.jpg",
    "hotel-reception-desk-with-logo-signage.jpg",
    "indoor-seating-area-with-rattan-furniture.jpg",
    "two-yellow-armchairs-round-table.jpg",
    "outdoor-terrace-seating-with-street-view.jpg",
    "cafe-seating-with-blue-cushioned-benches.jpg",
    "cappuccino-with-heart-latte-art.jpg",
    "restaurant-dining-room-with-colorful-chairs.jpg",
    "wooden-wardrobe-with-rattan-detailing.jpg",
}


def title_from_name(name: str) -> str:
    stem = Path(name).stem
    if stem.startswith("presidential-suite-"):
        stem = stem[len("presidential-suite-") :]
    words = stem.replace("_", "-").split("-")
    cleaned = []
    skip_next_num = False
    for word in words:
        if word.isdigit():
            continue
        cleaned.append(word)
    text = " ".join(cleaned).strip()
    return text[:1].upper() + text[1:] if text else "Hotel photograph"


def main() -> None:
    entries: list[str] = []
    index = 0
    for folder, (category, group) in FOLDER_META.items():
        directory = HOTEL / folder
        if not directory.exists():
            continue
        for path in sorted(directory.iterdir(), key=lambda p: p.name.lower()):
            if path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                continue
            src = f"/images/hotel/{folder}/{path.name}"
            title = title_from_name(path.name)
            alt = f"{title} at Hotel Himalayan Shepherd, Pokhara"
            featured = "true" if path.name in FEATURED else "false"
            entries.append(
                "  {\n"
                f'    id: "{category}-{index}",\n'
                f'    src: "{src}",\n'
                f'    title: {title!r},\n'
                f'    alt: {alt!r},\n'
                f'    category: "{category}",\n'
                f'    group: {group!r},\n'
                f"    featured: {featured},\n"
                "  }"
            )
            index += 1

    body = ",\n".join(entries)
    content = f'''export type ImageCategory =
  | "presidential"
  | "king"
  | "queen"
  | "family"
  | "bathrooms"
  | "lobby"
  | "lounge"
  | "patio"
  | "dining"
  | "details";

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
'''
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(content, encoding="utf-8")
    print(f"Wrote {len(entries)} images to {OUT}")


if __name__ == "__main__":
    main()
