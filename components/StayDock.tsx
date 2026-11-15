"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { CalendarDays, MessageCircle, Pencil, Phone } from "lucide-react";
import { HOTEL, whatsappHref } from "@/lib/hotel";
import { planStore } from "@/lib/planStore";

const WATCHED = ["plan", "contact"];

export function StayDock() {
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const [covered, setCovered] = useState(true);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      }
      setCovered(visible.size > 0);
    });
    WATCHED.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const send = whatsappHref(plan.message);

  return (
    <>
      <div
        aria-hidden={covered}
        className={`fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 transition-all duration-500 md:block ${
          covered ? "pointer-events-none translate-y-6 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-ink/95 py-2 pl-5 pr-2 text-cream shadow-[0_20px_60px_rgba(23,20,16,0.35)] backdrop-blur">
          <CalendarDays className="h-4 w-4 shrink-0 text-gold" />
          <span className="max-w-[28rem] truncate pr-2 text-sm">
            {plan.hasPlan ? plan.summary.join(" · ") : "Planning a stay in Pokhara?"}
          </span>
          <a
            href="#plan"
            tabIndex={covered ? -1 : undefined}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm text-cream/80 transition hover:bg-white/10 hover:text-cream"
          >
            <Pencil className="h-3.5 w-3.5" />
            {plan.hasPlan ? "Edit" : "Pick dates"}
          </a>
          <a
            href={send}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={covered ? -1 : undefined}
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <MessageCircle className="h-4 w-4" />
            {plan.hasPlan ? "Send on WhatsApp" : "Ask the house"}
          </a>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white/92 px-3 pb-3 pt-2 backdrop-blur-md md:hidden">
        {plan.hasPlan ? (
          <a
            href="#plan"
            className="mb-2 flex items-center justify-center gap-1.5 truncate text-xs text-ink-soft"
          >
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gold-deep" />
            <span className="truncate">{plan.summary.join(" · ")}</span>
            <span className="shrink-0 text-gold-deep underline underline-offset-2">Edit</span>
          </a>
        ) : null}
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <a
            href={HOTEL.phoneHref}
            aria-label="Call the house"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
          {plan.hasPlan ? (
            <a
              href={send}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp py-3 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Send on WhatsApp
            </a>
          ) : (
            <a
              href="#plan"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp py-3 text-sm font-medium text-white"
            >
              <CalendarDays className="h-4 w-4" />
              Check dates
            </a>
          )}
        </div>
      </div>
    </>
  );
}
