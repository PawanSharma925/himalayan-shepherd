"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HOTEL, whatsappHref } from "@/lib/hotel";
import { SmartImage } from "./SmartImage";

const VIEW_INQUIRE =
  "Hello Himalayan Shepherd, I would like to inquire about a mountain-view room in Pokhara.";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage
          src="/images/hotel/view/himalayan-shepherd-01-lake-and-mountains-hd.jpg"
          alt="Fewa Lake and the Annapurna mountains at Himalayan Shepherd, Pokhara"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover object-[center_40%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/45 via-ink/12 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/68 via-ink/10 to-ink/18" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-28 pt-28 md:px-8 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="kicker text-gold"
        >
          {HOTEL.kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-5 max-w-3xl font-serif text-[2.15rem] leading-[0.95] text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {HOTEL.tagline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
        >
          Wake to Fewa Lake and the Annapurna skyline — then sleep in a quiet
          boutique house that already feels like rest.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href={whatsappHref(VIEW_INQUIRE)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium tracking-wide text-ink transition hover:bg-cream"
          >
            Ask about a view room
          </a>
          <a
            href="#rooms"
            className="rounded-full border border-white/50 px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-white hover:text-ink"
          >
            Explore rooms
          </a>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/70 md:block"
        aria-label="Scroll to about"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  );
}
