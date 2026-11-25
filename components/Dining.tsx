"use client";

import { useT } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function Dining() {
  const t = useT();

  const dining = [
    {
      src: "/images/hotel/dining/sunlit-himalayan-shepherd-dining-room-2.jpg",
      alt: t("dining.alt1"),
      className: "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:min-h-[28rem]",
      sizes: "(max-width: 640px) 100vw, 66vw",
    },
    {
      src: "/images/hotel/dining/himalayan-shepherd-hotel-interior-1.jpg",
      alt: t("dining.alt2"),
      className: "aspect-[4/5] sm:aspect-auto sm:min-h-[13.5rem]",
      sizes: "(max-width: 640px) 100vw, 33vw",
    },
    {
      src: "/images/hotel/dining/bright-himalayan-shepherd-dining-room-3.jpg",
      alt: t("dining.alt3"),
      className: "aspect-[4/5] sm:aspect-auto sm:min-h-[13.5rem]",
      sizes: "(max-width: 640px) 100vw, 33vw",
    },
    {
      src: "/images/hotel/dining/warm-taupe-interior-with-glazed-partition.jpg",
      alt: t("dining.alt4"),
      className: "sm:col-span-3 aspect-[16/7] sm:aspect-[21/7] sm:min-h-[14rem]",
      sizes: "(max-width: 640px) 100vw, 100vw",
    },
  ];

  return (
    <section id="dining" className="bg-ink px-4 py-16 text-cream sm:px-5 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="kicker !text-gold">{t("dining.kicker")}</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-6 font-serif text-[2rem] leading-tight sm:mt-8 sm:text-4xl md:text-5xl">
              {t("dining.title")}
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-cream/75">{t("dining.body")}</p>
        </Reveal>

        <div className="mt-12 grid min-w-0 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-4">
          {dining.map((item, index) => (
            <Reveal key={item.src} delay={index * 0.08} className={`min-w-0 ${item.className}`}>
              <div className="group relative h-full min-h-[14rem] overflow-hidden">
                <SmartImage
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes={item.sizes}
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
