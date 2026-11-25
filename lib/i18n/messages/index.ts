import type { Locale } from "../types";
import { en, type Messages } from "./en";
import { zhHK } from "./zh-HK";

export const catalogs: Record<Locale, Messages> = {
  en,
  "zh-HK": zhHK,
};

export type { Messages };
