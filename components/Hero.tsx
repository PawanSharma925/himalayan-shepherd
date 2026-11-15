"use client";

import { motion } from "framer-motion";
import { HOTEL } from "@/lib/hotel";
import { SmartImage } from "./SmartImage";
import { StayPlanner } from "./StayPlanner";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink pt-[4.75rem] text-white"
    >
      <div className="group relative h-[clamp(240px,34svh,300px)] w-full overflow-hidden md:h-[clamp(320px,50svh,520px)]">
        <div className="hero-pan h-full w-max group-hover:[animation-play-state:paused]">
          <SmartImage
            src="/images/hotel/view/himalayan-shepherd-01-lake-and-mountains-hd.jpg"
            alt="Panorama of Fewa Lake and the Annapurna range above Lakeside, Pokhara"
            width={4401}
            height={963}
            priority
            quality={90}
            sizes="(max-width: 768px) 1400px, 2400px"
            className="h-full w-auto max-w-none"
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent" />
        <p className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[0.28em] text-white/75 md:left-8">
          Fewa Lake · Annapurna range · Lakeside
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-7xl flex-1 content-center gap-8 px-5 pb-28 pt-8 md:px-8 md:pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="kicker !text-gold"
          >
            {HOTEL.kicker}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-4 max-w-3xl font-serif text-[2.1rem] leading-[1] sm:text-5xl md:text-6xl"
          >
            {HOTEL.tagline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45 }}
            className="mt-5 max-w-md text-base leading-relaxed text-white/75 md:text-[17px]"
          >
            Wake to Fewa Lake and the Annapurna skyline, then come back to a
            quiet boutique house in Lakeside.{" "}
            <a
              href="#rooms"
              className="text-white underline decoration-gold/70 underline-offset-4 hover:text-gold"
            >
              See the rooms
            </a>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          <StayPlanner />
        </motion.div>
      </div>
    </section>
  );
}
