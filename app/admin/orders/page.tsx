'use client';
import { useEffect, useState } from 'react';
import { Printer, Package, Search, X, Check, Truck, XCircle, Clock, CheckCheck, Send as SendIcon, Loader2, MapPin } from 'lucide-react';
import OrderQR, { type QROrder } from '@/components/admin/OrderQR';
import { updateOrderStatus, deleteOrder } from '@/lib/user';

const STATUSES = [
  { value: 'placed',            label: 'Placed',           color: 'bg-yellow-100 text-yellow-700',  icon: Package },
  { value: 'processing',        label: 'Processing',       color: 'bg-orange-100 text-orange-700',  icon: Clock },
  { value: 'confirmed',         label: 'Confirmed',        color: 'bg-teal-100 text-teal-700',      icon: CheckCheck },
  { value: 'shipped',           label: 'Shipped',          color: 'bg-blue-100 text-blue-700',      icon: Truck },
  { value: 'out_for_delivery',  label: 'Out for Delivery', color: 'bg-indigo-100 text-indigo-700',  icon: MapPin },
  { value: 'delivered',         label: 'Delivered',        color: 'bg-green-100 text-green-700',    icon: Check },
  { value: 'cancelled',         label: 'Cancelled',        color: 'bg-red-100 text-red-700',        icon: XCircle },
];

const NOTE_OPTIONAL = ['placed', 'processing', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<QROrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeQR, setActiveQR] = useState<QROrder | null>(null);
  const [noteOpen, setNoteOpen] = useState<{ orderId: string; status: string } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteBusy, setNoteBusy] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders', { cache: 'no-store' });
      const json = await res.json();
      const list = Array.isArray(json.orders) ? json.orders : [];
      setOrders(list.map((o: any) => ({
        id: String(o.id ?? ''),
        date: o.date,
        status: o.status ?? 'processing',
        total: Number(o.total ?? 0),
        items: Array.isArray(o.items) ? o.items : [],
        customer: o.customer,
        payment: o.payment,
        notes: Array.isArray(o.notes) ? o.notes : [],
      })));
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    const id = setInterval(loadOrders, 8000);
    return () => clearInterval(id);
  }, []);

  const openNoteDialog = (orderId: string, status: string) => {
    setNoteOpen({ orderId, status });
    setNoteText('');
  };

  const submitStatus = async () => {
    if (!noteOpen) return;
    const needsNote = !NOTE_OPTIONAL.includes(noteOpen.status);
    if (needsNote && !noteText.trim()) {
      alert('Please add a reason for this status change');
      return;
    }
    setNoteBusy(true);
    setOrders((prev) =>
      prev.map((o) => o.id === noteOpen.orderId
        ? {
            ...o,
            status: noteOpen.status,
            notes: noteText.trim()
              ? [...(o.notes || []), {
                  text: noteText.trim(),
                  status: noteOpen.status,
                  by: 'admin',
                  at: new Date().toISOString(),
                }]
              : o.notes,
          }
        : o)
    );
    await updateOrderStatus(noteOpen.orderId, noteOpen.status, noteText.trim(), 'admin');
    setNoteBusy(false);
    setNoteOpen(null);
    setNoteText('');
    setTimeout(loadOrders, 400);
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
      <style>body{font-family:system-ui;padding:30px;max-width:500px;margin:auto}
      h1{font-size:22px;margin-bottom:12px;color:#FF6B35}
      pre{background:#F8F9FA;padding:14px;border-radius:8px;font-size:13px;white-space:pre-wrap}
      .qr{text-align:center;margin:20px 0}</style></head><body>
      <h1>PAKLIPPIN — Delivery Slip</h1>
      <div class="qr">${svgHTML}</div>
      <pre>Order: ${order.id}
Name: ${order.customer?.name || '—'}
Phone: ${order.customer?.phone || '—'}
Address: ${order.customer?.address || '—'}, ${order.customer?.city || ''}
Items: ${order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
Total: Rs ${order.total.toLocaleString()}</pre>
      <script>window.onload=()=>setTimeout(()=>window.print(),300)</script>
      </body></html>`);
    win.document.close();
  };

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false;
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return o.id.toLowerCase().includes(s) ||
      (o.customer?.name || '').toLowerCase().includes(s) ||
      (o.customer?.phone || '').toLowerCase().includes(s);
  });

  const counts: Record<string, number> = {
    all: orders.length,
    placed:           orders.filter((o) => o.status === 'placed').length,
    processing:       orders.filter((o) => o.status === 'processing').length,
    confirmed:        orders.filter((o) => o.status === 'confirmed').length,
    shipped:          orders.filter((o) => o.status === 'shipped').length,
    out_for_delivery: orders.filter((o) => o.status === 'out_for_delivery').length,
    delivered:        orders.filter((o) => o.status === 'delivered').length,
    cancelled:        orders.filter((o) => o.status === 'cancelled').length,
  };

  const FILTERS: [string, string][] = [
    ['all', 'All'],
    ['placed', 'Placed'],
    ['processing', 'Processing'],
    ['confirmed', 'Confirmed'],
    ['shipped', 'Shipped'],
    ['out_for_delivery', 'Out for Delivery'],
    ['delivered', 'Delivered'],
    ['cancelled', 'Cancelled'],
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Orders</h1>
        <p className="text-sm text-text-secondary">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map(([k, l]) => (
          <button key={k} onClick={() => setFilterStatus(k)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold transition ${
              filterStatus === k ? 'bg-brand-accent text-white'
                : 'bg-white border-2 border-border text-text-secondary hover:border-brand-accent hover:text-brand-accent'
            }`}>
            {l} ({counts[k] ?? 0})
          </button>
        ))}
      </div>

      <div className="relative max-w-[400px] mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, name, or phone..."
          className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-border focus:border-brand-accent outline-none text-sm" />
      </div>

      {loading && <p className="text-text-secondary text-sm">Loading orders...</p>}

      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text-secondary mb-2">No orders found.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((o) => {
          const meta = STATUSES.find((s) => s.value === o.status) || STATUSES[1];
          const notes = (o as any).notes || [];
          return (
            <div key={o.id} className="bg-white border border-border rounded-2xl p-5 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="font-bold text-lg">{o.id}</div>
                  {o.date && <div className="text-xs text-text-secondary">{new Date(o.date).toLocaleString('en-PK')}</div>}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${meta.color}`}>{meta.label}</span>
              </div>

              <div className="flex gap-4 mb-4">
                <div id={`qr-${o.id}`} onClick={() => setActiveQR(o)} className="cursor-pointer shrink-0">
                  <OrderQR order={o} size={120} />
                </div>
                <div className="flex-1 text-xs space-y-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{o.customer?.name || '—'}</div>
                  <div className="text-text-secondary">📞 {o.customer?.phone || '—'}</div>
                  <div className="text-text-secondary line-clamp-2">📍 {o.customer?.address || '—'}{o.customer?.city ? `, ${o.customer.city}` : ''}</div>
                  <div className="text-text-secondary truncate">📦 {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ') || '—'}</div>
                  <div className="text-brand-accent font-bold pt-1">Rs {o.total.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 mb-3">
                {STATUSES.map((s) => {
                  const Icon = s.icon;
                  const active = o.status === s.value;
                  return (
                    <button
                      key={s.value}
                      onClick={() => openNoteDialog(o.id, s.value)}
                      className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[9px] font-semibold transition leading-tight ${
                        active ? s.color + ' ring-2 ring-offset-1 ring-current'
                          : 'bg-brand-secondary text-text-secondary hover:bg-brand-accent hover:text-white'
                      }`}
                    >
                      <Icon size={12} />
                      <span className="text-center">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {notes.length > 0 && (
                <div className="pt-3 mb-3 border-t border-border">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary mb-2">
                    Activity ({notes.length})
                  </div>
                  <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {notes.slice(-3).map((n: any, i: number) => (
                      <div key={i} className="flex gap-2 text-[11px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold uppercase text-[9px] text-brand-accent">{n.status}</span>
                            <span className="text-text-secondary text-[9px]">{new Date(n.at).toLocaleString('en-PK')}</span>
                            {n.by && <span className="text-text-secondary text-[9px]">· {n.by}</span>}
                          </div>
                          <div className="text-text-primary truncate">{n.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-auto pt-3 border-t border-border">
                <button onClick={() => setActiveQR(o)}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg border-2 border-border hover:border-brand-accent hover:text-brand-accent transition">
                  Show QR
                </button>
                <button onClick={() => handlePrint(o)}
                  className="flex-1 text-xs font-semibold py-2 rounded-lg bg-brand-accent text-white hover:bg-[#e55a2b] transition flex items-center justify-center gap-1">
                  <Printer size={13} /> Print
                </button>
                <button onClick={() => handleDelete(o.id)}
                  className="text-xs font-semibold px-3 py-2 rounded-lg border-2 border-border text-red-500 hover:border-red-500 transition"
                  title="Delete">
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {noteOpen && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-center justify-center p-4" onClick={() => setNoteOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-[440px] w-full p-6 relative">
            <button onClick={() => setNoteOpen(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center">
              <X size={16} />
            </button>
            {(() => {
              const s = STATUSES.find((x) => x.value === noteOpen.status) || STATUSES[0];
              const Icon = s.icon;
              const required = !NOTE_OPTIONAL.includes(noteOpen.status);
              return (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={18} className="text-brand-accent" />
                    <h3 className="font-bold text-lg">Change to {s.label}</h3>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">
                    Order <strong>{noteOpen.orderId}</strong>
                    {required && ' · Reason required'}
                  </p>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Note {required ? '*' : '(optional)'}
                  </label>
                  <textarea
                    id="admin-order-note"
                    name="orderNote"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder={
                      noteOpen.status === 'cancelled' ? 'e.g. Customer requested cancellation' :
                      noteOpen.status === 'shipped' ? 'e.g. Shipped via TCS, tracking #ABC123' :
                      noteOpen.status === 'out_for_delivery' ? 'e.g. Rider on the way' :
                      noteOpen.status === 'delivered' ? 'e.g. Delivered successfully' :
                      'Add a note (optional)'
                    }
                    rows={3}
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm resize-none"
                  />

                  {noteOpen.status === 'cancelled' && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Customer requested', 'Out of stock', 'Payment not verified', 'Duplicate order', 'Address issue'].map((r) => (
                        <button key={r} type="button" onClick={() => setNoteText(r)}
                          className="text-[10px] px-2.5 py-1 rounded-full border border-border hover:border-brand-accent hover:text-brand-accent transition">
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  {noteOpen.status === 'out_for_delivery' && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['Rider dispatched', 'Reaching soon', 'Attempting delivery'].map((r) => (
                        <button key={r} type="button" onClick={() => setNoteText(r)}
                          className="text-[10px] px-2.5 py-1 rounded-full border border-border hover:border-brand-accent hover:text-brand-accent transition">
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setNoteOpen(null)}
                      className="flex-1 py-2.5 rounded-lg border-2 border-border font-semibold text-sm hover:border-brand-accent transition">
                      Cancel
                    </button>
                    <button onClick={submitStatus} disabled={noteBusy}
                      className="flex-1 py-2.5 rounded-lg bg-brand-accent text-white font-semibold text-sm hover:bg-[#e55a2b] transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                      {noteBusy ? <><Loader2 size={13} className="animate-spin" /> Saving...</> : <><SendIcon size={13} /> Confirm</>}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {activeQR && (
        <div className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4" onClick={() => setActiveQR(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl p-8 max-w-[500px] w-full text-center relative">
            <button onClick={() => setActiveQR(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center">
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
            </div>
            <button onClick={() => handlePrint(activeQR)}
              className="mt-5 w-full py-3 bg-brand-accent text-white font-semibold rounded-xl hover:bg-[#e55a2b] transition flex items-center justify-center gap-2">
              <Printer size={16} /> Print Delivery Slip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
