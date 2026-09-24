'use client';
import { create } from 'zustand';

type User = { name: string; email: string; phone?: string };

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  loadFromStorage: () => void;
};

// Save user to localStorage (works offline)
function saveLocal(user: User) {
  try {
    localStorage.setItem('auth-storage', JSON.stringify({ state: { user }, version: 0 }));
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_name', user.name);
    if (user.phone) localStorage.setItem('user_phone', user.phone);
  } catch {}
}

function readLocal(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    for (const key of ['auth-storage', 'paklippin-auth', 'auth', 'user']) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      const u = data?.state?.user || data?.user || data;
      if (u && (u.email || u.name)) {
        return { name: u.name || 'User', email: u.email || '', phone: u.phone || '' };
      }
    }
    const email = localStorage.getItem('user_email');
    const name  = localStorage.getItem('user_name');
    const phone = localStorage.getItem('user_phone') || '';
    if (email || name) return { name: name || 'User', email: email || '', phone };
  } catch {}
  return null;
}

// Fire-and-forget sync to D1 (never blocks, never throws)
function syncToD1(user: User, password: string) {
  fetch('/api/auth/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user, password }),
  }).catch(() => {});
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  loadFromStorage: () => {
    const u = readLocal();
    set({ user: u, loading: false });
  },

  login: async (email, password) => {
    if (!email || !password) return { ok: false, error: 'Email and password required' };
    // Try D1 first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.user) {
          saveLocal(data.user);
          set({ user: data.user, loading: false });
          return { ok: true };
        }
        if (data.error) return { ok: false, error: data.error };
      }
    } catch {}

    // Fallback: localStorage trust (for users who registered before D1 was ready)
    const existing = readLocal();
    if (existing && existing.email === email) {
      set({ user: existing, loading: false });
      return { ok: true };
    }

    return { ok: false, error: 'Account not found. Please register first.' };
  },

  register: async ({ name, email, phone, password }) => {
    if (!name || !email || !password) return { ok: false, error: 'All fields required' };

    const user: User = { name, email, phone };
    saveLocal(user);           // save locally first (always works)
    set({ user, loading: false });

    // Sync to D1 in background
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    }).catch(() => {});

    return { ok: true };
  },

  logout: () => {
    ['auth-storage', 'paklippin-auth', 'auth', 'user', 'user_email', 'user_name', 'user_phone']
      .forEach((k) => { try { localStorage.removeItem(k); } catch {} });
    set({ user: null });
  },
}));
