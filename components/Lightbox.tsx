"use client";

import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { HotelImage } from "@/lib/images";
import { ROOM_TIERS } from "@/lib/rooms";
import { SmartImage } from "./SmartImage";
import { PLAN_ROOM_EVENT } from "./StayPlanner";

const noopSubscribe = () => () => {};

type Props = {
  image: HotelImage | null;
  images: HotelImage[];
  onClose: () => void;
  onSelect: (image: HotelImage) => void;
};

export function Lightbox({ image, images, onClose, onSelect }: Props) {
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!image) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!images.length) return;
      const index = images.findIndex((item) => item.src === image.src);
      if (event.key === "ArrowRight") onSelect(images[(index + 1) % images.length]);
      if (event.key === "ArrowLeft")
        onSelect(images[(index - 1 + images.length) % images.length]);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [image, images, onClose, onSelect]);

  const index = image ? images.findIndex((item) => item.src === image.src) : -1;
  const room = image
    ? ROOM_TIERS.find((tier) => tier.categories.includes(image.category))
    : undefined;

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/92 p-3 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="absolute right-5 top-5 z-10 text-white"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <X className="h-7 w-7" />
          </button>
          {index >= 0 && images.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 z-10 text-white md:left-8"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(images[(index - 1 + images.length) % images.length]);
                }}
                aria-label="Previous photograph"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                type="button"
                className="absolute right-4 z-10 text-white md:right-8"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelect(images[(index + 1) % images.length]);
                }}
                aria-label="Next photograph"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          ) : null}
          <motion.figure
            key={image.src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex h-[78vh] w-[min(100%,72rem)] flex-col md:h-[86vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              <SmartImage
                src={image.src}
                alt={image.alt}
                fill
                sizes="90vw"
                quality={90}
                className="object-contain"
              />
            </div>
            <figcaption className="flex flex-col items-center gap-3 pt-4 text-center sm:flex-row sm:justify-between sm:text-left">
              {index >= 0 && images.length > 1 ? (
                <span className="text-xs uppercase tracking-[0.2em] text-cream/60">
                  {index + 1} / {images.length}
                </span>
              ) : (
                <span />
              )}
              {room ? (
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-cream"
                  onClick={() => {
                    onClose();
                    window.setTimeout(() => {
                      window.dispatchEvent(new CustomEvent(PLAN_ROOM_EVENT, { detail: room.id }));
                    }, 60);
                  }}
                >
                  <CalendarDays className="h-4 w-4" />
                  Check dates for the {room.name}
                </button>
              ) : null}
            </figcaption>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
