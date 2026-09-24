'use client';

const KEY = 'recently_viewed';
const MAX = 8;

export function trackView(productId: number) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(KEY);
    const ids: number[] = raw ? JSON.parse(raw) : [];
    const filtered = ids.filter((id) => id !== productId);
    const next = [productId, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('recent-change'));
  } catch {}
}

export function getRecentIds(): number[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function clearRecent() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event('recent-change'));
}
