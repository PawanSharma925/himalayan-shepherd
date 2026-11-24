"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { hotelImages, type HotelImage, type ImageCategory } from "@/lib/images";
import { Reveal } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { SmartImage } from "./SmartImage";

type Filter = {
  id: string;
  label: string;
  match: (image: HotelImage) => boolean;
};

const FILTERS: Filter[] = [
  { id: "all", label: "All", match: () => true },
  {
    id: "dining",
    label: "Dining Room",
    match: (image) => image.category === "dining",
  },
  {
    id: "diningPatio",
    label: "Dining Patio",
    match: (image) => image.category === "diningPatio",
  },
  {
    id: "building",
    label: "Entrance & Building",
    match: (image) => image.category === "building",
  },
  {
    id: "drinksLounge",
    label: "Coffee & Drinks Lounge",
    match: (image) => image.category === "drinksLounge",
  },
  {
    id: "rooftop",
    label: "Rooftop Terrace",
    match: (image) => image.category === "rooftop",
  },
  {
    id: "floor3Lounge",
    label: "Floor 3 Standard Room Lounge",
    match: (image) => image.category === "floor3Lounge",
  },
  {
    id: "floor2Lounge",
    label: "Floor 2 Premium Room Lounge",
    match: (image) => image.group === "Floor 2 Premium Room Lounge",
  },
  { id: "view", label: "Views", match: (image) => image.category === "view" },
];

const ROOM_CATEGORIES: ImageCategory[] = [
  "largePremium",
  "premium",
  "large",
  "double",
  "twin",
];

const roomSetFor = (category: ImageCategory) => {
  if (category === "largePremium" || category === "premium") {
    return new Set<ImageCategory>(["largePremium", "premium"]);
  }
  if (category === "large" || category === "double" || category === "twin") {
    return new Set<ImageCategory>(["large", "double", "twin"]);
  }
  return new Set<ImageCategory>([category]);
};

const DESKTOP_ROW = 300;
const CONTAINER = 1280;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function tileShape(image: HotelImage) {
  const ratio = image.width / image.height;
  const desktop = clamp(ratio, 0.7, 4);
  const mobile = clamp(ratio, 0.75, 2);
  const desktopPx = Math.min(CONTAINER, desktop * DESKTOP_ROW * 1.6) * Math.max(1, ratio / desktop);
  const mobileVw = 100 * Math.max(1, ratio / mobile);
  return {
    ratio,
    desktop: desktop.toFixed(3),
    mobile: mobile.toFixed(3),
    sizes: `(max-width: 767px) ${Math.ceil(mobileVw)}vw, ${Math.ceil(desktopPx)}px`,
  };
}

export function Gallery() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<HotelImage | null>(null);

  const visible = useMemo(() => {
    const selected = FILTERS.find((item) => item.id === filter) ?? FILTERS[0];
    return hotelImages.filter(selected.match);
  }, [filter]);

  const lightboxSet = useMemo(() => {
    if (!active) return visible;
    if (ROOM_CATEGORIES.includes(active.category)) {
      const set = roomSetFor(active.category);
      return hotelImages.filter((image) => set.has(image.category));
    }
    return visible;
  }, [active, visible]);

  return (
    <section id="gallery" className="bg-cream px-4 py-16 sm:px-5 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="kicker">Photobook</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-6 font-serif text-[2rem] leading-tight text-ink sm:mt-8 sm:text-4xl md:text-5xl">
            The Hotel, room by room.
          </h2>
        </Reveal>

        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-10 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                filter === item.id
                  ? "bg-ink text-cream"
                  : "border border-sand bg-paper text-ink-soft hover:border-gold"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm text-ink-soft md:mt-6">
          {visible.length} photographs · tap any one to see it full screen
        </p>

        <div className="lookbook mt-4 md:mt-6">
          {visible.map((image) => {
            const { ratio, desktop, mobile, sizes } = tileShape(image);
            return (
              <button
                key={image.id}
                type="button"
                style={{ "--r": desktop, "--rm": mobile } as CSSProperties}
                className="group relative w-full overflow-hidden bg-sand/40 md:w-auto"
                onClick={() => setActive(image)}
                aria-label={`Open ${image.title}`}
              >
                <SmartImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={sizes}
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                {ratio > 2.2 ? (
                  <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-ink/55 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur-sm md:opacity-0 md:transition md:group-hover:opacity-100">
                    Panorama
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
      <Lightbox image={active} images={lightboxSet} onClose={() => setActive(null)} onSelect={setActive} />
    </section>
  );
}
