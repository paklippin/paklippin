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

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        const json = await res.json();
        setOrders(Array.isArray(json.orders) ? json.orders : []);
      } catch {}
      setLoading(false);
    })();
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/orders', { cache: 'no-store' });
        const json = await res.json();
        setOrders(Array.isArray(json.orders) ? json.orders : []);
      } catch {}
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const todaysOrders = orders.filter((o) => o.date && new Date(o.date) >= today);
  const pending = orders.filter((o) => (o.status || '').toLowerCase() === 'processing').length;

  // Top products by quantity sold
  const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
  orders.forEach((o) => {
    o.items?.forEach((i) => {
      const key = i.name;
      const cur = productMap.get(key) || { name: i.name, quantity: 0, revenue: 0 };
      cur.quantity += i.quantity;
      cur.revenue += i.price * i.quantity;
      productMap.set(key, cur);
    });
  });
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

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
          {/* STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} />
            <StatCard icon={DollarSign}  label="Total Revenue" value={`Rs ${totalRevenue.toLocaleString()}`} />
            <StatCard icon={TrendingUp}  label="Orders Today" value={todaysOrders.length} />
            <StatCard icon={Clock}       label="Pending" value={pending} />
          </div>

          {/* TWO COLUMN: Recent Orders + Top Products */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
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
                  {recent.map((o) => (
                    <div key={o.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">{o.id}</div>
                        <div className="text-xs text-text-secondary truncate">
                          {o.customer?.name || '—'} · {o.items?.length || 0} item{(o.items?.length || 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="text-right shrink-0 pl-3">
                        <div className="font-bold text-brand-accent text-sm">Rs {(o.total || 0).toLocaleString()}</div>
                        <div className={`text-[10px] uppercase font-semibold ${
                          o.status === 'delivered' ? 'text-green-600' :
                          o.status === 'shipped' ? 'text-blue-600' :
                          o.status === 'cancelled' ? 'text-red-500' :
                          'text-orange-600'
                        }`}>{o.status || 'processing'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Products */}
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

          {/* QUICK LINKS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickLink href="/admin/orders"   label="Manage Orders"   icon={ShoppingBag} />
            <QuickLink href="/admin/products" label="Add Products"    icon={ShoppingBag} />
            <QuickLink href="/admin/media"    label="Media Library"   icon={ShoppingBag} />
            <QuickLink href="/admin/coupons"  label="Discount Codes"  icon={ShoppingBag} />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-brand-accent" />
        <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">{label}</div>
      </div>
      <div className="text-2xl font-bold text-brand-accent">{value}</div>
    </div>
  );
}

function QuickLink({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
  return (
    <Link href={href} className="flex items-center gap-2 bg-white border border-border rounded-xl p-4 hover:border-brand-accent hover:text-brand-accent transition text-sm font-medium">
      <Icon size={16} /> {label}
    </Link>
  );
}
