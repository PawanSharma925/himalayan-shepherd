"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { HOTEL } from "@/lib/hotel";
import { useLocale } from "@/lib/i18n";
import { planStore } from "@/lib/planStore";
import { LanguageToggle } from "./LanguageToggle";
import { WhatsAppButton } from "./WhatsAppButton";
import { SmartImage } from "./SmartImage";

const NAV_HREFS = [
  { href: "#about", key: "nav.about" },
  { href: "#rooms", key: "nav.rooms" },
  { href: "#dining", key: "nav.dining" },
  { href: "#gallery", key: "nav.gallery" },
  { href: "#explore", key: "nav.explore" },
  { href: "#forecast", key: "nav.forecast" },
  { href: "#contact", key: "nav.contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const plan = useSyncExternalStore(planStore.subscribe, planStore.get, planStore.getServer);
  const { t, locale } = useLocale();
  const tone = scrolled || open ? "dark" : "light";

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
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 md:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full bg-cream p-1 shadow-sm ring-1 ring-sand/80 sm:h-12 sm:w-12">
            <SmartImage
              src="/brand/logo.jpg"
              alt={t("nav.emblemAlt")}
              fill
              priority
              sizes="48px"
              quality={90}
              className="object-contain p-0.5"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span
              className={`block font-serif text-[14px] leading-tight tracking-wide sm:text-lg md:text-xl ${
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
              {t("lang.pokharaNepal")}
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_HREFS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[12px] tracking-[0.14em] uppercase transition hover:text-gold ${
                scrolled ? "text-ink-soft" : "text-white/85"
              } ${locale === "zh-HK" ? "tracking-[0.08em]" : ""}`}
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle tone={tone} />
          <div className="hidden md:block">
            <WhatsAppButton label={t("nav.whatsappInquiry")} message={plan.message} />
          </div>
          <button
            type="button"
            className={`xl:hidden ${scrolled || open ? "text-ink" : "text-white"}`}
            onClick={() => setOpen((value) => !value)}
            aria-label={t("nav.toggleMenu")}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-sand bg-white/95 px-5 py-6 backdrop-blur-md xl:hidden">
          <div className="flex flex-col gap-4">
            {NAV_HREFS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-serif text-2xl text-ink"
              >
                {t(link.key)}
              </a>
            ))}
            <WhatsAppButton className="mt-2 w-full" message={plan.message} label={t("nav.whatsappInquiry")} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
