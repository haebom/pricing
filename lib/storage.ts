export function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function safeSet<T>(key: string, value: T) {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // noop
  }
}

export const LS_KEYS = {
  recent: 'pricinglab:recent',
  psm: 'pricinglab:psm',
  gabor: 'pricinglab:gabor',
  conjoint: 'pricinglab:conjoint',
  integrated: 'pricinglab:integrated',
};