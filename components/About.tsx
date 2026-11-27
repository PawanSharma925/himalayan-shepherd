"use client";

import { useLocale } from "@/lib/i18n";
import { Reveal } from "./Reveal";
import { SmartImage } from "./SmartImage";

export function About() {
  const { t, messages } = useLocale();

  const mosaic = [
    {
      src: "/images/hotel/view/himalayan-shepherd-03-summit-closeup-crisp.jpg",
      alt: t("about.altSummit"),
      className: "col-span-2 aspect-[3/2]",
      object: "object-center",
      sizes: "(max-width: 1024px) 92vw, 1200px",
    },
    {
      src: "/images/hotel/dining-patio/patio-outside-dining-green-cushions.jpg",
      alt: t("about.altPatio"),
      className: "aspect-[4/3]",
      object: "object-center",
      sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 600px",
    },
    {
      src: "/images/hotel/building/hotel-entrance-and-facade.jpg",
      alt: t("about.altEntrance"),
      className: "aspect-[4/3]",
      object: "object-center",
      sizes: "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 600px",
    },
  ];

  return (
    <section id="about" className="bg-paper px-4 py-16 sm:px-5 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="kicker">{t("about.kicker")}</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-6 font-serif text-[2rem] leading-tight text-ink sm:mt-8 sm:text-4xl md:text-5xl">
            {t("about.title")}
          </h2>
          <div className="mt-8 space-y-5 text-[17px] leading-8 text-ink-soft">
            {messages.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-serif text-[1.15rem] italic leading-8 text-ink">{t("about.quote")}</p>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {mosaic.map((item) => (
            <div key={item.src} className={`relative overflow-hidden ${item.className}`}>
              <SmartImage
                src={item.src}
                alt={item.alt}
                fill
                sizes={item.sizes}
                quality={90}
                className={`object-cover transition duration-700 hover:scale-105 ${item.object}`}
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
