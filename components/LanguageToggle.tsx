"use client";

import { useLocale } from "@/lib/i18n";

type Props = {
  tone?: "light" | "dark";
  className?: string;
};

export function LanguageToggle({ tone = "light", className = "" }: Props) {
  const { locale, setLocale, t } = useLocale();
  const next = locale === "en" ? "zh-HK" : "en";
  const label = next === "zh-HK" ? t("lang.switchToZh") : t("lang.switchToEn");

  const idle =
    tone === "dark"
      ? "text-ink-soft/55 hover:text-ink"
      : "text-white/55 hover:text-white";
  const active = tone === "dark" ? "text-ink" : "text-white";

  return (
    <div
      className={`inline-flex items-center gap-1 text-[11px] font-medium tracking-[0.14em] ${className}`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
        className={`rounded px-1.5 py-1 transition ${locale === "en" ? active : idle}`}
      >
        {t("lang.en")}
      </button>
      <span className={tone === "dark" ? "text-ink-soft/35" : "text-white/35"} aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => setLocale("zh-HK")}
        aria-pressed={locale === "zh-HK"}
        aria-label="繁體中文"
        className={`rounded px-1.5 py-1 transition ${locale === "zh-HK" ? active : idle}`}
      >
        {t("lang.zh")}
      </button>
    </div>
  );
}
