"use client";

import { useState } from "react";
import { Users, Layout } from "lucide-react";
import { ROOM_TIERS } from "@/lib/rooms";
import { imagesByCategory, type HotelImage } from "@/lib/images";
import { Reveal } from "./Reveal";
import { WhatsAppButton } from "./WhatsAppButton";
import { Lightbox } from "./Lightbox";

export function Rooms() {
  const [active, setActive] = useState<HotelImage | null>(null);

  return (
    <section id="rooms" className="bg-cream px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="kicker">Stay</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-8 font-serif text-4xl text-ink md:text-5xl">
            Four distinct rooms. No overlap, no guesswork.
          </h2>
          <p className="mt-6 text-[17px] leading-8 text-ink-soft">
            The Presidential Suite is kept entirely apart from the standard
            rooms — a private lounge, chaise, and balcony that never appear in
            the king, queen, or family galleries.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {ROOM_TIERS.map((room, index) => (
            <Reveal key={room.id} delay={index * 0.08}>
              <article className="group overflow-hidden bg-paper shadow-[0_20px_50px_rgba(23,20,16,0.06)]">
                <button
                  type="button"
                  className="relative block aspect-[16/11] w-full overflow-hidden"
                  onClick={() =>
                    setActive({
                      id: `${room.id}-cover`,
                      src: room.cover,
                      title: room.name,
                      alt: room.name,
                      category: room.id,
                      group: room.name,
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={room.cover}
                    alt={room.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-5 top-5 rounded-full bg-ink/80 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cream">
                    {room.eyebrow}
                  </span>
                </button>
                <div className="p-7 md:p-8">
                  <h3 className="font-serif text-3xl text-ink">{room.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-soft">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-gold-deep" />
                      {room.capacity}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Layout className="h-4 w-4 text-gold-deep" />
                      {room.layout}
                    </span>
                  </div>
                  <p className="mt-5 text-[15px] leading-7 text-ink-soft">
                    {room.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {room.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-sand bg-cream px-3 py-1 text-xs tracking-wide text-ink-soft"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <WhatsAppButton
                      variant="gold"
                      message={room.inquireMessage}
                      label="Inquire on WhatsApp"
                    />
                    <button
                      type="button"
                      className="text-sm tracking-wide text-ink-soft underline decoration-gold/60 underline-offset-4"
                      onClick={() => setActive(imagesByCategory(room.id)[0])}
                    >
                      View {imagesByCategory(room.id).length} photographs
                    </button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Lightbox
        image={active}
        images={active ? imagesByCategory(active.category) : []}
        onClose={() => setActive(null)}
        onSelect={setActive}
      />
    </section>
  );
}
