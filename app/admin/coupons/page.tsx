'use client';
import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Ticket } from 'lucide-react';

type Coupon = {
  id: string; code: string; description: string;
  type: 'percentage' | 'fixed'; value: number;
  minOrder: number; maxUses: number; uses: number;
  expires: string | null; active: boolean;
};

const EMPTY = {
  code: '', description: '', type: 'percentage' as const,
  value: 10, minOrder: 0, maxUses: 0, expires: '', active: true,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons', { cache: 'no-store' });
      const json = await res.json();
      setCoupons(Array.isArray(json.coupons) ? json.coupons : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.code.trim()) { alert('Code required'); return; }
    setSaving(true);
    try {
      await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setCreating(false);
      setForm(EMPTY);
      load();
    } catch { alert('Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' });
    load();
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5';

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Coupons</h1>
          <p className="text-sm text-text-secondary">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setCreating(true); }}
          className="flex items-center gap-2 bg-brand-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#e55a2b] transition text-sm">
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Ticket size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text-secondary">No coupons yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div key={c.code} className="bg-white border-2 border-dashed border-border rounded-2xl p-5 relative">
              <button onClick={() => handleDelete(c.code)}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition">
                <Trash2 size={14} />
              </button>
              <div className="text-2xl font-bold text-brand-accent mb-1 tracking-wider">{c.code}</div>
              <div className="text-xs text-text-secondary mb-3">{c.description || '—'}</div>
              <div className="text-sm font-semibold mb-2">
                {c.type === 'percentage' ? `${c.value}% off` : `Rs ${c.value} off`}
              </div>
              <div className="text-xs text-text-secondary space-y-0.5">
                {c.minOrder > 0 && <div>Min order: Rs {c.minOrder.toLocaleString()}</div>}
                <div>Used: {c.uses}{c.maxUses > 0 ? ` / ${c.maxUses}` : ''}</div>
                {c.expires && <div>Expires: {new Date(c.expires).toLocaleDateString('en-PK')}</div>}
              </div>
              <div className={`inline-block mt-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                c.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {c.active ? 'Active' : 'Inactive'}
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-center justify-center p-4" onClick={() => setCreating(false)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-[500px] w-full p-6 relative">
            <button onClick={() => setCreating(false)} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-5">New Coupon</h2>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="EID25" className={`${inputCls} tracking-wider font-mono`} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="25% off for Eid" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (Rs)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Value</label>
                  <input id="coup-value" name="value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Min Order (Rs)</label>
                  <input id="coup-minOrder" name="minOrder" type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Max Uses (0 = unlimited)</label>
                  <input id="coup-maxUses" name="maxUses" type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} className={inputCls} />
                </div>
                <div className="col-span-2">
                  <label className={labelCls}>Expires (optional)</label>
                  <input type="date" value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCreating(false)} className="flex-1 py-3 rounded-lg border-2 border-border font-semibold hover:border-brand-accent transition text-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-lg bg-brand-accent text-white font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 text-sm">
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
