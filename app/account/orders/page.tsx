'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { readUser, fetchOrders, type Order, type StoredUser } from '@/lib/user';

export default function OrdersPage() {
  const [user, setUser]     = useState<StoredUser>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = readUser();
    setUser(u);
    if (!u?.email) { setLoading(false); return; }
    let alive = true;
    const load = () => fetchOrders(u.email).then((list) => { if (alive) { setOrders(list); setLoading(false); } });
    load();
    const id = setInterval(load, 5000);
    return () => { alive = false; clearInterval(id); };
  }, []);

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

  return (
    <AccountShell user={user}>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {loading ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center text-text-secondary text-sm">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-bold text-xl mb-2">No orders yet</h2>
          <p className="text-text-secondary mb-6">Your order history will appear here.</p>
          <Link href="/" className="inline-block bg-brand-accent text-white font-semibold px-8 py-3 rounded-full hover:bg-[#e55a2b] transition">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-border rounded-2xl p-5 hover:shadow-hover transition">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-semibold text-base">{o.id}</div>
                  {o.date && (
                    <div className="text-xs text-text-secondary">
                      {new Date(o.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  (o.status || '').toLowerCase() === 'delivered' ? 'bg-green-100 text-green-700' :
                  (o.status || '').toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-700' :
                  (o.status || '').toLowerCase() === 'shipped'   ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {(o.status || 'processing').toUpperCase()}
                </span>
              </div>
              {o.items.length > 0 && (
                <div className="text-sm text-text-secondary mb-3 space-y-1">
                  {o.items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span>Rs {(it.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <span className="text-sm text-text-secondary">Total:</span>
                <span className="font-bold text-brand-accent">Rs {o.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
