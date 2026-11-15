"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudSun, Mountain, Sunrise } from "lucide-react";
import { PLAN_DATES_EVENT, type PlanDatesDetail } from "./StayPlanner";

const FORECAST_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=28.2096&longitude=83.9856&hourly=cloud_cover&daily=sunrise&current=temperature_2m&timezone=Asia%2FKathmandu&forecast_days=8";

type Forecast = {
  current: { time: string; temperature_2m: number };
  hourly: { time: string[]; cloud_cover: number[] };
  daily: { time: string[]; sunrise: string[] };
};

type Morning = {
  date: string;
  cloud: number;
  sunrise: string;
};

const MORNING_HOURS = ["06:00", "07:00", "08:00"];

const shiftDate = (date: string, days: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

const weekday = (date: string, today: string) => {
  if (date === today) return "Today";
  if (date === shiftDate(today, 1)) return "Tomorrow";
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });
};

const dayMonth = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });

function verdict(cloud: number) {
  if (cloud < 25) return { label: "Peaks likely clear", Icon: Mountain, tone: "text-gold" };
  if (cloud < 60) return { label: "Partly clouded", Icon: CloudSun, tone: "text-white/80" };
  return { label: "Hidden in cloud", Icon: Cloud, tone: "text-white/45" };
}

function toMornings(data: Forecast): { today: string; mornings: Morning[] } {
  const [today, clock] = data.current.time.split("T");
  const index = new Map(data.hourly.time.map((time, i) => [time, i]));
  const mornings = data.daily.time
    .map((date, i) => {
      const values = MORNING_HOURS.map(
        (hour) => data.hourly.cloud_cover[index.get(`${date}T${hour}`) ?? -1],
      ).filter((value): value is number => typeof value === "number");
      return {
        date,
        cloud: values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 100,
        sunrise: data.daily.sunrise[i].split("T")[1],
      };
    })
    .filter((morning) => morning.date > today || clock < "09:00")
    .slice(0, 7);
  return { today, mornings };
}

export function MountainForecast() {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error" }
    | { status: "ready"; today: string; now: string; temp: number; mornings: Morning[] }
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch(FORECAST_URL, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<Forecast>;
      })
      .then((data) => {
        const { today, mornings } = toMornings(data);
        setState({
          status: "ready",
          today,
          now: data.current.time.split("T")[1],
          temp: Math.round(data.current.temperature_2m),
          mornings,
        });
      })
      .catch((error: unknown) => {
        if ((error as Error).name !== "AbortError") setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  if (state.status === "error") return null;

  const best =
    state.status === "ready"
      ? state.mornings.reduce<Morning | null>(
          (top, morning) => (!top || morning.cloud < top.cloud ? morning : top),
          null,
        )
      : null;

  const plan = (morning: Morning) => {
    if (state.status !== "ready") return;
    const arrive = shiftDate(morning.date, -1);
    const detail: PlanDatesDetail = {
      checkIn: arrive < state.today ? state.today : arrive,
      checkOut: shiftDate(morning.date, 1),
      sunrise: morning.date,
    };
    window.dispatchEvent(new CustomEvent(PLAN_DATES_EVENT, { detail }));
  };

  return (
    <section
      id="forecast"
      aria-label="Annapurna sunrise forecast"
      className="border-t border-white/10 bg-ink px-5 py-14 text-white md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="kicker !text-gold">Live from Pokhara</p>
            <h2 className="mt-4 font-serif text-[2rem] leading-tight sm:text-4xl md:text-5xl">
              Will the Annapurna show itself?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              The peaks are clearest just after sunrise. Here is the morning cloud
              forecast for the next seven days — tap a clear one and we&rsquo;ll plan
              your stay around it.
            </p>
          </div>
          <p className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm text-white/60">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {state.status === "ready"
              ? `Now in Lakeside · ${state.temp}°C · ${state.now}`
              : "Checking the sky over Lakeside…"}
          </p>
        </div>

        <div className="-mx-5 mt-8 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mt-10 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0 pt-3 [&::-webkit-scrollbar]:hidden">
          {state.status === "loading"
            ? Array.from({ length: 7 }, (_, i) => (
                <div
                  key={i}
                  className="h-[230px] w-[150px] shrink-0 animate-pulse rounded-2xl bg-white/[0.05] lg:w-auto"
                />
              ))
            : state.mornings.map((morning) => {
                const { label, Icon, tone } = verdict(morning.cloud);
                const isBest = best?.date === morning.date && morning.cloud < 60;
                return (
                  <button
                    key={morning.date}
                    type="button"
                    onClick={() => plan(morning)}
                    className={`group relative flex w-[150px] shrink-0 snap-start flex-col rounded-2xl border p-4 text-left transition hover:-translate-y-1 hover:border-gold lg:w-auto ${
                      isBest
                        ? "border-gold bg-gold/[0.12]"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    {isBest ? (
                      <span className="absolute -top-2.5 left-4 whitespace-nowrap rounded-full bg-gold px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-ink">
                        Best morning
                      </span>
                    ) : null}
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/55">
                      {state.status === "ready" ? weekday(morning.date, state.today) : ""}
                    </span>
                    <span className="mt-1 whitespace-nowrap font-serif text-2xl">{dayMonth(morning.date)}</span>
                    <Icon className={`mt-4 h-7 w-7 ${tone}`} strokeWidth={1.5} />
                    <span className={`mt-2 text-sm leading-snug ${tone}`}>{label}</span>
                    <span className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full bg-gold"
                        style={{ width: `${100 - morning.cloud}%` }}
                      />
                    </span>
                    <span className="mt-3 flex items-center gap-1.5 text-[11px] text-white/50">
                      <Sunrise className="h-3.5 w-3.5" />
                      {morning.sunrise} · {morning.cloud}% cloud
                    </span>
                    <span className="mt-3 text-xs text-gold opacity-0 transition group-hover:opacity-100 max-md:opacity-100">
                      Plan around this →
                    </span>
                  </button>
                );
              })}
        </div>
        <p className="mt-4 text-[11px] text-white/40">
          Forecast by Open-Meteo, refreshed on every visit. Mountain weather changes fast — the
          house will tell you what the sky looks like when you message.
        </p>
      </div>
    </section>
  );
}
