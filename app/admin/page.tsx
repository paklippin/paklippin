'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, DollarSign, Clock, CheckCheck, Users, Calendar,
  TrendingUp, ArrowRight, RefreshCw, Award,
} from 'lucide-react';

type Order = {
  id: string;
  date?: string;
  status?: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customer?: { name?: string; email?: string; phone?: string; city?: string };
};

type Product = { id: number; name: string; category: string; price: number };

const NON_REVENUE = ['cancelled', 'refunded', 'refused', 'returned'];
const isRevenue = (o: Order) => !NON_REVENUE.includes((o.status || '').toLowerCase());

const STATUS_LIST = [
  { key: 'placed',           label: 'Placed',           color: '#eab308' },
  { key: 'processing',       label: 'Processing',       color: '#FF6B35' },
  { key: 'confirmed',        label: 'Confirmed',        color: '#14b8a6' },
  { key: 'shipped',          label: 'Shipped',          color: '#3b82f6' },
  { key: 'out_for_delivery', label: 'Out for Delivery', color: '#6366f1' },
  { key: 'delivered',        label: 'Delivered',        color: '#10b981' },
  { key: 'refused',          label: 'Refused',          color: '#f97316' },
  { key: 'cancelled',        label: 'Cancelled',        color: '#ef4444' },
];

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [oRes, pRes, uRes] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/admin/products', { cache: 'no-store' }),
        fetch('/api/admin/users', { cache: 'no-store' }),
      ]);
      const oJson = await oRes.json();
      const pJson = await pRes.json();
      const uJson = await uRes.json();
      setOrders(Array.isArray(oJson.orders) ? oJson.orders : []);
      setProducts(Array.isArray(pJson.products) ? pJson.products : []);
      setUsersCount(Array.isArray(uJson.users) ? uJson.users.length : 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  const manualRefresh = async () => {
    setRefreshing(true);
    await load();
    setTimeout(() => setRefreshing(false), 400);
  };

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const revenueOrders = orders.filter(isRevenue);
    const totalRevenue = revenueOrders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter((o) => (o.status || '').toLowerCase() === 'processing').length;
    const delivered = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;
    const todaysOrders = orders.filter((o) => o.date && new Date(o.date) >= today);
    return {
      totalOrders: orders.length,
      totalRevenue,
      pending,
      delivered,
      customers: usersCount,
      todaysOrders: todaysOrders.length,
    };
  }, [orders, usersCount]);

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    STATUS_LIST.forEach((s) => { map[s.key] = 0; });
    orders.forEach((o) => {
      const s = (o.status || 'processing').toLowerCase();
      if (map[s] !== undefined) map[s]++;
    });
    return STATUS_LIST.map((s) => ({ ...s, count: map[s.key] }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { qty: number; revenue: number }> = {};
    orders.filter(isRevenue).forEach((o) => {
      (o.items || []).forEach((i) => {
        const cur = map[i.name] || { qty: 0, revenue: 0 };
        cur.qty += i.quantity;
        cur.revenue += i.price * i.quantity;
        map[i.name] = cur;
      });
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  const sevenDays = useMemo(() => {
    const days: { label: string; date: Date; revenue: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i); d.setHours(0, 0, 0, 0);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      const dayOrders = orders.filter(isRevenue).filter((o) => {
        if (!o.date) return false;
        const t = new Date(o.date).getTime();
        return t >= d.getTime() && t < next.getTime();
      });
      days.push({
        label: d.toLocaleDateString('en-PK', { weekday: 'short' }),
        date: d,
        revenue: dayOrders.reduce((s, o) => s + (o.total || 0), 0),
        count: dayOrders.length,
      });
    }
    return days;
  }, [orders]);

  const categoryRevenue = useMemo(() => {
    const nameToCat: Record<string, string> = {};
    products.forEach((p) => { nameToCat[p.name] = p.category || 'Other'; });
    const map: Record<string, number> = {};
    orders.filter(isRevenue).forEach((o) => {
      (o.items || []).forEach((i) => {
        const cat = nameToCat[i.name] || 'Other';
        map[cat] = (map[cat] || 0) + i.price * i.quantity;
      });
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [orders, products]);

  const recent = useMemo(() => {
    return [...orders].sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    }).slice(0, 6);
  }, [orders]);

  if (loading) {
    return <div className="text-center py-16 text-text-secondary text-sm">Loading dashboard...</div>;
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-sm text-text-secondary">Overview of your store performance</p>
        </div>
        <button
          onClick={manualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-border hover:border-brand-accent hover:text-brand-accent transition text-sm font-semibold"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders"   value={stats.totalOrders}              color="#FF6B35" />
        <StatCard icon={DollarSign}  label="Total Revenue"  value={`PKR ${stats.totalRevenue.toLocaleString()}`} color="#ea580c" />
        <StatCard icon={Clock}       label="Pending"        value={stats.pending}                  color="#f59e0b" />
        <StatCard icon={CheckCheck}  label="Delivered"      value={stats.delivered}                color="#10b981" />
        <StatCard icon={Users}       label="Customers"      value={stats.customers}                color="#e11d48" />
        <StatCard icon={Calendar}    label="Today's Orders" value={stats.todaysOrders}             color="#06b6d4" />
      </div>

      {/* Orders by Status + Top Selling */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6">
          <ChartHeader icon={TrendingUp} title="Orders by Status" subtitle="Current order pipeline" />
          <OrdersByStatus data={statusCounts} />
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <ChartHeader icon={Award} title="Top Selling Products" subtitle="All-time best performers" />
          <TopSelling data={topProducts} />
        </div>
      </div>

      {/* Revenue trend + Category donut */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-2xl p-6">
          <ChartHeader icon={TrendingUp} title="Revenue — Last 7 Days" subtitle="Daily revenue trend" />
          <RevenueTrend data={sevenDays} />
        </div>
        <div className="bg-white border border-border rounded-2xl p-6">
          <ChartHeader icon={DollarSign} title="Revenue by Category" subtitle="Top performing categories" />
          <CategoryDonut data={categoryRevenue} />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <p className="text-xs text-text-secondary mt-0.5">Latest customer activity</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-brand-accent hover:underline flex items-center gap-1 font-semibold">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-8">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-text-secondary border-b border-border">
                  <th className="py-2 pr-4 font-bold">Order</th>
                  <th className="py-2 pr-4 font-bold">Customer</th>
                  <th className="py-2 pr-4 font-bold">Total</th>
                  <th className="py-2 pr-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => {
                  const s = (o.status || 'processing').toLowerCase();
                  const meta = STATUS_LIST.find((x) => x.key === s);
                  return (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="py-3 pr-4">
                        <Link href="/admin/orders" className="font-semibold text-text-primary hover:text-brand-accent">
                          {o.id}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-text-secondary">
                        {o.customer?.name || o.customer?.email || '—'}
                      </td>
                      <td className="py-3 pr-4 font-bold text-brand-accent">
                        PKR {(o.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="text-[10px] font-bold uppercase px-2 py-1 rounded-full"
                          style={{ background: (meta?.color || '#FF6B35') + '22', color: meta?.color || '#FF6B35' }}
                        >
                          {meta?.label || s}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Sub-components ============

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white"
        style={{ background: color }}
      >
        <Icon size={22} />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">{label}</div>
    </div>
  );
}

function ChartHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-brand-secondary flex items-center justify-center shrink-0">
        <Icon size={14} className="text-text-primary" />
      </div>
      <div>
        <div className="font-bold text-base">{title}</div>
        <div className="text-xs text-text-secondary mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function OrdersByStatus({ data }: { data: { key: string; label: string; color: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const height = 180;
  const barWidth = 60;
  const gap = (100 - barWidth) / Math.max(data.length - 1, 1);

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 800 230" className="w-full h-[230px]" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="40" x2="800" y1={200 - height * p} y2={200 - height * p}
            stroke="#f0f0f0" strokeWidth="1"
          />
        ))}
        {/* Y-axis labels */}
        {[0, 0.5, 1].map((p) => (
          <text key={p} x="30" y={205 - height * p} textAnchor="end" fontSize="11" fill="#999">
            {Math.round(max * p)}
          </text>
        ))}
        {/* Bars */}
        {data.map((d, i) => {
          const x = 60 + i * ((740) / data.length);
          const barH = (d.count / max) * height;
          return (
            <g key={d.key}>
              <rect
                x={x}
                y={200 - barH}
                width={(740 / data.length) - 15}
                height={Math.max(barH, 2)}
                fill={d.count > 0 ? d.color : '#f0f0f0'}
                rx="4"
              />
              <text
                x={x + (740 / data.length - 15) / 2}
                y={200 - barH - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="bold"
                fill={d.color}
              >
                {d.count > 0 ? d.count : ''}
              </text>
              <text
                x={x + (740 / data.length - 15) / 2}
                y="220"
                textAnchor="middle"
                fontSize="10"
                fill="#666"
              >
                {d.label.length > 10 ? d.label.slice(0, 9) + '…' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TopSelling({ data }: { data: { name: string; qty: number; revenue: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-text-secondary text-center py-8">No sales yet.</p>;
  }
  const max = Math.max(...data.map((d) => d.qty), 1);
  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const pct = (d.qty / max) * 100;
        return (
          <div key={d.name}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium truncate pr-2">{d.name}</span>
              <span className="font-bold text-text-secondary shrink-0">{d.qty}</span>
            </div>
            <div className="h-6 bg-brand-secondary rounded-md overflow-hidden">
              <div
                className="h-full rounded-md transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: i === 0 ? '#fbbf24' : i === 1 ? '#f59e0b' : '#FF6B35',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RevenueTrend({ data }: { data: { label: string; revenue: number; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const W = 800, H = 200, padL = 50, padR = 20, padT = 20, padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const stepX = innerW / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => ({
    x: padL + i * stepX,
    y: padT + innerH - (d.revenue / max) * innerH,
    ...d,
  }));

  // Smooth curve path (Catmull-Rom-ish approximation using quadratic)
  let path = '';
  points.forEach((p, i) => {
    if (i === 0) path += `M ${p.x} ${p.y}`;
    else {
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      path += ` Q ${cx} ${prev.y} ${cx} ${(prev.y + p.y) / 2}`;
      path += ` Q ${cx} ${p.y} ${p.x} ${p.y}`;
    }
  });

  const areaPath = `${path} L ${points[points.length - 1].x} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[220px]" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0, 0.5, 1].map((p) => (
        <line
          key={p}
          x1={padL} x2={W - padR}
          y1={padT + innerH - innerH * p}
          y2={padT + innerH - innerH * p}
          stroke="#f0f0f0"
        />
      ))}
      {/* Y labels */}
      {[0, 0.5, 1].map((p) => (
        <text key={p} x={padL - 8} y={padT + innerH - innerH * p + 4} textAnchor="end" fontSize="10" fill="#999">
          {Math.round(max * p).toLocaleString()}
        </text>
      ))}
      {/* Area + line */}
      <path d={areaPath} fill="url(#revGrad)" />
      <path d={path} fill="none" stroke="#10b981" strokeWidth="2.5" />
      {/* Points + x labels */}
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="4" fill="#10b981" />
          <text x={p.x} y={H - 8} textAnchor="middle" fontSize="11" fill="#666">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

function CategoryDonut({ data }: { data: { name: string; value: number }[] }) {
  if (data.length === 0 || data.every((d) => d.value === 0)) {
    return <p className="text-sm text-text-secondary text-center py-8">No revenue yet.</p>;
  }
  const total = data.reduce((s, d) => s + d.value, 0);
  const COLORS = ['#FF6B35', '#10b981', '#3b82f6', '#fbbf24', '#a855f7', '#ef4444'];
  const radius = 70, strokeWidth = 32, cx = 100, cy = 100;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;
  const segments = data.slice(0, 6).map((d, i) => {
    const fraction = d.value / total;
    const dashLength = fraction * circumference;
    const seg = {
      ...d,
      dashLength,
      offset: -cumulative,
      color: COLORS[i % COLORS.length],
    };
    cumulative += dashLength;
    return seg;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg viewBox="0 0 200 200" className="w-[180px] h-[180px]">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${s.dashLength} ${circumference}`}
              strokeDashoffset={s.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          ))}
        </svg>
      </div>
      <div className="w-full mt-4 space-y-1.5">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-3 rounded" style={{ background: s.color }} />
              <span className="truncate">{s.name}</span>
            </div>
            <span className="font-bold shrink-0">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
