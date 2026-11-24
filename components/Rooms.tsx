"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Expand,
  Layout,
  Users,
} from "lucide-react";
import { ROOM_TIERS, roomPhotos, type RoomId } from "@/lib/rooms";
import type { HotelImage } from "@/lib/images";
import { Reveal } from "./Reveal";
import { Lightbox } from "./Lightbox";
import { PLAN_ROOM_EVENT } from "./StayPlanner";
import { SmartImage } from "./SmartImage";

export function Rooms() {
  const [roomId, setRoomId] = useState<RoomId>(ROOM_TIERS[0].id);
  const [photo, setPhoto] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightbox, setLightbox] = useState<HotelImage | null>(null);

  const room = ROOM_TIERS.find((tier) => tier.id === roomId) ?? ROOM_TIERS[0];
  const photos = useMemo(() => roomPhotos(room), [room]);
  const current = photos[Math.min(photo, photos.length - 1)];
  const portrait = current.height > current.width;

  const selectRoom = (id: RoomId) => {
    setRoomId(id);
    setPhoto(0);
  };

  const step = (delta: number) => {
    setDirection(delta);
    setPhoto((value) => (value + delta + photos.length) % photos.length);
  };

  return (
    <section id="rooms" className="bg-cream px-4 py-16 sm:px-5 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="kicker">Stay</p>
          <div className="gold-rule mt-5" />
        </Reveal>

        <div
          role="tablist"
          aria-label="Rooms"
          className="-mx-4 mt-8 flex gap-1 overflow-x-auto border-b border-sand px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 md:mt-10 [&::-webkit-scrollbar]:hidden"
        >
          {ROOM_TIERS.map((tier) => {
            const selected = tier.id === roomId;
            return (
              <button
                key={tier.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectRoom(tier.id)}
                className={`relative shrink-0 px-4 pb-4 pt-2 text-left transition md:px-6 ${
                  selected ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="block text-[10px] uppercase tracking-[0.22em] text-gold-deep">
                  {tier.eyebrow}
                </span>
                <span className="mt-1 block font-serif text-xl md:text-2xl">{tier.name}</span>
                {selected ? (
                  <motion.span
                    layoutId="room-tab"
                    className="absolute inset-x-3 -bottom-px h-0.5 bg-gold md:inset-x-5"
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:mt-8 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          <div className="min-w-0">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={current.src}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  drag={photos.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) step(1);
                    else if (info.offset.x > 60) step(-1);
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <SmartImage
                    src={current.src}
                    alt={current.alt}
                    fill
                    priority={false}
                    draggable={false}
                    sizes="(max-width: 1024px) 100vw, 760px"
                    className={`pointer-events-none select-none ${portrait ? "object-contain" : "object-cover"}`}
                  />
                </motion.div>
              </AnimatePresence>

              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-ink/55 to-transparent px-4 pb-3 pt-10 text-cream md:px-5 md:pb-4">
                <span className="shrink-0 text-xs tabular-nums tracking-[0.18em] text-cream/80">
                  {photo + 1} / {photos.length}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setLightbox(current)}
                aria-label="View full screen"
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-ink/60 text-cream backdrop-blur transition hover:bg-ink"
              >
                <Expand className="h-4 w-4" />
              </button>
              {photos.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-ink shadow transition hover:bg-cream md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-cream/90 text-ink shadow transition hover:bg-cream md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              ) : null}
            </div>

            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
              {photos.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => {
                    setDirection(index > photo ? 1 : -1);
                    setPhoto(index);
                  }}
                  aria-label={`Show ${image.title}`}
                  className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg transition md:h-[72px] md:w-24 ${
                    index === photo
                      ? "ring-2 ring-gold ring-offset-2 ring-offset-cream"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <SmartImage
                    src={image.src}
                    alt=""
                    fill
                    sizes="96px"
                    quality={75}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col rounded-2xl bg-paper p-5 shadow-[0_20px_50px_rgba(23,20,16,0.06)] sm:p-7 lg:p-8"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.22em] text-gold-deep">
                  {room.eyebrow}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-[2rem] leading-tight text-ink md:text-4xl">
                {room.name}
              </h3>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gold-deep" />
                  {room.capacity}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Layout className="h-4 w-4 text-gold-deep" />
                  {room.layout}
                </span>
              </div>
              <p className="mt-5 text-[15px] leading-7 text-ink-soft">{room.description}</p>
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
              <div className="mt-auto pt-8">
                <button
                  type="button"
                  onClick={() =>
                    window.dispatchEvent(new CustomEvent(PLAN_ROOM_EVENT, { detail: room.id }))
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-gold-deep hover:text-white"
                >
                  <CalendarDays className="h-4 w-4" />
                  Check dates for the {room.name}
                </button>
                <p className="mt-3 text-center text-xs text-ink-soft">
                  No booking fees · the Shepherd replies personally on WhatsApp
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
      <Lightbox
        image={lightbox}
        images={photos}
        onClose={() => setLightbox(null)}
        onSelect={setLightbox}
      />
    </section>
  );
}
