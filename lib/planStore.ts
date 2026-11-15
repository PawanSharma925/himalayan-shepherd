export const DEFAULT_PLAN_MESSAGE =
  "Hello Himalayan Shepherd, is a room available — my dates are flexible for 2 guests?";

export const OPEN_TRIP_EVENT = "open-trip";

export type PlanSnapshot = {
  message: string;
  summary: string[];
  hasPlan: boolean;
  share: string;
};

const DEFAULT_PLAN: PlanSnapshot = {
  message: DEFAULT_PLAN_MESSAGE,
  summary: ["Flexible dates", "2 guests"],
  hasPlan: false,
  share: "",
};

let plan = DEFAULT_PLAN;
const listeners = new Set<() => void>();

export const planStore = {
  get: () => plan,
  getServer: () => DEFAULT_PLAN,
  set(next: PlanSnapshot) {
    if (
      next.message === plan.message &&
      next.hasPlan === plan.hasPlan &&
      next.share === plan.share &&
      next.summary.join("|") === plan.summary.join("|")
    ) {
      return;
    }
    plan = next;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

const PLAN_KEYS = ["in", "out", "g", "room", "sun", "arr", "do"];
const STORAGE_KEY = "hs-plan";

export type InitialPlan = {
  params: URLSearchParams;
  source: "shared" | "saved" | null;
};

let initial: InitialPlan | null = null;

export function initialPlan(): InitialPlan {
  if (initial) return initial;
  const url = new URLSearchParams(window.location.search);
  if (PLAN_KEYS.some((key) => url.has(key))) {
    initial = { params: url, source: "shared" };
    return initial;
  }
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(STORAGE_KEY);
  } catch {}
  initial = saved
    ? { params: new URLSearchParams(saved), source: "saved" }
    : { params: new URLSearchParams(), source: null };
  return initial;
}

export function savePlan(share: string) {
  try {
    if (share) window.localStorage.setItem(STORAGE_KEY, share);
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
