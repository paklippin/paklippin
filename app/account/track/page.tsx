'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Truck, Search } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { readUser, fetchOrders, type Order, type StoredUser } from '@/lib/user';

const STAGES = ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function TrackPage() {
  const [user, setUser]     = useState<StoredUser>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [id, setId]         = useState('');
  const [result, setResult] = useState<Order | 'not-found' | null>(null);

  useEffect(() => {
    const u = readUser();
    setUser(u);
    if (u?.email) fetchOrders(u.email).then(setOrders);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const needle = id.trim().toUpperCase();
    if (!needle) { setResult(null); return; }
    const found = orders.find((o) => o.id.toUpperCase() === needle);
    setResult(found || 'not-found');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-5">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Please login first.</p>
          <Link href="/account" className="inline-block bg-brand-accent text-white px-8 py-3 rounded-full font-semibold">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const order = result !== 'not-found' && result ? result : null;
  const stageIndex = order
    ? Math.max(0, STAGES.findIndex((s) => s.toLowerCase() === (order.status || 'processing').toLowerCase()))
    : -1;

  return (
    <AccountShell user={user}>
      <h1 className="text-3xl font-bold mb-2">Track Order</h1>
      <p className="text-text-secondary mb-8 text-sm">Enter your order ID to see live status.</p>

      <form onSubmit={handleTrack} className="flex gap-3 mb-6">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. PKL-TEY8A8"
          className="flex-1 px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition"
        />
        <button type="submit" className="bg-brand-accent text-white font-semibold px-6 rounded-xl flex items-center gap-2 hover:bg-[#e55a2b] transition">
          <Search size={16} /> Track
        </button>
      </form>

      {result === 'not-found' && (
        <div className="rounded-xl p-4 text-sm bg-red-50 border border-red-200 text-red-700">
          Order not found. Check the ID or contact support.
        </div>
      )}

      {order && (
        <div className="bg-white border border-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <div className="font-semibold">{order.id}</div>
              <div className="text-xs text-text-secondary">Total: Rs {order.total.toLocaleString()}</div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              {(order.status || 'processing').toUpperCase()}
            </span>
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold text-text-secondary mb-2">
              {STAGES.map((s, i) => (
                <span key={s} className={i <= stageIndex ? 'text-brand-accent' : ''}>{s}</span>
              ))}
            </div>
            <div className="h-2 bg-brand-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-accent transition-all"
                style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Truck className="text-brand-accent" size={18} /> Tracking stages
        </h3>
        <ol className="text-sm text-text-secondary space-y-2 pl-5 list-decimal">
          {STAGES.map((s) => <li key={s}>{s}</li>)}
        </ol>
      </div>
    </AccountShell>
  );
}
