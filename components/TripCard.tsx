"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Link2, MessageCircle, Pencil, Share2, Sunrise, Ticket, Users, X } from "lucide-react";
import { whatsappHref } from "@/lib/hotel";
import { initialPlan, OPEN_TRIP_EVENT, planStore, savePlan } from "@/lib/planStore";
import { ROOM_TIERS } from "@/lib/rooms";
import { ROUTES } from "./GettingHere";
import { PLACES } from "./PokharaMap";

const LAKE = "/images/hotel/view/himalayan-shepherd-01-lake-and-mountains-hd.jpg";

export const openTripCard = () => window.dispatchEvent(new Event(OPEN_TRIP_EVENT));

const day = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return {
    weekday: date.toLocaleDateString("en-GB", { weekday: "short" }),
    date: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
  };
};

function readTrip(share: string) {
  const query = new URLSearchParams(share);
  const checkIn = query.get("in") ?? "";
  const checkOut = query.get("out") ?? "";
  const nights =
    checkIn && checkOut
      ? Math.round(
          (new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) /
            86400000,
        )
      : 0;
  const [arrivalId, arrivalTime] = (query.get("arr") ?? "").split("|");
  const doing = (query.get("do") ?? "").split(".");
  return {
    checkIn,
    checkOut,
    nights,
    guests: Number(query.get("g") ?? 2) || 2,
    room: ROOM_TIERS.find((tier) => tier.id === query.get("room")),
    sunrise: query.get("sun") ?? "",
    route: ROUTES.find((item) => item.id === arrivalId),
    arrivalTime,
    places: PLACES.filter((place) => doing.includes(place.id)),
  };
}

export function TripCard() {
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const [open, setOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(OPEN_TRIP_EVENT, onOpen);
    let later = 0;
    const timer = window.setTimeout(() => {
      const first = initialPlan();
      if (first.source === "shared") {
        window.history.replaceState(null, "", window.location.pathname + window.location.hash);
        setShared(true);
        later = window.setTimeout(() => setOpen(true), 900);
      } else if (first.source === "saved") {
        setWelcome(true);
        later = window.setTimeout(() => setWelcome(false), 14000);
      }
    }, 0);
    return () => {
      window.removeEventListener(OPEN_TRIP_EVENT, onOpen);
      window.clearTimeout(timer);
      window.clearTimeout(later);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trip = readTrip(plan.share);
  const link = () => `${window.location.origin}${window.location.pathname}${plan.share ? `?${plan.share}` : ""}`;
  const pitch = `Our Pokhara plan at Himalayan Shepherd — ${plan.summary.join(" · ")}. Have a look:`;

  const share = async () => {
    const url = link();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Our Pokhara plan", text: pitch, url });
        return;
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setManual(url);
    }
  };

  const close = () => {
    setOpen(false);
    setShared(false);
    setManual(null);
  };

  return (
    <>
      <AnimatePresence>
        {welcome && plan.hasPlan && !open ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            role="status"
            className="fixed inset-x-3 bottom-36 z-50 rounded-2xl border border-white/10 bg-ink/95 p-4 text-cream shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur md:inset-x-auto md:bottom-28 md:left-6 md:w-[22rem]"
          >
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setWelcome(false)}
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-cream/50 hover:bg-white/10 hover:text-cream"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-8 font-serif text-xl leading-tight">Welcome back.</p>
            <p className="mt-1 text-sm leading-6 text-cream/65">
              Your Pokhara plan is just as you left it: {plan.summary.join(" · ")}.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setWelcome(false);
                  setOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition hover:bg-cream"
              >
                <Ticket className="h-4 w-4" />
                See trip card
              </button>
              <button
                type="button"
                onClick={() => {
                  savePlan("");
                  window.location.reload();
                }}
                className="rounded-full px-4 py-2 text-sm text-cream/70 transition hover:bg-white/10 hover:text-cream"
              >
                Start fresh
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="trip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] overflow-y-auto bg-ink/95 backdrop-blur-md"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="trip-title"
              className="mx-auto flex min-h-full w-full max-w-[30rem] flex-col justify-center px-4 py-10"
              onClick={(event) => {
                if (event.target === event.currentTarget) close();
              }}
            >
              <div className="mb-5 flex items-start justify-between gap-4 text-cream">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
                    {shared ? "Shared with you" : "Your trip card"}
                  </p>
                  <h2 id="trip-title" className="mt-2 font-serif text-3xl leading-tight">
                    {shared ? "Someone is planning Pokhara with you." : "Plan it together."}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-cream/65">
                    {shared
                      ? "Here's the plan they made. Change anything you like, or send it straight to the house."
                      : "Share it with whoever you're travelling with — the link opens this exact plan."}
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  aria-label="Close trip card"
                  onClick={close}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-cream transition hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.article
                initial={{ y: 40, rotate: -2, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 20 }}
                className="overflow-hidden rounded-[1.6rem] bg-paper text-ink shadow-[0_50px_120px_rgba(0,0,0,0.5)]"
              >
                <div className="relative h-44 sm:h-48">
                  <Image
                    src={trip.room?.cover ?? LAKE}
                    alt={trip.room ? trip.room.name : "Fewa Lake and the Annapurna range"}
                    fill
                    sizes={trip.room ? "480px" : "960px"}
                    quality={85}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-ink/30" />
                  <p className="absolute left-5 top-4 text-[10px] uppercase tracking-[0.28em] text-cream/85">
                    Himalayan Shepherd · Lakeside
                  </p>
                  <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3 text-cream">
                    <p className="font-serif text-[2.6rem] leading-none tracking-[0.12em]">POKHARA</p>
                    <p className="pb-1 text-right text-[10px] uppercase tracking-[0.22em] text-cream/75">
                      Nepal
                      <br />
                      28.2° N · 84.0° E
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-5 sm:px-6">
                  {trip.checkIn ? (
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Check-in</p>
                        <p className="mt-1 font-serif text-3xl leading-none">{day(trip.checkIn).date}</p>
                        <p className="mt-1 text-xs text-ink-soft">{day(trip.checkIn).weekday}</p>
                      </div>
                      <div className="text-center">
                        <div className="mx-auto h-px w-12 bg-gold" />
                        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gold-deep">
                          {trip.nights ? `${trip.nights} ${trip.nights === 1 ? "night" : "nights"}` : "Open"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Check-out</p>
                        <p className="mt-1 font-serif text-3xl leading-none">
                          {trip.checkOut ? day(trip.checkOut).date : "—"}
                        </p>
                        <p className="mt-1 text-xs text-ink-soft">
                          {trip.checkOut ? day(trip.checkOut).weekday : "Flexible"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Dates</p>
                      <p className="mt-1 font-serif text-3xl leading-none">Flexible</p>
                    </div>
                  )}

                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-sand pt-5 text-sm">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Guests</dt>
                      <dd className="mt-1 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-gold-deep" />
                        {trip.guests} {trip.guests === 1 ? "guest" : "guests"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Room</dt>
                      <dd className="mt-1">{trip.room?.name ?? "Any room"}</dd>
                    </div>
                    {trip.route ? (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Arriving</dt>
                        <dd className="mt-1 flex items-center gap-1.5">
                          <trip.route.icon className="h-3.5 w-3.5 text-gold-deep" />
                          {trip.route.label}
                          {trip.arrivalTime ? ` · ${trip.arrivalTime}` : ""}
                        </dd>
                      </div>
                    ) : null}
                    {trip.sunrise ? (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">Sunrise</dt>
                        <dd className="mt-1 flex items-center gap-1.5">
                          <Sunrise className="h-3.5 w-3.5 text-gold-deep" />
                          Hoping for {day(trip.sunrise).date}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {trip.places.length ? (
                    <div className="mt-5">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft/70">In Pokhara</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {trip.places.map((place) => (
                          <li
                            key={place.id}
                            className="rounded-full border border-sand bg-cream px-3 py-1 text-xs text-ink-soft"
                          >
                            {place.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="relative flex items-center" aria-hidden="true">
                  <span className="absolute -left-3 h-6 w-6 rounded-full bg-ink" />
                  <span className="mx-5 h-px flex-1 border-t-2 border-dashed border-sand" />
                  <span className="absolute -right-3 h-6 w-6 rounded-full bg-ink" />
                </div>

                <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
                  <p className="text-xs leading-5 text-ink-soft">
                    <span className="font-semibold text-ink">Not booked yet.</span> A plan to send to
                    the house, who reply personally.
                  </p>
                  <Ticket className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.5} />
                </div>
              </motion.article>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition hover:bg-cream"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Link copied" : "Share the plan"}
                </button>
                <a
                  href={whatsappHref(plan.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" />
                  Send to the house
                </a>
              </div>
              {manual ? (
                <label className="mt-4 block text-xs text-cream/65">
                  Copy this link to share your plan
                  <input
                    readOnly
                    value={manual}
                    onFocus={(event) => event.currentTarget.select()}
                    autoFocus
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
                  />
                </label>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-cream/65">
                <button
                  type="button"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${pitch} ${link()}`)}`, "_blank", "noopener,noreferrer")}
                  className="inline-flex items-center gap-1.5 transition hover:text-gold"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Send to a friend on WhatsApp
                </button>
                <a
                  href="#plan"
                  onClick={close}
                  className="inline-flex items-center gap-1.5 transition hover:text-gold"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Change the plan
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
