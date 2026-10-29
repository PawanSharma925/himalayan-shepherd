"use client";

import { useMemo, useState } from "react";
import { hotelImages, type HotelImage, type ImageCategory } from "@/lib/images";
import { Reveal } from "./Reveal";
import { Lightbox } from "./Lightbox";

type Filter = {
  id: string;
  label: string;
  match: (image: HotelImage) => boolean;
};

const FILTERS: Filter[] = [
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
  const [filter, setFilter] = useState("all");
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
    <section id="gallery" className="bg-cream px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="kicker">Lookbook</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-8 font-serif text-4xl text-ink md:text-5xl">The house, room by room.</h2>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
                filter === item.id
                  ? "bg-ink text-cream"
                  : "border border-sand bg-paper text-ink-soft hover:border-gold"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visible.map((image) => (
            <button
              key={image.id}
              type="button"
              className="mb-4 block w-full break-inside-avoid overflow-hidden"
              onClick={() => setActive(image)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.alt}
                className="w-full object-cover transition duration-700 hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </div>
      <Lightbox image={active} images={lightboxSet} onClose={() => setActive(null)} onSelect={setActive} />
    </section>
  );
}
