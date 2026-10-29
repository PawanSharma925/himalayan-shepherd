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
    id: "presidential",
    name: "Presidential Suite",
    eyebrow: "Flagship suite",
    capacity: "2 guests",
    layout: "King bed · private chaise lounge · balcony",
    description:
      "Our most generous room: a wide living plane, a private chaise beside the bed, and glass doors that open to the balcony. Quiet, slow, and unmistakably the suite.",
    cover:
      "/images/hotel/rooms_presidential_suite/presidential-suite-modern-hotel-room-with-king-bed-balcony.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "Lounge chaise", "Balcony"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about the Presidential Suite in Pokhara.",
  },
  {
    id: "king",
    name: "Deluxe King Room",
    eyebrow: "For two",
    capacity: "2 guests",
    layout: "King bed · writing nook · city light",
    description:
      "A composed king room with warm timber, soft linen, and a calm, uncluttered plan. Made for unhurried evenings after the lake or the trail.",
    cover: "/images/hotel/rooms_king_bed/modern-hotel-bedroom-king-bed.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "City view"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Deluxe King Room in Pokhara.",
  },
  {
    id: "queen",
    name: "Deluxe Queen Room",
    eyebrow: "Intimate",
    capacity: "2 guests",
    layout: "Queen bed · compact deluxe",
    description:
      "A quieter, more intimate chamber for couples. The same considered materials, scaled for two people who want the city close and the room still.",
    cover: "/images/hotel/rooms_queen_bed/cozy-hotel-room-with-queen-bed.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "Couple's stay"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Deluxe Queen Room in Pokhara.",
  },
  {
    id: "family",
    name: "Family Suite",
    eyebrow: "Together",
    capacity: "3–4 guests",
    layout: "Twin beds · shared nightstand · family plan",
    description:
      "Two generous beds in a bright, practical room. Space for children, friends, or a second couple travelling as one party.",
    cover: "/images/hotel/rooms_family_room/two-twin-beds-hotel-room.jpg",
    tags: ["Wi-Fi", "En-suite bathroom", "Wardrobe", "Two beds"],
    inquireMessage:
      "Hello Himalayan Shepherd, I would like to inquire about a Family Suite in Pokhara.",
  },
];

export const roomGallery = (id: ImageCategory) => imagesByCategory(id);
