"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { HotelImage } from "@/lib/images";

type Props = {
  image: HotelImage | null;
  images: HotelImage[];
  onClose: () => void;
  onSelect: (image: HotelImage) => void;
};

export function Lightbox({ image, images, onClose, onSelect }: Props) {
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

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            className="absolute right-5 top-5 text-white"
            onClick={onClose}
            aria-label="Close gallery"
          >
            <X className="h-7 w-7" />
          </button>
          {index >= 0 && images.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-4 text-white md:left-8"
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
                className="absolute right-4 text-white md:right-8"
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
            className="max-h-[88vh] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-[80vh] w-full object-contain"
            />
            <figcaption className="mt-4 text-center font-serif text-xl text-cream">
              {image.title}
            </figcaption>
          </motion.figure>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
