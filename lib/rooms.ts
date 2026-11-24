import { imagesByCategory, type HotelImage, type ImageCategory } from "./images";

export type RoomId = "king" | "double" | "twin";

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
    id: "king",
    categories: ["largePremium", "premium"],
    name: "King Room",
    eyebrow: "King bed",
    capacity: "2 guests",
    layout: "King bed · en-suite · wardrobe",
    description:
      "A generous king-bed room with soft night lighting and space to settle after the lake or the trail. Quiet, considered, and made for an unhurried stay.",
    cover: "/images/hotel/floor-2-large-premium/warm-nighttime-hotel-room-4.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "King bed", "Wardrobe"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a King Room in Pokhara.",
  },
  {
    id: "double",
    categories: ["double", "large"],
    name: "Double Room",
    eyebrow: "Double bed",
    capacity: "2 guests",
    layout: "Double bed · en-suite · wardrobe",
    description:
      "A composed double room with warm night lighting, soft linen, and a calm, uncluttered plan. Made for unhurried evenings after the lake.",
    cover: "/images/hotel/standard-double/warm-nighttime-standard-room-2.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Double bed", "Wardrobe"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Double Room in Pokhara.",
  },
  {
    id: "twin",
    categories: ["twin"],
    name: "Twin Room",
    eyebrow: "Twin beds",
    capacity: "2 guests",
    layout: "Twin beds · en-suite · wardrobe",
    description:
      "Two single beds side by side in a bright, practical room. Space for friends, siblings, or travellers who prefer separate beds without losing the hotel’s warmth.",
    cover:
      "/images/hotel/standard-twin/himalayan-shepherd-twin-room-warmly-retouched-5.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Twin beds", "Wardrobe"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Twin Room in Pokhara.",
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
