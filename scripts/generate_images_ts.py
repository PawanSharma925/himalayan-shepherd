import json
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

TITLES = {
    "presidential-suite-hotel-bedroom-with-king-bed-and-daybed.jpg": (
        "Daybed and king",
        "Presidential Suite with a king bed and a daybed at Himalayan Shepherd, Pokhara",
    ),
    "presidential-suite-king-bed-room-with-daybed.jpg": (
        "Inside the suite",
        "Presidential Suite looking toward the daybed at Himalayan Shepherd, Pokhara",
    ),
    "presidential-suite-modern-hotel-bedroom-with-attached-bathroom.jpg": (
        "Through to the bath",
        "Presidential Suite with the ensuite bathroom in view at Himalayan Shepherd, Pokhara",
    ),
    "presidential-suite-modern-hotel-room-king-bed-daybed.jpg": (
        "The sitting side",
        "King bed and daybed in the Presidential Suite at Himalayan Shepherd, Pokhara",
    ),
    "presidential-suite-modern-hotel-room-with-king-bed-2.jpg": (
        "The wide king",
        "King bed in the Presidential Suite at Himalayan Shepherd, Pokhara",
    ),
    "presidential-suite-modern-hotel-room-with-king-bed-balcony.jpg": (
        "Doors to the balcony",
        "Presidential Suite with king bed and balcony doors at Himalayan Shepherd, Pokhara",
    ),
    "presidential-suite-modern-king-bedroom-with-chaise-lounge.jpg": (
        "Chaise by the bed",
        "Chaise beside the king bed in the Presidential Suite at Himalayan Shepherd, Pokhara",
    ),
    "cozy-modern-hotel-room-king-bed.jpg": (
        "A quiet king",
        "Deluxe King Room at Himalayan Shepherd, Pokhara",
    ),
    "hotel-bedroom-with-king-bed.jpg": (
        "Warm wood",
        "King bed in a deluxe room at Himalayan Shepherd, Pokhara",
    ),
    "modern-hotel-bedroom-king-bed-2.jpg": (
        "Lamp light",
        "Deluxe King Room in warm light at Himalayan Shepherd, Pokhara",
    ),
    "modern-hotel-bedroom-king-bed.jpg": (
        "The king room",
        "Composed king bedroom at Himalayan Shepherd, Pokhara",
    ),
    "modern-hotel-room-with-king-bed-3.jpg": (
        "Wooden headboard",
        "King room with a timber headboard at Himalayan Shepherd, Pokhara",
    ),
    "cozy-hotel-room-with-queen-bed.jpg": (
        "The queen room",
        "Deluxe Queen Room at Himalayan Shepherd, Pokhara",
    ),
    "modern-hotel-room-with-queen-bed.jpg": (
        "For two",
        "Intimate queen room at Himalayan Shepherd, Pokhara",
    ),
    "two-twin-beds-hotel-room.jpg": (
        "The family suite",
        "Family Suite with two beds at Himalayan Shepherd, Pokhara",
    ),
    "two-twin-beds-with-modern-headboard.jpg": (
        "Two beds",
        "Two beds with a modern headboard in the Family Suite at Himalayan Shepherd, Pokhara",
    ),
    "two-twin-beds-with-shared-nightstand.jpg": (
        "Between the beds",
        "Twin beds sharing a nightstand in the Family Suite at Himalayan Shepherd, Pokhara",
    ),
    "two-twin-beds-with-wooden-headboard.jpg": (
        "Wooden headboards",
        "Family Suite with wooden headboards at Himalayan Shepherd, Pokhara",
    ),
    "modern-bathroom-with-glass-shower-stall.jpg": (
        "Glass shower",
        "Glass shower in an ensuite bathroom at Himalayan Shepherd, Pokhara",
    ),
    "modern-bathroom-with-white-tiled-shower.jpg": (
        "White tiles",
        "White tiled ensuite shower at Himalayan Shepherd, Pokhara",
    ),
    "modern-marble-tiled-shower-enclosure.jpg": (
        "Marble shower",
        "Marble shower enclosure at Himalayan Shepherd, Pokhara",
    ),
    "modern-stone-tiled-bathroom-interior.jpg": (
        "Stone bath",
        "Stone-tiled ensuite bathroom at Himalayan Shepherd, Pokhara",
    ),
    "hotel-front-desk-reception-logo-sign.jpg": (
        "Front desk",
        "Front desk at Himalayan Shepherd, Pokhara",
    ),
    "hotel-hallway-with-seating-area.jpg": (
        "The hallway",
        "Hallway seating outside the rooms at Himalayan Shepherd, Pokhara",
    ),
    "hotel-reception-desk-with-illuminated-sign.jpg": (
        "Reception",
        "Reception desk beneath the Himalayan Shepherd emblem, Pokhara",
    ),
    "hotel-reception-desk-with-logo-signage.jpg": (
        "The house sign",
        "Illuminated Himalayan Shepherd sign above reception in Pokhara",
    ),
    "cozy-armchairs-by-window-view.jpg": (
        "By the window",
        "Yellow lounge chairs by the window at Himalayan Shepherd, Pokhara",
    ),
    "indoor-seating-area-with-rattan-furniture.jpg": (
        "The lounge",
        "Rattan lounge opening to the balcony at Himalayan Shepherd, Pokhara",
    ),
    "rattan-furniture-set-with-green-cushions.jpg": (
        "Green cushions",
        "Rattan seating with green cushions at Himalayan Shepherd, Pokhara",
    ),
    "rattan-furniture-with-green-cushions.jpg": (
        "Rattan seating",
        "Lounge rattan furniture at Himalayan Shepherd, Pokhara",
    ),
    "rattan-sofa-set-in-lounge.jpg": (
        "The sofas",
        "Rattan sofas in the lounge at Himalayan Shepherd, Pokhara",
    ),
    "two-yellow-armchairs-round-table.jpg": (
        "Yellow armchairs",
        "Two yellow armchairs by a round table at Himalayan Shepherd, Pokhara",
    ),
    "outdoor-terrace-seating-with-rattan-chairs.jpg": (
        "The patio",
        "Patio seating with rattan chairs at Himalayan Shepherd, Pokhara",
    ),
    "outdoor-terrace-seating-with-street-view.jpg": (
        "Over the street",
        "Terrace looking over Lakeside streets at Himalayan Shepherd, Pokhara",
    ),
    "outdoor-terrace-seating-with-tables.jpg": (
        "Tables outside",
        "Outdoor tables on the terrace at Himalayan Shepherd, Pokhara",
    ),
    "outdoor-terrace-seating-with-wicker-chairs.jpg": (
        "Wicker chairs",
        "Wicker chairs on the terrace at Himalayan Shepherd, Pokhara",
    ),
    "cafe-dining-area-with-cushioned-seating.jpg": (
        "The café",
        "Café seating at Himalayan Shepherd, Pokhara",
    ),
    "cafe-seating-with-blue-cushioned-benches.jpg": (
        "Breakfast booths",
        "Blue booth seating in the breakfast court at Himalayan Shepherd, Pokhara",
    ),
    "cappuccino-with-heart-latte-art.jpg": (
        "Morning coffee",
        "Cappuccino with heart latte art at Himalayan Shepherd, Pokhara",
    ),
    "hotel-breakfast-area-with-tables-chairs.jpg": (
        "Breakfast tables",
        "Breakfast tables at Himalayan Shepherd, Pokhara",
    ),
    "restaurant-dining-room-with-colorful-chairs.jpg": (
        "The dining court",
        "Dining room with blue and yellow chairs at Himalayan Shepherd, Pokhara",
    ),
    "restaurant-seating-with-yellow-chairs.jpg": (
        "Yellow chairs",
        "Dining seating with yellow chairs at Himalayan Shepherd, Pokhara",
    ),
    "wooden-dining-table-and-hotel-room-doors.jpg": (
        "Near the rooms",
        "Wooden dining table near the room corridor at Himalayan Shepherd, Pokhara",
    ),
    "wooden-wardrobe-with-rattan-detailing.jpg": (
        "The wardrobe",
        "Timber wardrobe with rattan panels at Himalayan Shepherd, Pokhara",
    ),
}

SKIP = {
    "himalayan-shepherd-reception-emblem.jpg",
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
            if path.name in SKIP:
                continue
            src = f"/images/hotel/{folder}/{path.name}"
            title, alt = TITLES.get(
                path.name,
                (
                    title_from_name(path.name),
                    f"{title_from_name(path.name)} at Himalayan Shepherd, Pokhara",
                ),
            )
            featured = "true" if path.name in FEATURED else "false"
            entries.append(
                "  {\n"
                f'    id: "{category}-{index}",\n'
                f'    src: "{src}",\n'
                f'    title: {json.dumps(title)},\n'
                f'    alt: {json.dumps(alt)},\n'
                f'    category: "{category}",\n'
                f'    group: {json.dumps(group)},\n'
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
