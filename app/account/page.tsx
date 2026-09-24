'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AccountShell } from '@/components/account/AccountShell';
import { readUser, writeUser, fetchOrders, type Order, type StoredUser } from '@/lib/user';

export default function AccountPage() {
  const [user, setUser]     = useState<StoredUser>(null);
  const [ready, setReady]   = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mode, setMode]     = useState<'login' | 'register'>('login');
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError]   = useState('');

  useEffect(() => {
    setUser(readUser());
    setReady(true);
    const id = setInterval(() => setUser(readUser()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user?.email) { setOrders([]); return; }
    let alive = true;
    const load = () => fetchOrders(user.email).then((list) => { if (alive) setOrders(list); });
    load();
    const id = setInterval(load, 5000);
    window.addEventListener('storage', load);
    return () => { alive = false; clearInterval(id); window.removeEventListener('storage', load); };
  }, [user?.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password.trim()) { setError('Email and password required'); return; }
    if (mode === 'register' && !form.name.trim()) { setError('Name required'); return; }
    const u = {
      name:  form.name.trim() || form.email.split('@')[0],
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
    writeUser(u);
    setUser(u);
  };

  if (!ready) return null;

  if (!user) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-12">
        <div className="w-full max-w-[420px] bg-white border border-border rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold mb-2 text-center">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-text-secondary text-center mb-6">
            {mode === 'login' ? 'Login to view your orders' : 'Register to start shopping'}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <input type="text" placeholder="Full name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition" />
            )}
            <input type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition" />
            {mode === 'register' && (
              <input type="tel" placeholder="Phone (optional)" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition" />
            )}
            <input type="password" placeholder="Password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition" />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button type="submit" className="w-full py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition">
              {mode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-4 text-sm">
            {mode === 'login' ? (
              <button onClick={() => setMode('register')} className="text-brand-accent hover:underline">Need an account? Register</button>
            ) : (
              <button onClick={() => setMode('login')} className="text-brand-accent hover:underline">Already have one? Login</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalSpent  = orders.reduce((s, o) => s + o.total, 0);
  const inTransit   = orders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    return s === 'processing' || s === 'shipped' || s === 'out for delivery' || s === 'intransit';
  }).length;

  return (
    <AccountShell user={user}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name.split(' ')[0]} 👋</h1>
        <p className="text-text-secondary text-sm">Your account snapshot</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-brand-accent">{totalOrders}</div>
          <div className="text-xs uppercase tracking-wider text-text-secondary mt-1 font-semibold">Total Orders</div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-brand-accent">PKR {totalSpent.toLocaleString()}</div>
          <div className="text-xs uppercase tracking-wider text-text-secondary mt-1 font-semibold">Total Spent</div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 text-center">
          <div className="text-3xl font-bold text-brand-accent">{inTransit}</div>
          <div className="text-xs uppercase tracking-wider text-text-secondary mt-1 font-semibold">In Transit</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-8 text-center text-text-secondary text-sm">
            No orders yet. <Link href="/" className="text-brand-accent hover:underline">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="bg-white border border-border rounded-2xl p-5">
                <div className="flex justify-between items-start gap-3 mb-2 flex-wrap">
                  <div>
                    <div className="font-bold text-base">{o.id}</div>
                    {o.date && (
                      <div className="text-xs text-text-secondary">
                        {new Date(o.date).toLocaleString('en-PK')}
                      </div>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700 uppercase whitespace-nowrap">
                    {o.status || 'processing'}
                  </span>
                </div>
                {o.items.length > 0 && (
                  <div className="text-sm text-text-secondary mb-2">
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-xs text-text-secondary">Total:</span>
                  <span className="font-bold text-brand-accent">Rs {o.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountShell>
  );
}
