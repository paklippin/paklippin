'use client';
import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';

type Settings = {
  store_name: string; store_address: string;
  store_phone: string; store_email: string;
  currency: string; currency_symbol: string;
  tax_rate: number; receipt_footer: string;
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>({
    store_name: '', store_address: '', store_phone: '', store_email: '',
    currency: 'PKR', currency_symbol: 'Rs', tax_rate: 0, receipt_footer: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/admin/settings', { cache: 'no-store' });
        const json = await res.json();
        if (json.settings) {
          setForm({
            store_name: json.settings.store_name || '',
            store_address: json.settings.store_address || '',
            store_phone: json.settings.store_phone || '',
            store_email: json.settings.store_email || '',
            currency: json.settings.currency || 'PKR',
            currency_symbol: json.settings.currency_symbol || 'Rs',
            tax_rate: Number(json.settings.tax_rate ?? json.settings.tax_percent ?? 0),
            receipt_footer: json.settings.receipt_footer || '',
          });
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {}
    setSaving(false);
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5';

  if (loading) return <p className="text-text-secondary text-sm">Loading settings...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-sm text-text-secondary">Company info, currency, and receipt details</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-xl mb-5">
          ✓ Settings saved
        </div>
      )}

      <div className="max-w-[700px] space-y-6">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-base">Store Info</h2>
          <div>
            <label htmlFor="fld-store-name" className={labelCls}>Store Name</label>
            <input id="fld-store-name" name="fld-store-name" value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label htmlFor="fld-address" className={labelCls}>Address</label>
            <input id="fld-address" name="fld-address" value={form.store_address} onChange={(e) => setForm({ ...form, store_address: e.target.value })} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="fld-phone" className={labelCls}>Phone</label>
              <input id="fld-phone" name="fld-phone" value={form.store_phone} onChange={(e) => setForm({ ...form, store_phone: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label htmlFor="fld-email" className={labelCls}>Email</label>
              <input id="fld-email" name="fld-email" value={form.store_email} onChange={(e) => setForm({ ...form, store_email: e.target.value })} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-base">Currency & Tax</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="fld-currency-code" className={labelCls}>Currency Code</label>
              <input id="fld-currency-code" name="fld-currency-code" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })} className={inputCls} />
            </div>
            <div>
              <label htmlFor="fld-symbol" className={labelCls}>Symbol</label>
              <input id="fld-symbol" name="fld-symbol" value={form.currency_symbol} onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label htmlFor="set-taxRate" className={labelCls}>Tax Rate (%)</label>
              <input id="set-taxRate" name="taxRate" type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-base">Receipt</h2>
          <div>
            <label htmlFor="fld-receipt-footer" className={labelCls}>Receipt Footer</label>
            <textarea id="fld-receipt-footer" name="fld-receipt-footer" value={form.receipt_footer} onChange={(e) => setForm({ ...form, receipt_footer: e.target.value })}
              rows={3} className={inputCls} />
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition disabled:opacity-60 text-sm">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
