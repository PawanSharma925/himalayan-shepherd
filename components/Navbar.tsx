"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { HOTEL, NAV_LINKS } from "@/lib/hotel";
import { WhatsAppButton } from "./WhatsAppButton";
import { SmartImage } from "./SmartImage";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 z-40 w-full transition-all duration-500 ${
        scrolled || open
          ? "border-b border-sand/70 bg-white/80 shadow-[0_10px_40px_rgba(23,20,16,0.06)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 md:px-8">
        <a href="#top" className="flex items-center gap-3">
          <span className="relative flex h-12 w-12 overflow-hidden rounded-full bg-cream shadow-sm ring-1 ring-sand/80">
            <SmartImage
              src="/brand/logo.jpg"
              alt={`${HOTEL.name} emblem`}
              fill
              priority
              sizes="48px"
              quality={80}
              className="object-cover"
            />
          </span>
          <span className="leading-tight">
            <span
              className={`block font-serif text-lg tracking-wide md:text-xl ${
                scrolled || open ? "text-ink" : "text-white"
              }`}
            >
              {HOTEL.name}
            </span>
            <span
              className={`hidden text-[10px] uppercase tracking-[0.28em] sm:block ${
                scrolled || open ? "text-gold-deep" : "text-white/70"
              }`}
            >
              Pokhara · Nepal
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[12px] tracking-[0.14em] uppercase transition hover:text-gold ${
                scrolled ? "text-ink-soft" : "text-white/85"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <WhatsAppButton label="WhatsApp inquiry" />
        </div>

        <button
          type="button"
          className={`xl:hidden ${scrolled || open ? "text-ink" : "text-white"}`}
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-sand bg-white/95 px-5 py-6 backdrop-blur-md xl:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-serif text-2xl text-ink"
              >
                {link.label}
              </a>
            ))}
            <WhatsAppButton className="mt-2 w-full" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
