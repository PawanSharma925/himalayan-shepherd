import {
  Wifi,
  ConciergeBell,
  Coffee,
  Bath,
  MapPin,
  SunMedium,
} from "lucide-react";
import { Reveal } from "./Reveal";

const ITEMS = [
  {
    icon: SunMedium,
    title: "Rooftop seating & patio",
    copy: "Open-air tables for late light, mountain air, and an unhurried drink.",
  },
  {
    icon: Wifi,
    title: "High-speed Wi-Fi",
    copy: "Quiet enough to work. Fast enough that you do not have to think about it.",
  },
  {
    icon: ConciergeBell,
    title: "24/7 front desk",
    copy: "A person at reception whenever you arrive, leave, or need a taxi for the lake.",
  },
  {
    icon: Coffee,
    title: "In-house café & breakfast",
    copy: "Fresh continental and local breakfast, barista coffee, and an easy dining court.",
  },
  {
    icon: Bath,
    title: "Private en-suite bathrooms",
    copy: "Stone, glass, and warm water in every room — including the Presidential Suite.",
  },
  {
    icon: MapPin,
    title: "Prime Pokhara location",
    copy: "Lakeside ease with the Annapurna trailheads and Fewa Lake within reach.",
  },
];

export function Amenities() {
  return (
    <section id="amenities" className="bg-paper px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-2xl">
          <p className="kicker">House notes</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-8 font-serif text-4xl text-ink md:text-5xl">
            What the house quietly looks after.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="h-full border border-sand bg-cream/50 p-7">
                <item.icon className="h-7 w-7 text-gold-deep" strokeWidth={1.4} />
                <h3 className="mt-6 font-serif text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-ink-soft">{item.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
