"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Check, MessageCircle, Plus } from "lucide-react";
import { whatsappHref } from "@/lib/hotel";
import { useLocale } from "@/lib/i18n";
import { initialPlan, planStore } from "@/lib/planStore";
import { PLAN_WISHES_EVENT, type PlanArrivalDetail } from "./StayPlanner";

export type PlaceId =
  | "sunrise"
  | "paragliding"
  | "boat"
  | "pagoda"
  | "falls"
  | "museum"
  | "begnas";

export type Place = {
  id: PlaceId;
  halfDays: number;
  x: number;
  y: number;
  side: "left" | "right";
};

const HOUSE = { x: 458, y: 330 };

export const PLACES: Place[] = [
  { id: "sunrise", halfDays: 1, x: 232, y: 214, side: "left" },
  { id: "paragliding", halfDays: 1, x: 290, y: 256, side: "right" },
  { id: "boat", halfDays: 1, x: 384, y: 346, side: "left" },
  { id: "pagoda", halfDays: 1, x: 318, y: 446, side: "left" },
  { id: "falls", halfDays: 1, x: 478, y: 448, side: "right" },
  { id: "museum", halfDays: 1, x: 590, y: 478, side: "right" },
  { id: "begnas", halfDays: 2, x: 716, y: 318, side: "left" },
];

const join = (items: string[], locale: string) => {
  if (items.length < 2) return items.join("");
  if (locale === "zh-HK") return items.join("、");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
};

const route = (place: Place) => {
  const midX = (HOUSE.x + place.x) / 2;
  const midY = Math.min(HOUSE.y, place.y) - 40 - Math.abs(HOUSE.x - place.x) * 0.12;
  return `M${HOUSE.x} ${HOUSE.y} Q${midX} ${midY} ${place.x} ${place.y}`;
};

const PAPER = "#f1e7d3";
const INK = "#2e261d";
const WATER = "#b7cdc6";
const WATER_INK = "#4f6f6d";
export const ROUTE_RED = "#a8432a";

const SKYLINE = 150;
const PEAKS = [
  { x: 252, y: 54, w: 78 },
  { x: 628, y: 46, w: 74 },
  { x: 470, y: 22, w: 50 },
  { x: 560, y: 66, w: 58 },
  { x: 180, y: 86, w: 60 },
  { x: 726, y: 80, w: 66 },
  { x: 354, y: 94, w: 62 },
  { x: 100, y: 104, w: 64 },
  { x: 30, y: 118, w: 52 },
];

function peakShape({ x, y, w }: (typeof PEAKS)[number]) {
  const h = SKYLINE - y;
  const shoulder = { x: x + w * 0.32, y: y + h * 0.34 };
  const outline = `M${x - w} ${SKYLINE} L${x - w * 0.48} ${y + h * 0.42} L${x - w * 0.18} ${y + h * 0.16} L${x} ${y} L${shoulder.x} ${shoulder.y} L${x + w} ${SKYLINE}`;
  const flank = (hx: number) =>
    hx <= shoulder.x
      ? y + ((hx - x) / (shoulder.x - x)) * (shoulder.y - y)
      : shoulder.y + ((hx - shoulder.x) / (x + w - shoulder.x)) * (SKYLINE - shoulder.y);
  const hatch: string[] = [];
  for (let hx = x + 3; hx < x + w - 3; hx += 4.2) {
    const top = flank(hx) + 1.5;
    const length = Math.min(SKYLINE - top - 2, 18 + (hx - x) * 0.55);
    if (length > 2) hatch.push(`M${hx.toFixed(1)} ${top.toFixed(1)} v${length.toFixed(1)}`);
  }
  const snow = `M${x - w * 0.3} ${y + h * 0.3} l${w * 0.08} ${h * 0.05} l${w * 0.07} ${-h * 0.06} l${w * 0.08} ${h * 0.07} l${w * 0.07} ${-h * 0.05}`;
  return { outline, hatch: hatch.join(" "), snow };
}

const TREES = [
  [168, 238], [180, 230], [192, 241], [206, 228], [214, 244], [176, 252], [262, 224], [276, 232],
  [318, 236], [330, 246], [304, 226], [196, 258], [236, 452], [250, 442], [262, 458], [276, 446],
  [352, 440], [366, 452], [380, 444], [392, 458], [244, 466], [60, 300], [72, 292], [84, 304],
  [48, 316], [66, 420], [80, 410], [94, 424], [700, 240], [714, 230], [728, 244], [742, 236],
  [690, 400], [704, 412], [718, 398],
];

const BLOCKS = [
  [440, 296], [452, 302], [468, 298], [482, 306], [436, 318], [474, 318], [488, 322], [444, 344],
  [470, 342], [486, 340], [452, 356], [498, 296], [512, 334], [528, 344], [544, 336], [520, 360],
  [538, 372], [556, 356], [570, 366], [548, 388], [528, 392], [566, 392], [580, 380], [554, 410],
  [540, 424], [574, 422], [586, 404], [518, 408],
];

const LAKE =
  "M108 334 C140 300 206 304 248 318 C286 330 318 298 360 304 C400 310 428 324 430 350 C432 378 400 390 364 382 C328 374 300 398 258 394 C212 390 178 374 146 372 C112 370 92 352 108 334 Z";
const BEGNAS =
  "M690 306 C704 292 738 294 752 306 C764 318 750 336 728 336 C704 336 680 320 690 306 Z";
const SARANGKOT =
  "M140 252 C158 214 210 196 262 202 C306 206 344 226 352 252 C338 266 300 270 258 266 C214 263 168 272 140 252 Z";
const PAGODA_RIDGE =
  "M196 454 C224 426 288 418 342 426 C392 434 424 446 436 464 C404 482 340 486 288 482 C238 478 206 472 196 454 Z";

const contours = (d: string, cx: number, cy: number, key: string) =>
  [0.66, 0.36].map((s) => (
    <path
      key={`${key}${s}`}
      d={d}
      transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}
      fill="none"
      stroke={INK}
      strokeOpacity="0.35"
      strokeWidth={0.7 / s}
    />
  ));

function Valley() {
  return (
    <>
      <defs>
        <filter id="map-rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.6" />
        </filter>
        <filter id="map-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.32  0 0 0 0 0.25  0 0 0 0 0.16  0 0 0 0.11 0" />
        </filter>
        <radialGradient id="map-age" cx="50%" cy="48%" r="70%">
          <stop offset="0.6" stopColor="#d9c39b" stopOpacity="0" />
          <stop offset="1" stopColor="#c9ac7c" stopOpacity="0.45" />
        </radialGradient>
        <pattern id="map-ripple" width="26" height="9" patternUnits="userSpaceOnUse">
          <path d="M2 6 q4 -4 8 0 t8 0" fill="none" stroke={WATER_INK} strokeOpacity="0.4" strokeWidth="0.7" />
        </pattern>
        <path id="map-lake-label" d="M112 352 C150 364 210 372 268 364" />
        <path id="map-seti-label" d="M620 200 C612 232 628 262 618 300" />
      </defs>

      <rect width="800" height="560" fill={PAPER} />

      <g filter="url(#map-rough)" strokeLinecap="round" strokeLinejoin="round">
        {PEAKS.map((peak) => {
          const { outline, hatch, snow } = peakShape(peak);
          return (
            <g key={peak.x}>
              <path d={`${outline} Z`} fill={PAPER} stroke="none" />
              <path d={hatch} stroke={INK} strokeOpacity="0.55" strokeWidth="0.6" />
              <path d={outline} fill="none" stroke={INK} strokeWidth="1.15" />
              <path d={snow} fill="none" stroke={INK} strokeOpacity="0.5" strokeWidth="0.7" />
            </g>
          );
        })}
        <path
          d="M0 166 C40 150 82 160 122 152 C170 142 212 170 262 160 C312 150 352 172 402 162 C452 152 502 176 562 164 C622 152 682 172 742 160 C772 154 790 160 800 158 L800 214 L0 214 Z"
          fill={PAPER}
        />
        <path
          d="M0 166 C40 150 82 160 122 152 C170 142 212 170 262 160 C312 150 352 172 402 162 C452 152 502 176 562 164 C622 152 682 172 742 160 C772 154 790 160 800 158"
          fill="none"
          stroke={INK}
          strokeWidth="0.9"
        />
        {[60, 150, 238, 330, 420, 520, 610, 700, 772].map((x) => (
          <path key={x} d={`M${x - 14} ${172} q14 -6 28 0`} fill="none" stroke={INK} strokeOpacity="0.4" strokeWidth="0.6" />
        ))}

        <path d={SARANGKOT} fill="#e7d9bb" stroke={INK} strokeOpacity="0.7" strokeWidth="0.9" />
        {contours(SARANGKOT, 246, 238, "s")}
        <path d={PAGODA_RIDGE} fill="#e7d9bb" stroke={INK} strokeOpacity="0.7" strokeWidth="0.9" />
        {contours(PAGODA_RIDGE, 316, 454, "p")}

        {TREES.map(([x, y]) => (
          <path
            key={`${x}-${y}`}
            d={`M${x} ${y - 6} l-3.2 7 h6.4 z M${x} ${y + 1} v2.5`}
            fill={PAPER}
            stroke={INK}
            strokeOpacity="0.7"
            strokeWidth="0.7"
          />
        ))}

        <path
          d="M612 186 C596 236 626 282 606 336 C590 384 616 444 598 560"
          fill="none"
          stroke={WATER_INK}
          strokeWidth="1.8"
        />
        <path
          d="M612 186 C596 236 626 282 606 336 C590 384 616 444 598 560"
          fill="none"
          stroke={WATER}
          strokeWidth="0.7"
        />
        <path d="M426 366 C444 392 458 414 474 440" fill="none" stroke={WATER_INK} strokeWidth="1.2" />

        <path d={LAKE} fill={WATER} />
        <path d={LAKE} fill="url(#map-ripple)" />
        {[0.93, 0.85].map((s) => (
          <path
            key={s}
            d={LAKE}
            transform={`translate(270 348) scale(${s}) translate(-270 -348)`}
            fill="none"
            stroke={WATER_INK}
            strokeOpacity="0.45"
            strokeWidth={0.6 / s}
          />
        ))}
        <path d={LAKE} fill="none" stroke={INK} strokeWidth="1.2" />
        <path d={BEGNAS} fill={WATER} stroke={INK} strokeWidth="1.1" />
        <path
          d={BEGNAS}
          transform="translate(722 316) scale(0.8) translate(-722 -316)"
          fill="none"
          stroke={WATER_INK}
          strokeOpacity="0.45"
          strokeWidth="0.7"
        />

        <path
          d="M470 330 C520 338 560 350 600 345 C640 340 668 326 688 316"
          fill="none"
          stroke={INK}
          strokeOpacity="0.55"
          strokeWidth="2.4"
        />
        <path
          d="M470 330 C520 338 560 350 600 345 C640 340 668 326 688 316"
          fill="none"
          stroke={PAPER}
          strokeWidth="1.2"
        />
        {BLOCKS.map(([x, y], index) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={index % 3 ? 6 : 8}
            height="5"
            transform={`rotate(${(index % 5) * 6 - 12} ${x} ${y})`}
            fill={index % 4 ? PAPER : "#d8c7a6"}
            stroke={INK}
            strokeOpacity="0.6"
            strokeWidth="0.6"
          />
        ))}

        <rect x="9" y="9" width="782" height="542" fill="none" stroke={INK} strokeWidth="1.4" />
        <rect x="15" y="15" width="770" height="530" fill="none" stroke={INK} strokeWidth="0.5" />

        <g transform="translate(740 488)">
          <circle r="24" fill="none" stroke={INK} strokeWidth="0.6" />
          <circle r="17" fill="none" stroke={INK} strokeOpacity="0.5" strokeWidth="0.5" />
          <path d="M0 -30 L4.5 -4.5 L0 0 Z M0 30 L-4.5 4.5 L0 0 Z" fill={INK} />
          <path d="M0 -30 L-4.5 -4.5 L0 0 Z M0 30 L4.5 4.5 L0 0 Z" fill={PAPER} stroke={INK} strokeWidth="0.6" />
          <path d="M-22 0 L-4 -3.5 L0 0 L-4 3.5 Z M22 0 L4 3.5 L0 0 L4 -3.5 Z" fill={PAPER} stroke={INK} strokeWidth="0.6" />
        </g>

        <g transform="translate(26 486)">
          <rect width="196" height="54" fill={PAPER} stroke={INK} strokeWidth="1" />
          <rect x="4" y="4" width="188" height="46" fill="none" stroke={INK} strokeWidth="0.5" />
        </g>
      </g>

      <g className="font-serif" fill={INK} stroke={PAPER} strokeWidth="3" strokeLinejoin="round" paintOrder="stroke">
        <text x="252" y="40" textAnchor="middle" fontSize="13" fontStyle="italic" opacity="0.8">
          Annapurna South
        </text>
        <text x="500" y="22" fontSize="14" fontStyle="italic" opacity="0.85">
          Machhapuchhre
        </text>
        <text x="500" y="36" fontSize="10" letterSpacing="1.5" opacity="0.6">
          FISHTAIL
        </text>
        <text x="628" y="32" textAnchor="middle" fontSize="13" fontStyle="italic" opacity="0.8">
          Annapurna II
        </text>
        <text fontSize="15" fontStyle="italic" letterSpacing="7" fill={WATER_INK}>
          <textPath href="#map-lake-label" startOffset="50%" textAnchor="middle">
            Fewa Lake
          </textPath>
        </text>
        <text fontSize="11" fontStyle="italic" letterSpacing="3" fill={WATER_INK}>
          <textPath href="#map-seti-label" startOffset="50%" textAnchor="middle">
            Seti River
          </textPath>
        </text>
        <text x="722" y="352" textAnchor="middle" fontSize="11" fontStyle="italic" fill={WATER_INK}>
          Begnas
        </text>
        <text x="556" y="400" textAnchor="middle" fontSize="12" letterSpacing="6" opacity="0.75">
          POKHARA
        </text>
        <text x="740" y="455" textAnchor="middle" fontSize="11">
          N
        </text>
        <text x="124" y="508" textAnchor="middle" fontSize="13" letterSpacing="4">
          POKHARA VALLEY
        </text>
        <text x="124" y="527" textAnchor="middle" fontSize="10.5" fontStyle="italic" opacity="0.7">
          drawn around the hotel · not to scale
        </text>
      </g>

      <rect width="800" height="560" fill="url(#map-age)" />
      <rect width="800" height="560" filter="url(#map-grain)" />
    </>
  );
}

export function PokharaMap() {
  const { t, messages, locale } = useLocale();
  const [picked, setPicked] = useState<string[]>([]);
  const [focus, setFocus] = useState<string | null>(null);
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const chosen = PLACES.filter((place) => picked.includes(place.id));
  const days = Math.max(1, Math.ceil(chosen.reduce((sum, place) => sum + place.halfDays, 0) / 2));

  const placeCopy = (id: PlaceId) => messages.explore.places[id];

  const announceWishes = (ids: string[]) => {
    const items = PLACES.filter((place) => ids.includes(place.id));
    const detail: PlanArrivalDetail | null = items.length
      ? {
          note: t("explore.wishQuote", {
            asks: join(
              items.map((place) => placeCopy(place.id).ask),
              locale,
            ),
          }),
          label:
            items.length === 1
              ? placeCopy(items[0].id).name
              : locale === "zh-HK"
                ? `${items.length} 個行程`
                : `${items.length} things to do`,
          code: items.map((place) => place.id).join("."),
        }
      : null;
    window.dispatchEvent(new CustomEvent(PLAN_WISHES_EVENT, { detail }));
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (picked.length) announceWishes(picked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <section
      id="explore"
      aria-label={t("explore.aria")}
      className="overflow-hidden bg-ink px-4 py-16 text-cream sm:px-5 md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-16">
          <div>
            <p className="kicker">{t("explore.kicker")}</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-6 font-serif text-[2rem] leading-tight sm:mt-8 sm:text-4xl md:text-5xl">
              {t("explore.title")}
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-cream/70">{t("explore.lead")}</p>
        </div>

        <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-12">
          <div className="lg:sticky lg:top-28">
            <div className="relative aspect-[800/560] w-full overflow-hidden rounded-[3px] bg-[#f1e7d3] shadow-[0_2px_0_rgba(255,255,255,0.08),0_40px_90px_rgba(0,0,0,0.45)]">
              <svg viewBox="0 0 800 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <Valley />
                <AnimatePresence>
                  {chosen.map((place) => (
                    <motion.g key={place.id} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                      <mask id={`map-reveal-${place.id}`} maskUnits="userSpaceOnUse" x="0" y="0" width="800" height="560">
                        <motion.path
                          d={route(place)}
                          fill="none"
                          stroke="white"
                          strokeWidth="8"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.1, ease: [0.45, 0, 0.2, 1] }}
                        />
                      </mask>
                      <path
                        d={route(place)}
                        fill="none"
                        stroke={ROUTE_RED}
                        strokeWidth={focus === place.id ? 2.6 : 1.9}
                        strokeDasharray="7 5"
                        strokeLinecap="round"
                        mask={`url(#map-reveal-${place.id})`}
                      />
                    </motion.g>
                  ))}
                </AnimatePresence>
              </svg>

              <div
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${HOUSE.x / 8}%`, top: `${HOUSE.y / 5.6}%` }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 drop-shadow-[0_1px_0_#f1e7d3] md:h-6 md:w-6">
                  <path d="M3 11 L12 3 L21 11 V21 H3 Z" fill="#b8925a" stroke="#2e261d" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9.5 21 V15 H14.5 V21" fill="#f1e7d3" stroke="#2e261d" strokeWidth="1.4" />
                </svg>
                <span className="absolute left-1 top-full mt-0.5 whitespace-nowrap font-serif text-[9px] uppercase tracking-[0.16em] text-[#2e261d] [text-shadow:0_0_3px_#f1e7d3,0_0_3px_#f1e7d3] md:text-[11px]">
                  {t("explore.houseLabel")}
                </span>
              </div>

              {PLACES.map((place, index) => {
                const on = picked.includes(place.id);
                const lit = on || focus === place.id;
                const copy = placeCopy(place.id);
                return (
                  <button
                    key={place.id}
                    type="button"
                    aria-pressed={on}
                    aria-label={t(on ? "explore.removePlace" : "explore.addPlace", {
                      name: copy.name,
                    })}
                    onClick={() => toggle(place.id)}
                    onMouseEnter={() => setFocus(place.id)}
                    onMouseLeave={() => setFocus(null)}
                    onFocus={() => setFocus(place.id)}
                    onBlur={() => setFocus(null)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 p-1.5 outline-none"
                    style={{ left: `${place.x / 8}%`, top: `${place.y / 5.6}%` }}
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border-[1.5px] font-serif text-[13px] font-semibold tabular-nums transition md:h-7 md:w-7 md:text-[15px] ${
                        on
                          ? "scale-110 border-[#2e261d] bg-[#a8432a] text-[#f1e7d3]"
                          : lit
                            ? "border-[#a8432a] bg-[#f1e7d3] text-[#a8432a]"
                            : "border-[#2e261d] bg-[#f1e7d3] text-[#2e261d]"
                      } group-focus-visible:ring-2 group-focus-visible:ring-[#a8432a]`}
                    >
                      {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : index + 1}
                    </span>
                    <span
                      className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap px-1.5 font-serif text-[14px] italic transition [text-shadow:0_0_3px_#f1e7d3,0_0_3px_#f1e7d3,0_0_3px_#f1e7d3] md:block ${
                        place.side === "left" ? "right-full" : "left-full"
                      } ${lit ? "text-[#a8432a]" : "text-[#2e261d]"}`}
                    >
                      {copy.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-cream/40">{t("explore.mapNote")}</p>
          </div>

          <div>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {PLACES.map((place, index) => {
                const on = picked.includes(place.id);
                const copy = placeCopy(place.id);
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
                        <span className="block font-serif text-xl leading-tight">{copy.name}</span>
                        <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-gold/80">
                          {copy.when}
                        </span>
                        <span className="mt-1.5 block text-sm leading-6 text-cream/60">
                          {copy.blurb}
                        </span>
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
                    {t("explore.aboutDays", {
                      days,
                      dayWord: days === 1 ? t("explore.day") : t("explore.days"),
                    })}
                  </p>
                  <p className="mt-3 text-sm italic leading-6 text-cream/75">
                    &ldquo;
                    {t("explore.wishQuote", {
                      asks: join(
                        chosen.map((place) => placeCopy(place.id).ask),
                        locale,
                      ),
                    })}
                    &rdquo;
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={whatsappHref(plan.message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {t("explore.sendWhatsApp")}
                    </a>
                    <a
                      href="#plan"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-cream transition hover:border-gold hover:text-gold"
                    >
                      <CalendarDays className="h-4 w-4" />
                      {t("explore.pickDates", { nights: days + 1 })}
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm leading-6 text-cream/60">{t("explore.empty")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
