"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMessage, interpolate } from "./interpolate";
import { catalogs, type Messages } from "./messages";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (path: string, vars?: Record<string, string | number>) => string;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "zh-HK") return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LOCALE;
}

function applyDocumentLocale(locale: Locale) {
  const root = document.documentElement;
  root.lang = locale;
  root.dataset.locale = locale;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = readStoredLocale();
    setLocaleState(saved);
    applyDocumentLocale(saved);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    applyDocumentLocale(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "en" ? "zh-HK" : "en");
  }, [locale, setLocale]);

  const messages = catalogs[locale];

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) =>
      interpolate(getMessage(messages as unknown as Record<string, unknown>, path), vars),
    [messages],
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t, messages }),
    [locale, setLocale, toggleLocale, t, messages],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useT() {
  return useLocale().t;
}
