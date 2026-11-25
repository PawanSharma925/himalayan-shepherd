"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CheckCheck, MessageCircle, Pencil, RotateCcw } from "lucide-react";
import { HOTEL, whatsappHref } from "@/lib/hotel";
import { useLocale } from "@/lib/i18n";
import { planStore } from "@/lib/planStore";
import { SmartImage } from "./SmartImage";
import { openTripCard } from "./TripCard";

export function MessageTheHouse() {
  const { t, locale } = useLocale();
  const planned = useSyncExternalStore(
    planStore.subscribe,
    planStore.get,
    planStore.getServer,
  ).message;
  const [edited, setEdited] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const text = edited ?? planned;
  const drifted = edited !== null && edited !== planned;

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString(locale === "zh-HK" ? "zh-HK" : "en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kathmandu",
        }),
      );
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 30000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [locale]);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0f0d0a] shadow-[0_40px_100px_rgba(0,0,0,0.45)]">
      <div className="flex items-center gap-3 bg-[#1f2c26] px-5 py-4">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-cream p-1">
          <SmartImage
            src="/brand/logo.jpg"
            alt=""
            fill
            sizes="44px"
            quality={80}
            className="object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{HOTEL.name}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25d366]" />
            {t("message.reception")}
            {time ? ` · ${time}` : ""}
          </p>
        </div>
      </div>

      <div className="space-y-4 bg-[#ece5d8] bg-[radial-gradient(rgba(23,20,16,0.06)_1px,transparent_1px)] [background-size:14px_14px] px-4 py-6 sm:px-6">
        <p className="mx-auto w-fit rounded-md bg-white/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          {t("message.today")}
        </p>

        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-[15px] leading-6 text-ink shadow-sm">
          {t("message.welcome")}
          <span className="mt-1 block text-right text-[10px] text-ink-soft/70">
            {t("message.sender")}
          </span>
        </div>

        <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-4 pb-2 pt-3 shadow-sm">
          <label htmlFor="house-message" className="sr-only">
            {t("message.yourMessage")}
          </label>
          <textarea
            id="house-message"
            value={text}
            onChange={(event) => setEdited(event.target.value)}
            rows={4}
            className="block min-h-24 w-full resize-none bg-transparent text-[15px] leading-6 text-ink outline-none [field-sizing:content]"
          />
          <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-ink-soft/70">
            <Pencil className="h-3 w-3" />
            {t("message.tapToEdit")}
            <CheckCheck className="ml-1 h-3.5 w-3.5 text-[#53bdeb]" />
          </span>
        </div>

        {drifted ? (
          <button
            type="button"
            onClick={() => setEdited(null)}
            className="ml-auto flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs text-ink-soft shadow-sm hover:bg-white"
          >
            <RotateCcw className="h-3 w-3" />
            {t("message.useLatest")}
          </button>
        ) : null}
      </div>

      <div className="space-y-3 bg-[#0f0d0a] p-4 sm:p-5">
        <a
          href={whatsappHref(text)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" />
          {t("message.sendWhatsApp")}
        </a>
        <p className="text-center text-xs text-white/50">
          {t("message.changeDates")}{" "}
          <a href="#plan" className="text-gold underline-offset-4 hover:underline">
            {t("message.openPlanner")}
          </a>{" "}
          · {t("message.preferTalk")}{" "}
          <a href={HOTEL.phoneHref} className="text-gold underline-offset-4 hover:underline">
            {t("message.callShepherd")}
          </a>
          <br />
          {t("message.planningTogether")}{" "}
          <button
            type="button"
            onClick={openTripCard}
            className="text-gold underline-offset-4 hover:underline"
          >
            {t("message.shareTrip")}
          </button>
        </p>
      </div>
    </div>
  );
}
