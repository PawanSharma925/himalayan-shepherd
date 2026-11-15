import { imagesByCategory, type ImageCategory } from "./images";

export type RoomTier = {
  id: ImageCategory;
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
    id: "exec",
    name: "Executive Suite",
    eyebrow: "Flagship suite",
    capacity: "2 guests",
    layout: "King bed · lounge plane · evening light",
    description:
      "Our most generous room: a wide living plane, soft night lighting, and space to stretch after the lake or the trail. Quiet, slow, and unmistakably the suite.",
    cover: "/images/hotel/exec-suite/warmly-lit-executive-suite-at-night-1.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "Lounge seating"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about the Executive Suite in Pokhara.",
  },
  {
    id: "premium",
    name: "Premium Room",
    eyebrow: "Floor 2 · views",
    capacity: "2 guests",
    layout: "King bed · mountain light · Room 303 class",
    description:
      "Bright premium rooms on Floor 2 — clear windows, warm evening light, and on the best days a clean look toward the hills. Made for guests who came for the view.",
    cover: "/images/hotel/floor-2-premium/sunlit-hotel-room-clear-mountain-view-2.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Mountain light", "Floor 2"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Premium Room with a mountain view in Pokhara.",
  },
  {
    id: "double",
    name: "Double Room",
    eyebrow: "For two",
    capacity: "2 guests",
    layout: "Double bed · warm timber · standard floor",
    description:
      "A composed double room with warm night lighting, soft linen, and a calm, uncluttered plan. Made for unhurried evenings after the lake.",
    cover: "/images/hotel/standard-double/warm-nighttime-standard-room-1.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "Double bed"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Double Room in Pokhara.",
  },
  {
    id: "twin",
    name: "Twin Room",
    eyebrow: "Together",
    capacity: "2 guests",
    layout: "Twin beds · bright plan · shared stay",
    description:
      "Two twin beds in a bright, practical room. Space for friends, siblings, or travellers who prefer separate beds without losing the house’s warmth.",
    cover: "/images/hotel/standard-twin/bright-himalayan-shepherd-twin-room-7.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "Twin beds"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Twin Room in Pokhara.",
  },
];

export const roomGallery = (id: ImageCategory) => imagesByCategory(id);
