'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Globe, DollarSign } from 'lucide-react';
import { AccountShell } from '@/components/account/AccountShell';
import { readUser, writeUser, type StoredUser } from '@/lib/user';
import {
  LANGUAGES, CURRENCIES,
  getLang, setLang, getCurrency, setCurrency,
} from '@/lib/locale';

export default function SettingsPage() {
  const [user, setUser]     = useState<StoredUser>(null);
  const [name, setName]     = useState('');
  const [phone, setPhone]   = useState('');
  const [lang, setLangState]         = useState('en');
  const [currency, setCurrencyState] = useState('PKR');
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    const u = readUser();
    setUser(u);
    if (u) { setName(u.name); setPhone(u.phone || ''); }
    setLangState(getLang());
    setCurrencyState(getCurrency());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const u = { name, email: user.email, phone };
    writeUser(u);
    setUser(u);
    setLang(lang);
    setCurrency(currency);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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

  const inputCls = 'w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition';
  const selectCls = inputCls + ' bg-white cursor-pointer';

  return (
    <AccountShell user={user}>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {saved && (
        <div className="bg-orange-50 border border-orange-100 text-brand-accent text-sm p-3 rounded-xl mb-5">
          ✓ Preferences saved
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 max-w-[600px]">

        {/* -------- Profile -------- */}
        <div className="bg-white border border-border rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-base mb-1">Profile</h2>
          <div>
            <label htmlFor="fld-full-name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Full Name</label>
            <input id="fld-full-name" name="fld-full-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label htmlFor="fld-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Email</label>
            <input id="fld-email" name="fld-email" value={user.email} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
          </div>
          <div>
            <label htmlFor="fld-phone" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Phone</label>
            <input id="fld-phone" name="fld-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" className={inputCls} />
          </div>
        </div>

        {/* -------- Language -------- */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-bold text-base mb-4 flex items-center gap-2">
            <Globe size={18} className="text-brand-accent" /> Language
          </h2>
          <label htmlFor="fld-preferred-language" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Preferred Language
          </label>
          <select id="fld-preferred-language" name="fld-preferred-language"
            value={lang}
            onChange={(e) => setLangState(e.target.value)}
            className={selectCls}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name} — {l.native}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-secondary mt-2">
            Selected: <strong>{LANGUAGES.find((l) => l.code === lang)?.name}</strong>
          </p>
        </div>

        {/* -------- Currency -------- */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <h2 className="font-bold text-base mb-4 flex items-center gap-2">
            <DollarSign size={18} className="text-brand-accent" /> Currency
          </h2>
          <label htmlFor="fld-preferred-currency" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Preferred Currency
          </label>
          <select id="fld-preferred-currency" name="fld-preferred-currency"
            value={currency}
            onChange={(e) => setCurrencyState(e.target.value)}
            className={selectCls}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol}) — {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-text-secondary mt-2">
            Selected: <strong>{currency}</strong> — all prices will convert from PKR
          </p>
          <div className="mt-3 bg-brand-secondary rounded-lg p-3 text-xs">
            <div className="text-text-secondary mb-1">Preview:</div>
            <div className="font-bold text-brand-accent">
              Rs 5,000 → {(() => {
                const { PKR_RATES, CURRENCIES } = require('@/lib/locale');
                const rate = PKR_RATES[currency] || 1;
                const cur = CURRENCIES.find((c: any) => c.code === currency) || CURRENCIES[0];
                const val = 5000 * rate;
                const dec = ['PKR','INR','JPY','KRW'].includes(currency) ? 0 : 2;
                return `${cur.symbol} ${val.toLocaleString('en-PK', { minimumFractionDigits: dec, maximumFractionDigits: dec })}`;
              })()}
            </div>
          </div>
        </div>

        {/* -------- Save -------- */}
        <button
          type="submit"
          className="w-full bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition"
        >
          Save Preferences
        </button>
      </form>
    </AccountShell>
  );
}
