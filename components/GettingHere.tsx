"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
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
import { useLocale } from "@/lib/i18n";
import { initialPlan, planStore } from "@/lib/planStore";
import { PLAN_ARRIVAL_EVENT, type PlanArrivalDetail } from "./StayPlanner";

export type RouteId = "airport" | "bus" | "car" | "chitwan" | "trek";

export type RouteMeta = {
  id: RouteId;
  icon: LucideIcon;
};

export const ROUTE_META: RouteMeta[] = [
  { id: "airport", icon: CarTaxiFront },
  { id: "bus", icon: Bus },
  { id: "car", icon: Car },
  { id: "chitwan", icon: Trees },
  { id: "trek", icon: Footprints },
];

/** @deprecated Use ROUTE_META; kept for TripCard route lookup by id. */
export const ROUTES = ROUTE_META;

function announceArrival(detail: PlanArrivalDetail) {
  window.dispatchEvent(new CustomEvent(PLAN_ARRIVAL_EVENT, { detail }));
  return detail.code;
}

export function GettingHere() {
  const { t, messages, locale } = useLocale();
  const [routeId, setRouteId] = useState<RouteId>(ROUTE_META[0].id);
  const [time, setTime] = useState("");
  const [added, setAdded] = useState<string | null>(null);
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const meta = ROUTE_META.find((item) => item.id === routeId) ?? ROUTE_META[0];
  const routeCopy = messages.gettingHere.routes[meta.id];
  const isAdded = added === `${meta.id}|${time}`;

  const note = useMemo(
    () => (time ? t(`gettingHere.routes.${meta.id}.noteTimed`, { time }) : routeCopy.note),
    [meta.id, routeCopy.note, t, time],
  );

  const buildDetail = (id: RouteId, arrivalTime: string): PlanArrivalDetail => {
    const copy = messages.gettingHere.routes[id];
    return {
      note: arrivalTime
        ? t(`gettingHere.routes.${id}.noteTimed`, { time: arrivalTime })
        : copy.note,
      label: copy.summary,
      code: `${id}|${arrivalTime}`,
    };
  };

  const add = () => {
    setAdded(announceArrival(buildDetail(meta.id, time)));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const [id, savedTime = ""] = (initialPlan().params.get("arr") ?? "").split("|");
      const saved = ROUTE_META.find((item) => item.id === id);
      if (!saved) return;
      const clean = /^\d{2}:\d{2}$/.test(savedTime) ? savedTime : "";
      setRouteId(saved.id);
      setTime(clean);
      setAdded(announceArrival(buildDetail(saved.id, clean)));
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!added) return;
    const [id, savedTime = ""] = added.split("|");
    if (id !== meta.id) return;
    announceArrival(buildDetail(meta.id, savedTime));
    // Re-localize arrival note when language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  return (
    <section id="getting-here" className="bg-cream px-4 py-16 sm:px-5 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div>
            <p className="kicker">{t("gettingHere.kicker")}</p>
            <div className="gold-rule mt-5" />
            <h2 className="mt-6 font-serif text-[2rem] leading-tight text-ink sm:mt-8 sm:text-4xl md:text-5xl">
              {t("gettingHere.title")}
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-8 text-ink-soft">{t("gettingHere.lead")}</p>
        </div>

        <div
          role="tablist"
          aria-label={t("gettingHere.tablist")}
          className="-mx-4 mt-10 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0 md:mt-12 [&::-webkit-scrollbar]:hidden"
        >
          {ROUTE_META.map((item) => {
            const selected = item.id === routeId;
            const copy = messages.gettingHere.routes[item.id];
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
                <span className="mt-4 font-serif text-xl leading-tight md:text-2xl">{copy.label}</span>
                <span
                  className={`mt-1 text-xs tracking-wide ${selected ? "text-cream/60" : "text-ink-soft"}`}
                >
                  {copy.duration}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={meta.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid gap-6 rounded-2xl border border-sand bg-paper p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-10"
          >
            <div>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold-deep">
                <Clock className="h-3.5 w-3.5" />
                {t("gettingHere.byFrom", {
                  duration: routeCopy.duration,
                  from: routeCopy.from,
                })}
              </p>
              <ul className="mt-5 space-y-4">
                {routeCopy.notes.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-7 text-ink-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-ink-soft/70">{t("gettingHere.disclaimer")}</p>
            </div>

            <div className="flex flex-col justify-between gap-5 rounded-xl bg-cream p-5 md:p-6">
              <div>
                <label
                  htmlFor="arrival-time"
                  className="block text-[10px] uppercase tracking-[0.22em] text-ink-soft"
                >
                  {routeCopy.timeLabel}{" "}
                  <span className="normal-case tracking-normal">{t("gettingHere.optional")}</span>
                </label>
                <input
                  id="arrival-time"
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-sand bg-paper px-3 py-2.5 text-ink outline-none focus:border-gold"
                />
                <p className="mt-4 rounded-xl bg-paper px-4 py-3 text-sm italic leading-6 text-ink-soft">
                  &ldquo;{note}&rdquo;
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
                  {isAdded ? t("gettingHere.added") : t("gettingHere.add")}
                </button>
                {isAdded ? (
                  <a
                    href={whatsappHref(plan.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {t("gettingHere.sendWhatsApp")}
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
