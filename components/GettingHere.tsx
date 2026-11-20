"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bus,
  Car,
  CarTaxiFront,
  Check,
  Clock,
  Footprints,
  MessageCircle,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { whatsappHref } from "@/lib/hotel";
import { initialPlan, planStore } from "@/lib/planStore";
import { PLAN_ARRIVAL_EVENT, type PlanArrivalDetail } from "./StayPlanner";

export type Route = {
  id: string;
  icon: LucideIcon;
  label: string;
  duration: string;
  from: string;
  notes: string[];
  timeLabel: string;
  note: (time: string) => string;
  summary: string;
};

const at = (time: string, lead: string) => (time ? `${lead} ${time}` : "");

export const ROUTES: Route[] = [
  {
    id: "airport",
    icon: CarTaxiFront,
    label: "Taxi from the airport",
    duration: "About 15–25 min",
    from: "taxi from Pokhara airport",
    notes: [
      "Pokhara’s airport is a short ride from Lakeside — usually 15 to 25 minutes depending on traffic.",
      "We can arrange a taxi to meet you at arrivals, or point you to a reliable one at the curb.",
      "Share your flight details and we’ll help with the last stretch to the hotel.",
    ],
    timeLabel: "Landing around",
    note: (time) =>
      `We're landing at Pokhara airport${at(time, " around")} — could you arrange a taxi to the hotel?`,
    summary: "Taxi from the airport",
  },
  {
    id: "bus",
    icon: Bus,
    label: "Tourist bus",
    duration: "6–8 hours",
    from: "tourist bus from Kathmandu",
    notes: [
      "The classic route along the Prithvi Highway, following the river valleys west.",
      "Buses usually leave Kathmandu early and arrive at Pokhara's tourist bus park.",
      "From the bus park it is a short taxi ride to Lakeside.",
    ],
    timeLabel: "Bus arrives around",
    note: (time) =>
      `We're coming on the tourist bus from Kathmandu${at(time, ", arriving around")} — could you help us get from the bus park to the hotel?`,
    summary: "Arriving by bus",
  },
  {
    id: "car",
    icon: Car,
    label: "Private car",
    duration: "5–7 hours",
    from: "drive from Kathmandu",
    notes: [
      "Door to door at your own pace, with stops for tea and the view.",
      "Traffic leaving Kathmandu sets the pace — an early start helps.",
      "Your driver can bring you straight to the hotel.",
    ],
    timeLabel: "Expected around",
    note: (time) =>
      `We're driving from Kathmandu${at(time, " and expect to arrive around")}. Is there parking at the hotel?`,
    summary: "Arriving by car",
  },
  {
    id: "chitwan",
    icon: Trees,
    label: "From Chitwan",
    duration: "4–5 hours",
    from: "trip from Chitwan",
    notes: [
      "A common pairing: jungle first, then the lake and the mountains.",
      "Tourist buses and private cars both make the run north.",
      "Arrive in the afternoon and you'll catch the light on the lake.",
    ],
    timeLabel: "Arriving around",
    note: (time) =>
      `We're coming up from Chitwan${at(time, ", arriving around")} — anything we should know for the journey?`,
    summary: "Coming from Chitwan",
  },
  {
    id: "trek",
    icon: Footprints,
    label: "Off a trek",
    duration: "1–3 hours",
    from: "ride from the trailhead",
    notes: [
      "Coming down from Annapurna, Poon Hill or Mardi? Jeeps and buses run back to Pokhara.",
      "A hot shower, soft linen and a long breakfast are waiting.",
      "Tell us if you'd like to leave bags with us while you are on the trail.",
    ],
    timeLabel: "Back around",
    note: (time) =>
      `We'll be coming straight off a trek${at(time, ", back in Pokhara around")}. Could we leave luggage with you while we're on the trail?`,
    summary: "Coming off a trek",
  },
];

function announceArrival(route: Route, time: string) {
  const code = `${route.id}|${time}`;
  const detail: PlanArrivalDetail = { note: route.note(time), label: route.summary, code };
  window.dispatchEvent(new CustomEvent(PLAN_ARRIVAL_EVENT, { detail }));
  return code;
}

export function GettingHere() {
  const [routeId, setRouteId] = useState(ROUTES[0].id);
  const [time, setTime] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const route = ROUTES.find((item) => item.id === routeId) ?? ROUTES[0];
  const isAdded = added === `${route.id}|${time}`;

  const add = () => {
    setAdded(announceArrival(route, time));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const [id, savedTime = ""] = (initialPlan().params.get("arr") ?? "").split("|");
      const saved = ROUTES.find((item) => item.id === id);
      if (!saved) return;
      const clean = /^\d{2}:\d{2}$/.test(savedTime) ? savedTime : "";
      setRouteId(saved.id);
      setTime(clean);
      setAdded(announceArrival(saved, clean));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="getting-here" className="bg-cream px-4 py-16 sm:px-5 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div>
            <p className="kicker">Getting here</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-6 font-serif text-[2rem] leading-tight text-ink sm:mt-8 sm:text-4xl md:text-5xl">
              Hotel arrival &amp; Check-in, we can assist.
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-ink-soft">
            Pick how you&rsquo;re travelling to Pokhara. We&rsquo;ll add it to your note so
            reception can help with the last stretch before you even ask.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="How are you travelling?"
          className="-mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0 md:mt-12 [&::-webkit-scrollbar]:hidden"
        >
          {ROUTES.map((item) => {
            const selected = item.id === routeId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setRouteId(item.id)}
                className={`flex w-[9.5rem] shrink-0 flex-col items-start rounded-2xl border p-4 text-left transition sm:w-auto md:p-5 ${
                  selected
                    ? "border-ink bg-ink text-cream shadow-[0_20px_40px_rgba(23,20,16,0.18)]"
                    : "border-sand bg-paper text-ink hover:border-gold"
                }`}
              >
                <item.icon
                  className={`h-6 w-6 ${selected ? "text-gold" : "text-gold-deep"}`}
                  strokeWidth={1.5}
                />
                <span className="mt-4 font-serif text-xl leading-tight md:text-2xl">{item.label}</span>
                <span
                  className={`mt-1 text-xs tracking-wide ${selected ? "text-cream/60" : "text-ink-soft"}`}
                >
                  {item.duration}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid gap-6 rounded-2xl border border-sand bg-paper p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-10"
          >
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold-deep">
                <Clock className="h-3.5 w-3.5" />
                {route.duration} by {route.from}
              </p>
              <ul className="mt-5 space-y-4">
                {route.notes.map((note) => (
                  <li key={note} className="flex gap-3 text-[16px] leading-7 text-ink-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {note}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-ink-soft/70">
                Journey times are typical, not promised — roads and mountain weather set the pace.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-xl bg-cream p-5 md:p-6">
              <div>
                <label
                  htmlFor="arrival-time"
                  className="block text-[10px] uppercase tracking-[0.22em] text-ink-soft"
                >
                  {route.timeLabel} <span className="normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="arrival-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-sand bg-paper px-3 py-2.5 text-ink outline-none focus:border-gold"
                />
                <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm italic leading-6 text-ink-soft">
                  &ldquo;{route.note(time)}&rdquo;
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <button
                  type="button"
                  onClick={add}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                    isAdded ? "bg-ink text-cream" : "bg-gold text-ink hover:bg-gold-deep hover:text-white"
                  }`}
                >
                  {isAdded ? <Check className="h-4 w-4" /> : null}
                  {isAdded ? "Added to your message" : "Add to my message"}
                </button>
                {isAdded ? (
                  <a
                    href={whatsappHref(plan.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send on WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
