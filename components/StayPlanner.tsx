"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, MessageCircle, Minus, Plus } from "lucide-react";
import { whatsappHref } from "@/lib/hotel";
import { ROOM_TIERS } from "@/lib/rooms";

export const PLAN_ROOM_EVENT = "plan-room";

const toInput = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

const pretty = (value: string) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function StayPlanner() {
  const root = useRef<HTMLFormElement>(null);
  const [today, setToday] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [room, setRoom] = useState("any");

  useEffect(() => {
    setToday(toInput(new Date()));
    const onPlan = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setRoom(id);
      root.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      root.current?.querySelector<HTMLInputElement>("input[type=date]")?.focus({
        preventScroll: true,
      });
    };
    window.addEventListener(PLAN_ROOM_EVENT, onPlan);
    return () => window.removeEventListener(PLAN_ROOM_EVENT, onPlan);
  }, []);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const diff =
      (new Date(`${checkOut}T00:00:00`).getTime() -
        new Date(`${checkIn}T00:00:00`).getTime()) /
      86400000;
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const message = useMemo(() => {
    const roomName =
      ROOM_TIERS.find((tier) => tier.id === room)?.name ?? "a room";
    const who = `${guests} ${guests === 1 ? "guest" : "guests"}`;
    const when =
      checkIn && nights
        ? `from ${pretty(checkIn)} to ${pretty(checkOut)} (${nights} ${nights === 1 ? "night" : "nights"})`
        : checkIn
          ? `from ${pretty(checkIn)}`
          : "— my dates are flexible";
    return `Hello Himalayan Shepherd, is ${room === "any" ? "a room" : `the ${roomName}`} available ${when} for ${who}?`;
  }, [checkIn, checkOut, guests, nights, room]);

  const field =
    "w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none transition focus:border-gold [color-scheme:dark]";
  const label = "mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/55";

  return (
    <form
      ref={root}
      id="plan"
      onSubmit={(event) => {
        event.preventDefault();
        window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
      }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm md:p-5"
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-white/80">
        <CalendarDays className="h-4 w-4 text-gold" />
        Plan your stay
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="plan-in" className={label}>
            Check-in
          </label>
          <input
            id="plan-in"
            type="date"
            min={today}
            value={checkIn}
            onChange={(event) => {
              setCheckIn(event.target.value);
              if (checkOut && event.target.value >= checkOut) setCheckOut("");
            }}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="plan-out" className={label}>
            Check-out
          </label>
          <input
            id="plan-out"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className={field}
          />
        </div>
        <div>
          <span className={label}>Guests</span>
          <div className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.06] px-2 py-1.5">
            <button
              type="button"
              aria-label="Fewer guests"
              onClick={() => setGuests((value) => Math.max(1, value - 1))}
              className="grid h-7 w-7 place-items-center rounded-full text-white/80 hover:bg-white/10"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-sm tabular-nums">{guests}</span>
            <button
              type="button"
              aria-label="More guests"
              onClick={() => setGuests((value) => Math.min(8, value + 1))}
              className="grid h-7 w-7 place-items-center rounded-full text-white/80 hover:bg-white/10"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="plan-room" className={label}>
            Room
          </label>
          <select
            id="plan-room"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
            className={`${field} appearance-none`}
          >
            <option value="any" className="text-ink">
              Any room
            </option>
            {ROOM_TIERS.map((tier) => (
              <option key={tier.id} value={tier.id} className="text-ink">
                {tier.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-medium tracking-wide text-white transition hover:brightness-110"
      >
        <MessageCircle className="h-4 w-4" />
        {nights ? `Check ${nights} ${nights === 1 ? "night" : "nights"} on WhatsApp` : "Check availability on WhatsApp"}
      </button>
      <p className="mt-3 text-center text-[11px] tracking-wide text-white/50">
        No booking fees · The house replies personally
      </p>
    </form>
  );
}
