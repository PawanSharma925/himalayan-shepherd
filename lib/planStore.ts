export const DEFAULT_PLAN_MESSAGE =
  "Hello Himalayan Shepherd, is a room available — my dates are flexible for 2 guests?";

export type PlanSnapshot = {
  message: string;
  summary: string[];
  hasPlan: boolean;
};

const DEFAULT_PLAN: PlanSnapshot = {
  message: DEFAULT_PLAN_MESSAGE,
  summary: ["Flexible dates", "2 guests"],
  hasPlan: false,
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
