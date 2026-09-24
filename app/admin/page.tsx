'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, Printer, Package, Search, X, Check, Truck, XCircle, Clock } from 'lucide-react';
import OrderQR, { type QROrder } from '@/components/admin/OrderQR';
import { updateOrderStatus, deleteOrder } from '@/lib/user';

const ADMIN_PASSWORD = 'P@52545254';
const ADMIN_KEY = 'paklippin_admin_auth';

const STATUSES = [
  { value: 'processing', label: 'Processing', color: 'bg-orange-100 text-orange-700', icon: Clock },
  { value: 'shipped',    label: 'Shipped',    color: 'bg-blue-100 text-blue-700',   icon: Truck },
  { value: 'delivered',  label: 'Delivered',  color: 'bg-green-100 text-green-700', icon: Check },
  { value: 'cancelled',  label: 'Cancelled',  color: 'bg-red-100 text-red-700',     icon: XCircle },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [orders, setOrders] = useState<QROrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeQR, setActiveQR] = useState<QROrder | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(ADMIN_KEY) === '1') {
      setAuthed(true);
    }
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const json = await res.json();
      const list = Array.isArray(json.orders) ? json.orders : [];
      setOrders(list.map((o: any) => ({
        id:     String(o.id ?? ''),
        date:   o.date,
        status: o.status ?? 'processing',
        total:  Number(o.total ?? 0),
        items:  Array.isArray(o.items) ? o.items : [],
        customer: o.customer,
        payment:  o.payment,
      })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (!authed) return;
    loadOrders();
    const id = setInterval(loadOrders, 8000);
    return () => clearInterval(id);
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, '1');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY);
    setAuthed(false);
    setPassword('');
  };

  const handleStatusChange = async (id: string, status: string) => {
    // Instant UI feedback
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    const ok = await updateOrderStatus(id, status);
    if (!ok) {
      // Revert if failed
      loadOrders();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete order ${id}? This cannot be undone.`)) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await deleteOrder(id);
  };

  const handlePrint = (order: QROrder) => {
    const win = window.open('', '_blank');
    if (!win) return;

    const svgEl = document.getElementById(`qr-${order.id}`)?.querySelector('svg');
    const svgHTML = svgEl ? svgEl.outerHTML : '';

    win.document.write(`
      <html><head><title>Order ${order.id}</title>
      <style>
        body { font-family: system-ui; padding: 30px; max-width: 500px; margin: auto; }
        h1 { font-size: 22px; margin-bottom: 12px; color: #FF6B35; }
        pre { background: #F8F9FA; padding: 14px; border-radius: 8px; font-size: 13px; white-space: pre-wrap; }
        .qr { text-align: center; margin: 20px 0; }
      </style>
      </head><body>
      <h1>PAKLIPPIN — Delivery Slip</h1>
      <div class="qr">${svgHTML}</div>
      <pre>Order: ${order.id}
Name: ${order.customer?.name || '—'}
Phone: ${order.customer?.phone || '—'}
Address: ${order.customer?.address || '—'}, ${order.customer?.city || ''}
Items: ${order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
Total: Rs ${order.total.toLocaleString()}</pre>
      <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
      </body></html>
    `);
    win.document.close();
  };

  if (!authed) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-16">
        <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-sm text-text-secondary text-center mb-6">Enter your password to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm"
              autoFocus
            />
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button type="submit" className="w-full py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition">
              Enter
            </button>
          </form>
          <Link href="/" className="block text-center text-xs text-text-secondary hover:text-brand-accent mt-4">
            ← Back to store
          </Link>
        </div>
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(s) ||
      (o.customer?.name || '').toLowerCase().includes(s) ||
      (o.customer?.phone || '').toLowerCase().includes(s)
    );
  });

  const counts = {
    all: orders.length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipped:    orders.filter((o) => o.status === 'shipped').length,
    delivered:  orders.filter((o) => o.status === 'delivered').length,
    cancelled:  orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-10">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin — Orders</h1>
          <p className="text-sm text-text-secondary">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border text-sm font-semibold hover:border-red-500 hover:text-red-500 transition"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[['all', 'All'], ['processing', 'Processing'], ['shipped', 'Shipped'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              filterStatus === key
                ? 'bg-brand-accent text-white'
                : 'bg-white border-2 border-border text-text-secondary hover:border-brand-accent hover:text-brand-accent'
            }`}
          >
            {label} ({(counts as any)[key] ?? 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-[400px] mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, or phone..."
          className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-border focus:border-brand-accent outline-none text-sm"
        />
      </div>

      {loading && <p className="text-text-secondary text-sm">Loading orders...</p>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text-secondary mb-2">No orders found.</p>
          <p className="text-xs text-text-secondary">Place a test order from the storefront to see it here.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((o) => {
          const statusMeta = STATUSES.find((s) => s.value === o.status) || STATUSES[0];
          return (
            <div key={o.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-lg">{o.id}</div>
                  {o.date && (
                    <div className="text-xs text-text-secondary">
                      {new Date(o.date).toLocaleString('en-PK')}
                    </div>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${statusMeta.color}`}>
                  {statusMeta.label}
                </span>
              </div>

              <div className="flex gap-4 mb-4">
                <div id={`qr-${o.id}`} onClick={() => setActiveQR(o)} className="cursor-pointer shrink-0">
                  <OrderQR order={o} size={120} />
                </div>
                <div className="flex-1 text-xs space-y-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{o.customer?.name || '—'}</div>
                  <div className="text-text-secondary">📞 {o.customer?.phone || '—'}</div>
                  <div className="text-text-secondary line-clamp-2">
                    📍 {o.customer?.address || '—'}{o.customer?.city ? `, ${o.customer.city}` : ''}
                  </div>
                  <div className="text-text-secondary truncate">
                    📦 {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ') || '—'}
                  </div>
                  <div className="text-brand-accent font-bold pt-1">Rs {o.total.toLocaleString()}</div>
                </div>
              </div>

              {/* Status buttons */}
              <div className="grid grid-cols-4 gap-1 mb-3">
                {STATUSES.map((s) => {
                  const Icon = s.icon;
                  const active = o.status === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => handleStatusChange(o.id, s.value)}
                      className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg text-[9px] font-semibold transition ${
                        active ? s.color + ' ring-2 ring-offset-1 ring-current' : 'bg-brand-secondary text-text-secondary hover:bg-brand-accent hover:text-white'
                      }`}
                      title={`Mark as ${s.label}`}
                    >
                      <Icon size={12} />
                      {s.label.slice(0, 6)}
                    </button>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                <button
                  onClick={() => setActiveQR(o)}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg border-2 border-border hover:border-brand-accent hover:text-brand-accent transition"
                >
                  Show QR
                </button>
                <button
                  onClick={() => handlePrint(o)}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg bg-brand-accent text-white hover:bg-[#e55a2b] transition flex items-center justify-center gap-1"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  onClick={() => handleDelete(o.id)}
                  className="text-xs font-semibold px-3 py-2 rounded-lg border-2 border-border text-red-500 hover:border-red-500 transition"
                  title="Delete order"
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeQR && (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4" onClick={() => setActiveQR(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-8 max-w-[500px] w-full text-center relative">
            <button onClick={() => setActiveQR(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center" aria-label="Close">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-1">{activeQR.id}</h2>
            <p className="text-sm text-text-secondary mb-5">Scan for delivery details</p>
            <div className="flex justify-center mb-5">
              <OrderQR order={activeQR} size={260} />
            </div>
            <div className="text-left text-sm space-y-1.5 bg-brand-secondary rounded-xl p-4">
              <div><strong>Name:</strong> {activeQR.customer?.name || '—'}</div>
              <div><strong>Phone:</strong> {activeQR.customer?.phone || '—'}</div>
              <div><strong>Address:</strong> {activeQR.customer?.address || '—'}, {activeQR.customer?.city || ''}</div>
              <div><strong>Items:</strong> {activeQR.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}</div>
              <div><strong>Total:</strong> Rs {activeQR.total.toLocaleString()}</div>
              <div><strong>Payment:</strong> {activeQR.payment?.method || 'EasyPaisa'}{activeQR.payment?.txnId ? ` (TID: ${activeQR.payment.txnId})` : ''}</div>
            </div>
            <button
              onClick={() => handlePrint(activeQR)}
              className="mt-5 w-full py-3 bg-brand-accent text-white font-semibold rounded-xl hover:bg-[#e55a2b] transition flex items-center justify-center gap-2"
            >
              <Printer size={16} /> Print Delivery Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
