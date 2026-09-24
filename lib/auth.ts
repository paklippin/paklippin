'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthStore = {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const KEY = 'paklippin-users';

function loadUsers(): Array<User & { password: string }> {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function saveUsers(users: Array<User & { password: string }>) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        const e = email.trim().toLowerCase();
        const users = loadUsers();
        const found = users.find((u) => u.email === e && u.password === password);
        if (!found) return { ok: false, error: 'Invalid email or password.' };
        set({ user: { id: found.id, name: found.name, email: found.email, phone: found.phone } });
        return { ok: true };
      },
      register: (name, email, password) => {
        const e = email.trim().toLowerCase();
        if (password.length < 6) return { ok: false, error: 'Password must be 6+ characters.' };
        const users = loadUsers();
        if (users.some((u) => u.email === e)) return { ok: false, error: 'Email already registered.' };
        const user = { id: 'u_' + Date.now().toString(36), name: name.trim(), email: e, password };
        users.push(user);
        saveUsers(users);
        set({ user: { id: user.id, name: user.name, email: user.email } });
        return { ok: true };
      },
      logout: () => set({ user: null }),
    }),
    { name: 'paklippin-auth' }
  )
);
