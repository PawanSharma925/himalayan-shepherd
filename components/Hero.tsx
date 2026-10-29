"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HOTEL, whatsappHref } from "@/lib/hotel";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hotel/lounge_and_seating/indoor-seating-area-with-rattan-furniture.jpg"
          alt="Lounge seating with rattan furniture and balcony light at Himalayan Shepherd"
          className="h-full w-full object-cover object-[68%_center]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />

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
          className="mt-5 max-w-3xl font-serif text-[2.7rem] leading-[0.95] text-white sm:text-6xl lg:text-7xl"
        >
          {HOTEL.tagline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
        >
          A boutique house in Pokhara for still mornings, lake light, and the
          quiet luxury of arriving somewhere that already feels like rest.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <a
            href="#rooms"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium tracking-wide text-ink transition hover:bg-cream"
          >
            Explore accommodations
          </a>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/50 px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:bg-white hover:text-ink"
          >
            Instant inquiry
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
