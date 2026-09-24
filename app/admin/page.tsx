'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, DollarSign, Clock, TrendingUp, ArrowRight } from 'lucide-react';

type Order = {
  id: string;
  date?: string;
  status?: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customer?: { name?: string; email?: string; phone?: string; city?: string };
};

const NON_REVENUE = ['cancelled', 'refunded'];
const isRevenue = (o: Order) => !NON_REVENUE.includes((o.status || '').toLowerCase());

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const json = await res.json();
      setOrders(Array.isArray(json.orders) ? json.orders : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  const today = new Date(); today.setHours(0,0,0,0);
  const totalOrders = orders.length;
  const revenueOrders = orders.filter(isRevenue);
  const totalRevenue = revenueOrders.reduce((s, o) => s + (o.total || 0), 0);
  const todaysOrders = orders.filter((o) => o.date && new Date(o.date) >= today);
  const pending = orders.filter((o) => (o.status || '').toLowerCase() === 'processing').length;
  const cancelled = orders.filter((o) => NON_REVENUE.includes((o.status || '').toLowerCase())).length;

  // Top products
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  revenueOrders.forEach((o) => {
    o.items?.forEach((i) => {
      const cur = productMap.get(i.name) || { name: i.name, quantity: 0, revenue: 0 };
      cur.quantity += i.quantity;
      cur.revenue += i.price * i.quantity;
      productMap.set(i.name, cur);
    });
  });
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

  // Last 7 days chart
  const days: { label: string; count: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const next = new Date(d); next.setDate(next.getDate() + 1);

    const dayOrders = revenueOrders.filter((o) => {
      if (!o.date) return false;
      const t = new Date(o.date).getTime();
      return t >= d.getTime() && t < next.getTime();
    });

    days.push({
      label: d.toLocaleDateString('en-PK', { weekday: 'short' }),
      count: dayOrders.length,
      revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
    });
  }
  const maxRevenue = Math.max(...days.map((d) => d.revenue), 1);

  const recent = [...orders].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  }).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-text-secondary">Overview of your store</p>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading stats...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} />
            <StatCard icon={DollarSign}  label="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} hint="Excludes cancelled" />
            <StatCard icon={TrendingUp}  label="Orders Today" value={todaysOrders.length} />
            <StatCard icon={Clock}       label="Pending" value={pending} />
          </div>

          {cancelled > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6 text-sm text-red-700 flex items-center gap-2">
              <span>⚠️</span>
              <span><strong>{cancelled}</strong> cancelled/refunded order{cancelled !== 1 ? 's' : ''} — not counted in revenue</span>
            </div>
          )}

          {/* 7-day chart */}
          <div className="bg-white border border-border rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Last 7 Days</h2>
              <span className="text-xs text-text-secondary">Revenue per day</span>
            </div>
            <div className="flex items-end gap-2 h-[180px]">
              {days.map((d, i) => {
                const pct = (d.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[10px] font-bold text-brand-accent h-4">
                      {d.revenue > 0 ? `Rs ${(d.revenue / 1000).toFixed(0)}k` : ''}
                    </div>
                    <div className="w-full bg-brand-secondary rounded-t-lg flex items-end" style={{ height: '140px' }}>
                      <div
                        className="w-full bg-brand-accent rounded-t-lg transition-all duration-500 hover:bg-[#e55a2b]"
                        style={{ height: `${Math.max(pct, 2)}%` }}
                        title={`Rs ${d.revenue.toLocaleString()} · ${d.count} order(s)`}
                      />
                    </div>
                    <div className="text-[10px] font-semibold text-text-secondary">{d.label}</div>
                    <div className="text-[9px] text-text-secondary">{d.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-border rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-bold text-lg">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-brand-accent hover:underline flex items-center gap-1">
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-sm text-text-secondary">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {recent.map((o) => {
                    const c = !isRevenue(o);
                    return (
                      <div key={o.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div className="min-w-0">
                          <div className="font-semibold text-sm truncate">{o.id}</div>
                          <div className="text-xs text-text-secondary truncate">
                            {o.customer?.name || '—'} · {o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <div className="text-right shrink-0 pl-3">
                          <div className={`font-bold text-sm ${c ? 'text-text-secondary line-through' : 'text-brand-accent'}`}>
                            Rs {(o.total || 0).toLocaleString()}
                          </div>
                          <div className={`text-[10px] uppercase font-semibold ${
                            o.status === 'delivered' ? 'text-green-600' :
                            o.status === 'shipped' ? 'text-blue-600' :
                            o.status === 'cancelled' ? 'text-red-500' :
                            'text-orange-600'
                          }`}>{o.status || 'processing'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-5">Top Products</h2>
              {topProducts.length === 0 ? (
                <p className="text-sm text-text-secondary">No sales yet.</p>
              ) : (
                <div className="space-y-3">
                  {topProducts.map((p) => (
                    <div key={p.name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{p.name}</div>
                        <div className="text-xs text-text-secondary">{p.quantity} sold</div>
                      </div>
                      <div className="text-right font-bold text-brand-accent text-sm shrink-0 pl-3">
                        Rs {p.revenue.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, hint }: { icon: any; label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-brand-accent" />
        <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">{label}</div>
      </div>
      <div className="text-2xl font-bold text-brand-accent">{value}</div>
      {hint && <div className="text-[10px] text-text-secondary mt-1">{hint}</div>}
    </div>
  );
}
