"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, MessageCircle, Plus } from "lucide-react";
import { whatsappHref } from "@/lib/hotel";
import { initialPlan, planStore } from "@/lib/planStore";
import { PLAN_WISHES_EVENT, type PlanArrivalDetail } from "./StayPlanner";

export type Place = {
  id: string;
  name: string;
  when: string;
  blurb: string;
  ask: string;
  halfDays: number;
  x: number;
  y: number;
  side: "left" | "right";
};

const HOUSE = { x: 458, y: 330 };

export const PLACES: Place[] = [
  {
    id: "sunrise",
    name: "Sunrise at Sarangkot",
    when: "Pre-dawn · half day",
    blurb: "A dark drive up the hill above the lake, then first light on the Annapurna.",
    ask: "seeing the sunrise from Sarangkot",
    halfDays: 1,
    x: 232,
    y: 214,
    side: "left",
  },
  {
    id: "paragliding",
    name: "Paragliding over Fewa",
    when: "Morning · half day",
    blurb: "Tandem flights launch from Sarangkot and drift down over the water.",
    ask: "a tandem paragliding flight",
    halfDays: 1,
    x: 290,
    y: 256,
    side: "right",
  },
  {
    id: "boat",
    name: "A boat to Tal Barahi",
    when: "Any time · an hour or two",
    blurb: "Row out from Lakeside to the little temple on its island.",
    ask: "a boat out to Tal Barahi",
    halfDays: 1,
    x: 384,
    y: 346,
    side: "left",
  },
  {
    id: "pagoda",
    name: "World Peace Pagoda",
    when: "Morning or late afternoon",
    blurb: "A white stupa on the ridge across the lake. Many cross by boat and walk up.",
    ask: "the World Peace Pagoda",
    halfDays: 1,
    x: 318,
    y: 446,
    side: "left",
  },
  {
    id: "falls",
    name: "Davis Falls & the cave",
    when: "Any time · a couple of hours",
    blurb: "A waterfall that disappears underground, and Gupteshwor Cave beneath it.",
    ask: "Davis Falls and Gupteshwor Cave",
    halfDays: 1,
    x: 478,
    y: 448,
    side: "right",
  },
  {
    id: "museum",
    name: "Mountain Museum",
    when: "Good for a cloudy day",
    blurb: "The story of the Himalaya and the people who climb it.",
    ask: "the International Mountain Museum",
    halfDays: 1,
    x: 590,
    y: 478,
    side: "right",
  },
  {
    id: "begnas",
    name: "Begnas Lake",
    when: "A slow day out",
    blurb: "A quieter lake east of the city, away from the Lakeside bustle.",
    ask: "a quiet day at Begnas Lake",
    halfDays: 2,
    x: 716,
    y: 318,
    side: "left",
  },
];

const join = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const route = (place: Place) => {
  const midX = (HOUSE.x + place.x) / 2;
  const midY = Math.min(HOUSE.y, place.y) - 40 - Math.abs(HOUSE.x - place.x) * 0.12;
  return `M${HOUSE.x} ${HOUSE.y} Q${midX} ${midY} ${place.x} ${place.y}`;
};

function Valley() {
  return (
    <>
      <defs>
        <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6efe3" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#f6efe3" stopOpacity="0.08" />
          <stop offset="1" stopColor="#f6efe3" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fa6ad" stopOpacity="0.45" />
          <stop offset="1" stopColor="#4d7480" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#b8925a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#b8925a" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d="M0 158 L48 118 L96 132 L150 84 L196 106 L248 50 L292 96 L340 82 L392 108 L436 70 L470 14 L492 56 L528 78 L572 38 L622 70 L676 52 L728 92 L800 68 L800 190 L0 190 Z"
        fill="url(#snow)"
        stroke="#f6efe3"
        strokeOpacity="0.5"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M0 196 C80 170 140 200 210 182 C280 164 340 196 420 178 C500 160 560 194 640 176 C700 164 760 186 800 176"
        fill="none"
        stroke="#f6efe3"
        strokeOpacity="0.14"
      />
      <text x="248" y="40" textAnchor="middle" className="fill-cream/55 font-serif" fontSize="15">
        Annapurna South
      </text>
      <text x="498" y="26" className="fill-cream/70 font-serif italic" fontSize="16">
        Machhapuchhre
      </text>
      <text x="690" y="40" textAnchor="middle" className="fill-cream/55 font-serif" fontSize="15">
        Annapurna II &amp; IV
      </text>

      {[90, 62, 36].map((r) => (
        <ellipse key={`s${r}`} cx="252" cy="236" rx={r * 1.5} ry={r * 0.7} fill="none" stroke="#f6efe3" strokeOpacity="0.07" />
      ))}
      {[70, 46, 24].map((r) => (
        <ellipse key={`p${r}`} cx="316" cy="452" rx={r * 1.6} ry={r * 0.55} fill="none" stroke="#f6efe3" strokeOpacity="0.07" />
      ))}

      <path
        d="M108 334 C140 300 206 304 248 318 C286 330 318 298 360 304 C400 310 428 324 430 350 C432 378 400 390 364 382 C328 374 300 398 258 394 C212 390 178 374 146 372 C112 370 92 352 108 334 Z"
        fill="url(#water)"
        stroke="#9fc1c6"
        strokeOpacity="0.45"
      />
      <text x="186" y="364" textAnchor="middle" className="fill-cream/45 font-serif italic" fontSize="17" letterSpacing="3">
        Fewa Lake
      </text>
      <path d="M426 366 C444 392 458 414 474 440" fill="none" stroke="#9fc1c6" strokeOpacity="0.4" strokeWidth="1.4" />
      <path
        d="M612 186 C596 236 626 282 606 336 C590 384 616 444 598 560"
        fill="none"
        stroke="#9fc1c6"
        strokeOpacity="0.35"
        strokeWidth="1.6"
      />
      <text x="628" y="262" className="fill-cream/35 italic" fontSize="12" letterSpacing="2">
        Seti
      </text>
      <path
        d="M690 306 C704 292 738 294 752 306 C764 318 750 336 728 336 C704 336 680 320 690 306 Z"
        fill="url(#water)"
        stroke="#9fc1c6"
        strokeOpacity="0.45"
      />
      <path d="M470 330 C540 324 610 318 688 314" fill="none" stroke="#f6efe3" strokeOpacity="0.16" strokeDasharray="2 6" />

      {[
        [446, 318], [470, 316], [440, 342], [478, 346], [462, 356], [486, 330], [450, 300], [494, 312],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" fill="#f6efe3" fillOpacity="0.16" />
      ))}
      <circle cx={HOUSE.x} cy={HOUSE.y} r="46" fill="url(#glow)" />

      <g transform="translate(748 520)" className="fill-cream/40" fontSize="11">
        <path d="M0 -26 L5 -12 L0 -15 L-5 -12 Z" fill="#f6efe3" fillOpacity="0.5" />
        <text y="-30" textAnchor="middle">N</text>
      </g>
    </>
  );
}

function announceWishes(ids: string[]) {
  const items = PLACES.filter((place) => ids.includes(place.id));
  const detail: PlanArrivalDetail | null = items.length
    ? {
        note: `While we're in Pokhara we'd love to fit in ${join(items.map((place) => place.ask))} — could you help us plan any of it?`,
        label: items.length === 1 ? items[0].name : `${items.length} things to do`,
        code: items.map((place) => place.id).join("."),
      }
    : null;
  window.dispatchEvent(new CustomEvent(PLAN_WISHES_EVENT, { detail }));
}

export function PokharaMap() {
  const [picked, setPicked] = useState<string[]>([]);
  const [focus, setFocus] = useState<string | null>(null);
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const chosen = PLACES.filter((place) => picked.includes(place.id));
  const days = Math.max(1, Math.ceil(chosen.reduce((sum, place) => sum + place.halfDays, 0) / 2));

  const toggle = (id: string) => {
    const next = picked.includes(id) ? picked.filter((item) => item !== id) : [...picked, id];
    setPicked(next);
    announceWishes(next);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = (initialPlan().params.get("do") ?? "").split(".");
      const ids = PLACES.filter((place) => saved.includes(place.id)).map((place) => place.id);
      if (!ids.length) return;
      setPicked(ids);
      announceWishes(ids);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      id="explore"
      aria-label="Map out your days in Pokhara"
      className="overflow-hidden bg-ink px-4 py-16 text-cream sm:px-5 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <p className="kicker">Around Pokhara</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-6 font-serif text-[2rem] leading-tight sm:mt-8 sm:text-4xl md:text-5xl">
              Map out your days between the lake and the peaks.
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-cream/70">
            Tap the places you&rsquo;d like to see. We&rsquo;ll add them to your note, so reception
            can suggest how to fit them around your stay when you write.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[800/560] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#1e1a15] shadow-[0_40px_90px_rgba(0,0,0,0.35)]">
              <svg viewBox="0 0 800 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <Valley />
                <AnimatePresence>
                  {chosen.map((place) => (
                    <motion.path
                      key={place.id}
                      d={route(place)}
                      fill="none"
                      className="stroke-gold"
                      strokeWidth={focus === place.id ? 2.4 : 1.6}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </AnimatePresence>
              </svg>

              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${HOUSE.x / 8}%`, top: `${HOUSE.y / 5.6}%` }}
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
                <span className="relative block h-3.5 w-3.5 rounded-full border-2 border-ink bg-gold md:h-4 md:w-4" />
                <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-gold md:text-[10px]">
                  The house
                </span>
              </div>

              {PLACES.map((place, index) => {
                const on = picked.includes(place.id);
                const lit = on || focus === place.id;
                return (
                  <button
                    key={place.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={`${on ? "Remove" : "Add"} ${place.name}`}
                    onClick={() => toggle(place.id)}
                    onMouseEnter={() => setFocus(place.id)}
                    onMouseLeave={() => setFocus(null)}
                    onFocus={() => setFocus(place.id)}
                    onBlur={() => setFocus(null)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 p-1.5 outline-none"
                    style={{ left: `${place.x / 8}%`, top: `${place.y / 5.6}%` }}
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold tabular-nums transition md:h-7 md:w-7 ${
                        on
                          ? "scale-110 border-gold bg-gold text-ink"
                          : lit
                            ? "border-gold bg-ink text-gold"
                            : "border-cream/40 bg-ink/80 text-cream/80"
                      } group-focus-visible:ring-2 group-focus-visible:ring-gold`}
                    >
                      {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-xs transition md:block ${
                        place.side === "left" ? "right-full mr-0.5" : "left-full ml-0.5"
                      } ${lit ? "bg-gold/15 text-gold" : "text-cream/60"}`}
                    >
                      {place.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-cream/40">
              Illustrated, not to scale. Timings are rough guides; reception knows the day&rsquo;s weather.
            </p>
          </div>

          <div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {PLACES.map((place, index) => {
                const on = picked.includes(place.id);
                return (
                  <li key={place.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(place.id)}
                      onMouseEnter={() => setFocus(place.id)}
                      onMouseLeave={() => setFocus(null)}
                      className={`flex h-full w-full items-start gap-3 rounded-xl border p-3.5 text-left transition md:p-4 ${
                        on
                          ? "border-gold/70 bg-gold/[0.09]"
                          : focus === place.id
                            ? "border-white/25 bg-white/[0.05]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/25"
                      }`}
                    >
                      <span
                        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold tabular-nums ${
                          on ? "border-gold bg-gold text-ink" : "border-cream/30 text-cream/70"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-serif text-xl leading-tight">{place.name}</span>
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-gold/80">
                          {place.when}
                        </span>
                        <span className="mt-1.5 block text-sm leading-6 text-cream/60">{place.blurb}</span>
                      </span>
                      <span
                        className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${
                          on ? "bg-gold text-ink" : "bg-white/[0.06] text-cream/70"
                        }`}
                      >
                        {on ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5" aria-live="polite">
              {chosen.length ? (
                <>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gold">
                    About {days} {days === 1 ? "day" : "days"} of plans · added to your message
                  </p>
                  <p className="mt-3 text-sm italic leading-6 text-cream/75">
                    &ldquo;While we&rsquo;re in Pokhara we&rsquo;d love to fit in{" "}
                    {join(chosen.map((place) => place.ask))} — could you help us plan any of it?&rdquo;
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={whatsappHref(plan.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Send on WhatsApp
                    </a>
                    <a
                      href="#plan"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold"
                    >
                      <CalendarDays className="h-4 w-4" />
                      Pick dates · about {days + 1} nights
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm leading-6 text-cream/60">
                  Nothing picked yet. Choose a few places and they&rsquo;ll appear in your note to the
                  house, ready to send with your dates.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
