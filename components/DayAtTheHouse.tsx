"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bath,
  CalendarDays,
  ConciergeBell,
  Coffee,
  Flame,
  MapPin,
  Moon,
  SunMedium,
  Sunrise,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { SmartImage } from "./SmartImage";
import { PLAN_ROOM_EVENT } from "./StayPlanner";

type Moment = {
  time: string;
  title: string;
  copy: string;
  image: { src: string; width: number; height: number; alt: string };
  amenities: { icon: LucideIcon; label: string }[];
  sky: string;
  dark: boolean;
};

const MOMENTS: Moment[] = [
  {
    time: "06:30",
    title: "The peaks catch fire",
    copy: "Climb to the sundeck with a blanket and a cup of tea. On a clear morning the first light turns the Annapurna gold before it reaches the lake.",
    image: {
      src: "/images/hotel/view/himalayan-shepherd-02-golden-peak-telephoto.jpg",
      width: 2048,
      height: 1024,
      alt: "First light on the Annapurna peaks seen from Himalayan Shepherd",
    },
    amenities: [{ icon: Sunrise, label: "Sundeck" }],
    sky: "#f2d6c1",
    dark: false,
  },
  {
    time: "08:00",
    title: "Breakfast, unhurried",
    copy: "Continental or Nepali plates and proper barista coffee in the bright dining room. Nobody clears your table while you are still talking.",
    image: {
      src: "/images/hotel/restaurant/brightened-dining-room-with-closed-taupe-blinds-5.jpg",
      width: 1448,
      height: 1086,
      alt: "The bright dining room at Himalayan Shepherd set for breakfast",
    },
    amenities: [{ icon: Coffee, label: "In-house café & breakfast" }],
    sky: "#f7efe2",
    dark: false,
  },
  {
    time: "10:00",
    title: "Out to the lake",
    copy: "Fewa Lake and the Lakeside promenade are a short walk away. Reception will call a taxi or point you to the boats and the trailheads.",
    image: {
      src: "/images/hotel/reception-lobby/reception-area-with-olive-glass.jpg",
      width: 1448,
      height: 1086,
      alt: "Reception at Himalayan Shepherd, Lakeside Pokhara",
    },
    amenities: [
      { icon: ConciergeBell, label: "24/7 front desk" },
      { icon: MapPin, label: "Lakeside location" },
    ],
    sky: "#eef0ea",
    dark: false,
  },
  {
    time: "14:00",
    title: "A slow afternoon",
    copy: "Back to a room full of soft daylight. Answer a few emails on fast Wi-Fi, or take a long shower and do absolutely nothing.",
    image: {
      src: "/images/hotel/floor-2-premium/sunlit-hotel-room-naturally-balanced-3.jpg",
      width: 1448,
      height: 1086,
      alt: "A sunlit premium room at Himalayan Shepherd",
    },
    amenities: [
      { icon: Wifi, label: "High-speed Wi-Fi" },
      { icon: Bath, label: "Private en-suite" },
    ],
    sky: "#f1e2c4",
    dark: false,
  },
  {
    time: "18:30",
    title: "Fire on the terrace",
    copy: "As the hills turn blue, the grill goes on. Dinner outside under the evening sky, with the day's stories still warm.",
    image: {
      src: "/images/hotel/sundeck/himalayan-shepherd-outdoor-bbq-amenity-2.jpg",
      width: 1536,
      height: 1024,
      alt: "The outdoor BBQ terrace at Himalayan Shepherd",
    },
    amenities: [
      { icon: Flame, label: "BBQ terrace" },
      { icon: SunMedium, label: "Open-air seating" },
    ],
    sky: "#5c3a2c",
    dark: true,
  },
  {
    time: "21:30",
    title: "Lights low",
    copy: "Warm timber, crisp linen, and the kind of quiet only a small house can give you. Tomorrow the mountains will be there again.",
    image: {
      src: "/images/hotel/exec-suite/warm-nighttime-executive-suite-5.jpg",
      width: 1448,
      height: 1086,
      alt: "The Executive Suite at night, Himalayan Shepherd",
    },
    amenities: [{ icon: Moon, label: "Quiet, small house" }],
    sky: "#171410",
    dark: true,
  },
];

const STAGE_RATIO = 4 / 3;

const sizesFor = (image: Moment["image"]) => {
  const scale = Math.max(1, image.width / image.height / STAGE_RATIO);
  return `(max-width: 1023px) ${Math.ceil(100 * scale)}vw, ${Math.ceil(640 * scale)}px`;
};

export function DayAtTheHouse() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const moment = MOMENTS[active];

  return (
    <section
      id="amenities"
      aria-label="A day at Himalayan Shepherd"
      style={{ backgroundColor: moment.sky }}
      className={`px-4 py-16 transition-colors duration-1000 sm:px-5 md:px-8 md:py-28 ${
        moment.dark ? "text-cream" : "text-ink"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className={`kicker ${moment.dark ? "!text-gold" : ""}`}>A day at the house</p>
          <div className="gold-rule mt-5" />
          <h2 className="mt-6 font-serif text-[2rem] leading-tight sm:mt-8 sm:text-4xl md:text-5xl">
            From first light to lights low.
          </h2>
          <p
            className={`mt-5 text-[17px] leading-8 transition-colors duration-1000 ${
              moment.dark ? "text-cream/70" : "text-ink-soft"
            }`}
          >
            Everything the house looks after, in the order you&rsquo;ll actually use it.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-[max(6.5rem,calc(50vh-16rem))]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink shadow-[0_30px_80px_rgba(23,20,16,0.25)]">
                {MOMENTS.map((item, index) => (
                  <SmartImage
                    key={item.time}
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes={sizesFor(item.image)}
                    className={`object-cover transition-[opacity,transform] duration-1000 ${
                      index === active ? "scale-100 opacity-100" : "scale-105 opacity-0"
                    }`}
                  />
                ))}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/70 to-transparent" />
                <span className="absolute bottom-5 left-6 font-serif text-6xl tabular-nums text-cream">
                  {moment.time}
                </span>
              </div>
              <div className="mt-5 flex gap-1.5" aria-hidden>
                {MOMENTS.map((item, index) => (
                  <span
                    key={item.time}
                    className={`h-1 flex-1 rounded-full transition-colors duration-700 ${
                      index <= active ? "bg-gold" : moment.dark ? "bg-white/15" : "bg-ink/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <ol>
            {MOMENTS.map((item, index) => (
              <li
                key={item.time}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                data-index={index}
                className={`flex flex-col justify-center py-8 transition-opacity duration-700 lg:min-h-[72vh] lg:py-0 ${
                  index === active ? "opacity-100" : "lg:opacity-35"
                }`}
              >
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl lg:hidden">
                  <SmartImage
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes={sizesFor(item.image)}
                    className="object-cover"
                  />
                  <span className="absolute bottom-3 left-4 font-serif text-4xl tabular-nums text-cream drop-shadow">
                    {item.time}
                  </span>
                </div>
                <p
                  className={`hidden font-serif text-2xl tabular-nums lg:block ${
                    moment.dark ? "text-gold" : "text-gold-deep"
                  }`}
                >
                  {item.time}
                </p>
                <h3 className="font-serif text-[1.9rem] leading-tight md:text-4xl lg:mt-2">
                  {item.title}
                </h3>
                <p
                  className={`mt-4 max-w-md text-[16px] leading-8 ${
                    moment.dark ? "text-cream/75" : "text-ink-soft"
                  }`}
                >
                  {item.copy}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {item.amenities.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs tracking-wide ${
                        moment.dark
                          ? "border-white/20 bg-white/5 text-cream/85"
                          : "border-ink/10 bg-white/50 text-ink-soft"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-gold-deep" strokeWidth={1.6} />
                      {label}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <div
          className={`mt-10 flex flex-col items-start gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between lg:mt-4 ${
            moment.dark ? "border-white/15" : "border-ink/10"
          }`}
        >
          <p className="font-serif text-2xl md:text-3xl">Spend a day like this.</p>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent(PLAN_ROOM_EVENT, { detail: "any" }))
            }
            className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-ink transition hover:bg-cream"
          >
            <CalendarDays className="h-4 w-4" />
            Check dates
          </button>
        </div>
      </div>
    </section>
  );
}
