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
  { id: "featured", label: "Highlights", match: (image) => image.featured },
  { id: "all", label: "All", match: () => true },
  { id: "view", label: "Views", match: (image) => image.category === "view" },
  {
    id: "exec",
    label: "Executive Suite",
    match: (image) => image.category === "exec",
  },
  {
    id: "premium",
    label: "Premium Rooms",
    match: (image) => image.category === "premium",
  },
  {
    id: "large",
    label: "Large Rooms",
    match: (image) => image.category === "large",
  },
  {
    id: "double",
    label: "Double Rooms",
    match: (image) => image.category === "double",
  },
  {
    id: "twin",
    label: "Twin Rooms",
    match: (image) => image.category === "twin",
  },
  {
    id: "sundeck",
    label: "Sundeck",
    match: (image) => image.category === "sundeck",
  },
  {
    id: "restaurant-lobby",
    label: "Dining & Lobby",
    match: (image) =>
      image.category === "restaurant" || image.category === "lobby",
  },
];

const ROOM_CATEGORIES: ImageCategory[] = [
  "exec",
  "premium",
  "large",
  "double",
  "twin",
];

const DESKTOP_ROW = 300;
const CONTAINER = 1280;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// object-cover crops when a tile is narrower than its photo, so the requested
// width must be scaled up by ratio / tileRatio or the browser fetches a file
// sized for the tile's width and stretches it to fill the height.
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
  const [filter, setFilter] = useState("featured");
  const [active, setActive] = useState<HotelImage | null>(null);

  const visible = useMemo(() => {
    const selected = FILTERS.find((item) => item.id === filter) ?? FILTERS[0];
    return hotelImages.filter(selected.match);
  }, [filter]);

  const lightboxSet = useMemo(() => {
    if (!active) return visible;
    if (ROOM_CATEGORIES.includes(active.category)) {
      return hotelImages.filter((image) => image.category === active.category);
    }
    return visible;
  }, [active, visible]);

  return (
    <section id="gallery" className="bg-cream px-4 py-16 sm:px-5 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="kicker">Lookbook</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-6 font-serif text-[2rem] leading-tight text-ink sm:mt-8 sm:text-4xl md:text-5xl">
            The house, room by room.
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
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent px-4 pb-3.5 pt-10 text-left md:px-5 md:pb-4 md:opacity-0 md:transition md:group-hover:opacity-100">
                  <span className="font-serif text-[17px] leading-snug text-cream md:text-lg">
                    {image.title}
                  </span>
                  {ratio > 2.2 ? (
                    <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-gold">
                      Panorama
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <Lightbox image={active} images={lightboxSet} onClose={() => setActive(null)} onSelect={setActive} />
    </section>
  );
}
