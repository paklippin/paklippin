export type StoredUser = { name: string; email: string; phone?: string } | null;

export function readUser(): StoredUser {
  if (typeof window === 'undefined') return null;
  try {
    for (const key of ['auth-storage', 'paklippin-auth', 'auth', 'user']) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw);
      const u = data?.state?.user || data?.user || data;
      if (u && (u.email || u.name)) {
        return {
          name:  u.name  || u.fullName || (u.email ? u.email.split('@')[0] : 'User'),
          email: u.email || '',
          phone: u.phone || '',
        };
      }
    }
    const email = localStorage.getItem('user_email');
    const name  = localStorage.getItem('user_name');
    if (email || name) return { name: name || 'User', email: email || '' };
  } catch {}
  return null;
}

export function writeUser(u: { name: string; email: string; phone?: string }) {
  localStorage.setItem('auth-storage', JSON.stringify({ state: { user: u }, version: 0 }));
  localStorage.setItem('user_email', u.email);
  localStorage.setItem('user_name',  u.name);
  if (u.phone) localStorage.setItem('user_phone', u.phone);
}

export function clearUser() {
  ['auth-storage', 'paklippin-auth', 'auth', 'user', 'user_email', 'user_name', 'user_phone']
    .forEach((k) => localStorage.removeItem(k));
}

export type Order = {
  id: string;
  date?: string;
  status?: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customer?: { name: string; email?: string; phone: string; address: string; city: string; notes?: string };
  payment?: { method: string; txnId: string; amount: number };
};

function normalize(o: any): Order {
  return {
    id:     String(o.id ?? o.order_id ?? o.orderId ?? o.code ?? ''),
    date:   o.date ?? o.created_at ?? o.createdAt,
    status: o.status ?? 'processing',
    total:  Number(o.total ?? o.total_amount ?? o.amount ?? 0),
    items:  Array.isArray(o.items) ? o.items : [],
    customer: o.customer,
    payment:  o.payment,
  };
}

function readLocal(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('user_orders');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalize) : [];
  } catch { return []; }
}

// Only keep local orders that belong to the given email
function filterLocalByEmail(list: Order[], email: string): Order[] {
  const target = (email || '').toLowerCase().trim();
  if (!target) return [];
  return list.filter((o) => (o.customer?.email || '').toLowerCase().trim() === target);
}

// Push a single order to D1 (fire and forget)
async function pushToD1(order: Order) {
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
  } catch {}
}

// Sync any local-only orders that aren't yet in D1
export async function syncLocalOrders(email: string): Promise<void> {
  const local = filterLocalByEmail(readLocal(), email);
  if (!local.length) return;
  // We can't easily know which exist in D1 without another call,
  // so just push them all — the INSERT OR REPLACE makes it idempotent.
  await Promise.all(local.map(pushToD1));
}

export async function fetchOrders(email?: string): Promise<Order[]> {
  const target = (email || '').toLowerCase().trim();
  let apiList: Order[] = [];

  if (target) {
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(target)}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const list: any[] = Array.isArray(json) ? json : (json.orders ?? json.data ?? []);
        apiList = list.map(normalize);
      }
    } catch (e) {
      console.warn('[orders] API failed:', (e as Error).message);
    }
  }

  // ✅ ONLY local orders that belong to this user
  const localList = filterLocalByEmail(readLocal(), target);

  // Merge + dedupe by ID
  const byId = new Map<string, Order>();
  [...apiList, ...localList].forEach((o) => {
    if (!o.id) return;
    byId.set(o.id, o);
  });

  return Array.from(byId.values()).sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  // Local update
  try {
    const raw = localStorage.getItem('user_orders');
    if (raw) {
      const list: any[] = JSON.parse(raw);
      const next = list.map((o) => o.id === id ? { ...o, status } : o);
      localStorage.setItem('user_orders', JSON.stringify(next));
    }
  } catch {}

  try {
    const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch { return false; }
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const raw = localStorage.getItem('user_orders');
    if (raw) {
      const list: any[] = JSON.parse(raw);
      localStorage.setItem('user_orders', JSON.stringify(list.filter((o) => o.id !== id)));
    }
  } catch {}
  try {
    const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  } catch { return false; }
}

export function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return `PKL-${code}`;
}

export type NewOrder = {
  id: string;
  date: string;
  status: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customer: { name: string; email: string; phone: string; address: string; city: string; notes?: string };
  payment: { method: string; txnId: string; amount: number };
};

export async function createOrder(order: NewOrder): Promise<{ ok: boolean; offline?: boolean }> {
  let apiOk = false;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.ok) apiOk = true;
    }
  } catch {}

  // Always also save locally (safety net)
  try {
    const raw = localStorage.getItem('user_orders');
    const list: any[] = raw ? JSON.parse(raw) : [];
    if (!list.some((o) => o.id === order.id)) list.unshift(order);
    localStorage.setItem('user_orders', JSON.stringify(list));
  } catch {}

  return { ok: true, offline: !apiOk };
}

export const EASYPAISA = {
  number: '0339 7910131',
  name:   'Shouaib Imran',
  account: 'PAKLIPPIN',
};
