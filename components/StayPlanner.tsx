"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, MessageCircle, Minus, Plus, Sunrise } from "lucide-react";
import { whatsappHref } from "@/lib/hotel";
import { useLocale } from "@/lib/i18n";
import { roomCopy } from "@/lib/i18n/rooms";
import { initialPlan, planStore, savePlan } from "@/lib/planStore";
import { ROOM_TIERS, type RoomId } from "@/lib/rooms";

export const PLAN_ROOM_EVENT = "plan-room";
export const PLAN_DATES_EVENT = "plan-dates";

export const PLAN_ARRIVAL_EVENT = "plan-arrival";
export const PLAN_WISHES_EVENT = "plan-wishes";

export type PlanArrivalDetail = {
  note: string;
  label: string;
  code: string;
};

export type PlanDatesDetail = {
  checkIn: string;
  checkOut: string;
  sunrise: string;
};

const toInput = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export function StayPlanner() {
  const { t, locale, messages } = useLocale();
  const root = useRef<HTMLFormElement>(null);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [room, setRoom] = useState("any");
  const [sunrise, setSunrise] = useState("");
  const [arrival, setArrival] = useState<PlanArrivalDetail | null>(null);
  const [wishes, setWishes] = useState<PlanArrivalDetail | null>(null);
  const [flash, setFlash] = useState(false);
  const [restored, setRestored] = useState(false);

  const pretty = (value: string) =>
    new Date(`${value}T00:00:00`).toLocaleDateString(locale === "zh-HK" ? "zh-HK" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  useEffect(() => {
    const todayTimer = window.setTimeout(() => {
      const now = toInput(new Date());
      setToday(now);
      const saved = initialPlan().params;
      const savedIn = saved.get("in") ?? "";
      const savedOut = saved.get("out") ?? "";
      if (savedIn >= now && /^\d{4}-\d{2}-\d{2}$/.test(savedIn)) {
        setCheckIn(savedIn);
        if (savedOut > savedIn) setCheckOut(savedOut);
        const sun = saved.get("sun") ?? "";
        if (sun >= savedIn) setSunrise(sun);
      }
      const savedGuests = Number(saved.get("g"));
      if (savedGuests >= 1 && savedGuests <= 8) setGuests(savedGuests);
      const savedRoom = saved.get("room");
      if (ROOM_TIERS.some((tier) => tier.id === savedRoom)) setRoom(savedRoom as string);
      setRestored(true);
    }, 0);
    let flashTimer = 0;
    const highlight = () => {
      setFlash(true);
      window.clearTimeout(flashTimer);
      flashTimer = window.setTimeout(() => setFlash(false), 1600);
    };
    const onPlan = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setRoom(id);
      root.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      root.current?.querySelector<HTMLInputElement>("input[type=date]")?.focus({
        preventScroll: true,
      });
      highlight();
    };
    const onDates = (event: Event) => {
      const detail = (event as CustomEvent<PlanDatesDetail>).detail;
      setCheckIn(detail.checkIn);
      setCheckOut(detail.checkOut);
      setSunrise(detail.sunrise);
      root.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      root.current?.querySelector<HTMLButtonElement>("button[type=submit]")?.focus({
        preventScroll: true,
      });
      highlight();
    };
    const onArrival = (event: Event) => {
      setArrival((event as CustomEvent<PlanArrivalDetail | null>).detail);
    };
    const onWishes = (event: Event) => {
      setWishes((event as CustomEvent<PlanArrivalDetail | null>).detail);
    };
    window.addEventListener(PLAN_ROOM_EVENT, onPlan);
    window.addEventListener(PLAN_DATES_EVENT, onDates);
    window.addEventListener(PLAN_ARRIVAL_EVENT, onArrival);
    window.addEventListener(PLAN_WISHES_EVENT, onWishes);
    return () => {
      window.clearTimeout(todayTimer);
      window.clearTimeout(flashTimer);
      window.removeEventListener(PLAN_ROOM_EVENT, onPlan);
      window.removeEventListener(PLAN_DATES_EVENT, onDates);
      window.removeEventListener(PLAN_ARRIVAL_EVENT, onArrival);
      window.removeEventListener(PLAN_WISHES_EVENT, onWishes);
    };
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(`${checkOut}T00:00:00`).getTime() -
        new Date(`${checkIn}T00:00:00`).getTime()) /
      86400000;
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const nightWord = nights === 1 ? t("planner.night") : t("planner.nights");
  const who = `${guests} ${guests === 1 ? t("planner.guest") : t("planner.guestsWord")}`;

  const message = useMemo(() => {
    const roomName =
      room !== "any" && (room === "premium" || room === "standard")
        ? roomCopy(messages, room as RoomId).name
        : "";
    const when =
      checkIn && nights
        ? t("planner.whenRange", {
            checkIn: pretty(checkIn),
            checkOut: pretty(checkOut),
            nights,
            nightWord,
          })
        : checkIn
          ? t("planner.whenFrom", { checkIn: pretty(checkIn) })
          : t("planner.whenFlexible");
    const view = sunrise ? t("planner.sunriseWish", { date: pretty(sunrise) }) : "";
    const travel = arrival ? ` ${arrival.note}` : "";
    const extras = wishes ? ` ${wishes.note}` : "";
    const base =
      room === "any"
        ? t("planner.messageAny", { when, who })
        : t("planner.messageRoom", { room: roomName, when, who });
    return `${base}${view}${travel}${extras}`;
  }, [
    arrival,
    checkIn,
    checkOut,
    guests,
    messages,
    nightWord,
    nights,
    room,
    sunrise,
    t,
    who,
    wishes,
    locale,
  ]);

  useEffect(() => {
    const short = (value: string) => pretty(value).replace(/ \d{4}$/, "");
    const summary = [
      checkIn && nights
        ? t("planner.summaryRange", {
            checkIn: short(checkIn),
            checkOut: short(checkOut),
            nights,
            nightWord,
          })
        : checkIn
          ? t("planner.fromDate", { date: short(checkIn) })
          : t("planner.flexibleDates"),
      who,
    ];
    if (room === "premium" || room === "standard") {
      summary.push(roomCopy(messages, room).name);
    }
    if (arrival) summary.push(arrival.label);
    if (wishes) summary.push(wishes.label);
    const query = new URLSearchParams();
    if (checkIn) query.set("in", checkIn);
    if (checkOut) query.set("out", checkOut);
    if (guests !== 2) query.set("g", String(guests));
    if (room !== "any") query.set("room", room);
    if (sunrise) query.set("sun", sunrise);
    if (arrival) query.set("arr", arrival.code);
    if (wishes) query.set("do", wishes.code);
    const share = query.toString();
    planStore.set({
      message,
      summary,
      hasPlan: Boolean(checkIn) || room !== "any" || arrival !== null || wishes !== null,
      share,
    });
    if (restored) savePlan(share);
  }, [
    arrival,
    wishes,
    message,
    checkIn,
    checkOut,
    nights,
    guests,
    room,
    sunrise,
    restored,
    t,
    nightWord,
    who,
    messages,
    locale,
  ]);

  const field =
    "box-border w-full min-w-0 max-w-full rounded-xl border border-white/15 bg-white/[0.06] px-2.5 py-2.5 text-[13px] text-white outline-none transition focus:border-gold sm:px-3 sm:text-sm [color-scheme:dark]";
  const label = "mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/55";

  return (
    <form
      ref={root}
      id="plan"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
      }}
      className={`w-full max-w-full overflow-hidden rounded-2xl border bg-white/[0.04] p-3.5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-500 sm:p-4 md:p-5 ${
        flash ? "border-gold ring-4 ring-gold/25" : "border-white/10"
      }`}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/80">
        <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
        <span className="min-w-0">{t("planner.title")}</span>
        {sunrise ? (
          <span className="ml-auto inline-flex max-w-full items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] text-gold">
            <Sunrise className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {t("planner.sunrise", { date: pretty(sunrise).replace(/ \d{4}$/, "") })}
            </span>
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 sm:gap-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <div className="min-w-0 overflow-hidden">
            <label htmlFor="plan-in" className={label}>
              {t("planner.checkIn")}
            </label>
            <input
              id="plan-in"
              type="date"
              min={today}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value);
                setSunrise("");
                if (checkOut && event.target.value >= checkOut) setCheckOut("");
              }}
              className={`${field} plan-date`}
            />
          </div>
          <div className="min-w-0 overflow-hidden">
            <label htmlFor="plan-out" className={label}>
              {t("planner.checkOut")}
            </label>
            <input
              id="plan-out"
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(event) => {
                setCheckOut(event.target.value);
                setSunrise("");
              }}
              className={`${field} plan-date`}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="min-w-0">
            <span className={label}>{t("planner.guests")}</span>
            <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.06] px-2 py-1.5">
              <button
                type="button"
                aria-label={t("planner.fewerGuests")}
                onClick={() => setGuests((value) => Math.max(1, value - 1))}
                className="grid h-7 w-7 place-items-center rounded-full text-white/80 hover:bg-white/10"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-sm tabular-nums">{guests}</span>
              <button
                type="button"
                aria-label={t("planner.moreGuests")}
                onClick={() => setGuests((value) => Math.min(8, value + 1))}
                className="grid h-7 w-7 place-items-center rounded-full text-white/80 hover:bg-white/10"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="min-w-0">
            <label htmlFor="plan-room" className={label}>
              {t("planner.room")}
            </label>
            <select
              id="plan-room"
              value={room}
              onChange={(event) => setRoom(event.target.value)}
              className={`${field} appearance-none`}
            >
              <option value="any" className="text-ink">
                {t("planner.anyRoom")}
              </option>
              {ROOM_TIERS.map((tier) => (
                <option key={tier.id} value={tier.id} className="text-ink">
                  {roomCopy(messages, tier.id).name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:brightness-110"
      >
        <MessageCircle className="h-4 w-4" />
        {nights
          ? t("planner.checkNights", { nights, nightWord })
          : t("planner.checkAvailability")}
      </button>
      <p className="mt-3 text-center text-[11px] tracking-wide text-white/50">{t("planner.noFees")}</p>
    </form>
  );
}
