export const DEFAULT_PLAN_MESSAGE =
  "Hello Himalayan Shepherd, is a room available — my dates are flexible for 2 guests?";

let message = DEFAULT_PLAN_MESSAGE;
const listeners = new Set<() => void>();

export const planStore = {
  get: () => message,
  getServer: () => DEFAULT_PLAN_MESSAGE,
  set(next: string) {
    if (next === message) return;
    message = next;
    listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
