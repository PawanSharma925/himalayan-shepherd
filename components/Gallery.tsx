"use client";

import { useMemo, useState } from "react";
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
  {
    id: "presidential",
    label: "Presidential Suite",
    match: (image) => image.category === "presidential",
  },
  { id: "king", label: "King Rooms", match: (image) => image.category === "king" },
  { id: "queen", label: "Queen Rooms", match: (image) => image.category === "queen" },
  { id: "family", label: "Family Rooms", match: (image) => image.category === "family" },
  {
    id: "patio",
    label: "Rooftop & Patio",
    match: (image) => image.category === "patio",
  },
  {
    id: "dining-lounge",
    label: "Dining & Lounge",
    match: (image) => image.category === "dining" || image.category === "lounge",
  },
  {
    id: "bathrooms",
    label: "Bathrooms",
    match: (image) => image.category === "bathrooms",
  },
];

const ROOM_CATEGORIES: ImageCategory[] = ["presidential", "king", "queen", "family"];

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

        <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-8 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-7">
          {visible.map((image, index) => {
            const featuredLead = filter === "featured" && index === 0;
            return (
              <button
                key={image.id}
                type="button"
                className={`group relative w-full overflow-hidden ${
                  featuredLead
                    ? "aspect-[4/3] md:col-span-2 md:aspect-[16/10] lg:col-span-2"
                    : "aspect-[4/3] md:aspect-[4/5]"
                }`}
                onClick={() => setActive(image)}
              >
                <SmartImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes={
                    featuredLead
                      ? "(max-width: 768px) 100vw, 66vw"
                      : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  }
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent px-4 pb-3.5 pt-10 text-left font-serif text-[17px] leading-snug text-cream md:px-5 md:pb-4 md:text-lg md:opacity-0 md:transition md:group-hover:opacity-100">
                  {image.title}
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
