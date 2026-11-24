import { imagesByCategory, type HotelImage, type ImageCategory } from "./images";

export type RoomId = "premium" | "standard";

export type RoomTier = {
  id: RoomId;
  categories: ImageCategory[];
  name: string;
  eyebrow: string;
  capacity: string;
  layout: string;
  description: string;
  cover: string;
  tags: string[];
  inquireMessage: string;
};

export const ROOM_TIERS: RoomTier[] = [
  {
    id: "premium",
    categories: ["largePremium", "premium"],
    name: "Premium Room",
    eyebrow: "King or twin",
    capacity: "2 guests",
    layout: "King bed or twin beds · en-suite",
    description:
      "Our Premium Rooms offer a king bed or twin beds, soft night lighting, and space to settle after the lake or the trail. Quiet, considered, and made for an unhurried stay.",
    cover: "/images/hotel/floor-2-large-premium/warm-nighttime-hotel-room-4.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "King or twin", "Wardrobe"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Premium Room in Pokhara (king bed or twin beds).",
  },
  {
    id: "standard",
    categories: ["large", "double", "twin"],
    name: "Standard Room",
    eyebrow: "Double or twin",
    capacity: "2 guests",
    layout: "Double bed or twin beds · en-suite",
    description:
      "Our Standard Rooms come with a double bed or twin beds, warm timber, and a calm, practical plan. Comfortable and unhurried for evenings after the lake.",
    cover: "/images/hotel/standard-double/warm-nighttime-standard-room-2.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Double or twin", "Wardrobe"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Standard Room in Pokhara (double bed or twin beds).",
  },
];

export const roomPhotos = (room: RoomTier): HotelImage[] => {
  const seen = new Set<string>();
  const all: HotelImage[] = [];
  for (const category of room.categories) {
    for (const image of imagesByCategory(category)) {
      if (seen.has(image.src)) continue;
      seen.add(image.src);
      all.push(image);
    }
  }
  const cover = all.find((image) => image.src === room.cover);
  return cover ? [cover, ...all.filter((image) => image !== cover)] : all;
};

export const roomGallery = (id: RoomId) => {
  const room = ROOM_TIERS.find((tier) => tier.id === id);
  return room ? roomPhotos(room) : [];
};
