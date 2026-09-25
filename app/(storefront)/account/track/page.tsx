'use client';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import {
  Truck, Search, Package, Clock, CheckCheck, MapPin, Check, XCircle, RefreshCw,
} from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { readUser, fetchOrders, type Order, type StoredUser } from '@/lib/user';

const STAGES = [
  { key: 'placed',           label: 'Placed',           icon: Package },
  { key: 'processing',       label: 'Processing',       icon: Clock },
  { key: 'confirmed',        label: 'Confirmed',        icon: CheckCheck },
  { key: 'shipped',          label: 'Shipped',          icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered',        label: 'Delivered',        icon: Check },
];

export default function TrackPage() {
  const [user, setUser]     = useState<StoredUser>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [id, setId]         = useState('');
  const [result, setResult] = useState<Order | 'not-found' | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Auto-load orders + poll every 5 seconds
  useEffect(() => {
    const u = readUser();
    setUser(u);
    if (!u?.email) return;

    const load = async () => {
      const list = await fetchOrders(u.email);
      setOrders(list);
      setLastUpdated(new Date());
      // ✅ Re-run search against fresh data if we had a result
      const currentId = (result && result !== 'not-found') ? result.id : null;
      if (currentId) {
        const fresh = list.find((o) => o.id === currentId);
        if (fresh) setResult(fresh);
      }
    };

    load();
    const interval = setInterval(load, 5000);
    window.addEventListener('storage', load);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', load);
    };
  }, [(result && result !== 'not-found') ? result.id : null]); // re-run when search target changes

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const needle = id.trim().toUpperCase();
    if (!needle) { setResult(null); return; }
    const found = orders.find((o) => o.id.toUpperCase() === needle);
    setResult(found || 'not-found');
  };

  const manualRefresh = useCallback(async () => {
    if (!user?.email) return;
    setRefreshing(true);
    const list = await fetchOrders(user.email);
    setOrders(list);
    setLastUpdated(new Date());
    const currentId = (result && result !== 'not-found') ? result.id : null;
    if (currentId) {
      const fresh = list.find((o) => o.id === currentId);
      if (fresh) setResult(fresh);
    }
    setTimeout(() => setRefreshing(false), 400);
  }, [user?.email, result]);

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
  const currentStatus = (order?.status || '').toLowerCase();
  const stageIndex = order
    ? Math.max(0, STAGES.findIndex((s) => s.key === currentStatus))
    : -1;
  const isCancelled = ['cancelled', 'refused', 'returned', 'refunded'].includes(currentStatus);

  return (
    <AccountShell user={user}>
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-bold mb-2">Track Order</h1>
          <p className="text-text-secondary text-sm">Enter your order ID to see live status.</p>
        </div>
        <button
          onClick={manualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border-2 border-border hover:border-brand-accent hover:text-brand-accent transition"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {lastUpdated && (
        <p className="text-[11px] text-text-secondary mb-6">
          Auto-updates every 5s · Last checked: {lastUpdated.toLocaleTimeString('en-PK')}
        </p>
      )}

      <form onSubmit={handleTrack} className="flex gap-3 mb-6">
        <input
          id="track-id"
          name="orderId"
          value={id}
          onChange={(e) => setId(e.target.value.toUpperCase())}
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
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <div>
              <div className="font-bold text-lg">{order.id}</div>
              <div className="text-xs text-text-secondary">Total: Rs {order.total.toLocaleString()}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
              currentStatus === 'delivered'         ? 'bg-green-100 text-green-700' :
              currentStatus === 'cancelled'         ? 'bg-red-100 text-red-700' :
              currentStatus === 'refused'           ? 'bg-orange-100 text-orange-700' :
              currentStatus === 'returned'          ? 'bg-blue-100 text-blue-700' :
              currentStatus === 'refunded'          ? 'bg-purple-100 text-purple-700' :
              currentStatus === 'placed'            ? 'bg-yellow-100 text-yellow-700' :
              currentStatus === 'processing'        ? 'bg-orange-100 text-orange-700' :
              currentStatus === 'confirmed'         ? 'bg-teal-100 text-teal-700' :
              currentStatus === 'shipped'           ? 'bg-blue-100 text-blue-700' :
              currentStatus === 'out_for_delivery'  ? 'bg-indigo-100 text-indigo-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {currentStatus.replace(/_/g, ' ')}
            </span>
          </div>

          {isCancelled ? (
            <div className="text-center py-6 bg-red-50 rounded-xl">
              <XCircle size={40} className="mx-auto text-red-500 mb-3" />
              <div className="font-bold text-red-700 capitalize">Order {currentStatus.replace(/_/g, ' ')}</div>
              <p className="text-xs text-text-secondary mt-1">This order is no longer active</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-text-secondary mb-2">
                {STAGES.map((s, i) => (
                  <span key={s.key} className={`text-center flex-1 ${i <= stageIndex ? 'text-brand-accent' : ''}`}>
                    {s.label}
                  </span>
                ))}
              </div>
              <div className="h-2 bg-brand-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent transition-all duration-500"
                  style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="bg-white border border-border rounded-2xl p-6">
        <h3 className="font-bold mb-5 flex items-center gap-2">
          <Truck className="text-brand-accent" size={18} />
          Tracking stages
        </h3>

        <ol className="space-y-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isCurrent = order && i === stageIndex;
            const isDone = order && i < stageIndex;

            return (
              <li
                key={s.key}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isCurrent
                    ? 'bg-brand-accent/10 border-2 border-brand-accent'
                    : isDone
                    ? 'bg-green-50/60 border-2 border-transparent'
                    : 'border-2 border-transparent'
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isCurrent ? 'bg-brand-accent text-white'
                    : isDone ? 'bg-green-500 text-white'
                    : 'bg-brand-secondary text-text-secondary'
                }`}>
                  {isDone ? <Check size={16} /> : <Icon size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-sm ${
                    isCurrent ? 'text-brand-accent' : isDone ? 'text-green-700' : 'text-text-primary'
                  }`}>
                    {s.label}
                  </div>
                  {isCurrent && (
                    <div className="text-[11px] text-brand-accent font-semibold mt-0.5">← Current status</div>
                  )}
                  {isDone && (
                    <div className="text-[11px] text-green-600 mt-0.5">Completed</div>
                  )}
                </div>

                {isCurrent && <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />}
              </li>
            );
          })}
        </ol>

        {order && isCancelled && (
          <div className="mt-5 flex items-center gap-3 p-3 rounded-xl bg-red-50 border-2 border-red-200">
            <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
              <XCircle size={16} />
            </div>
            <div>
              <div className="font-semibold text-sm text-red-700 capitalize">
                {currentStatus.replace(/_/g, ' ')}
              </div>
              <div className="text-[11px] text-red-600 mt-0.5">This order is no longer active</div>
            </div>
          </div>
        )}
      </div>
    </AccountShell>
  );
}
