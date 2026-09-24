'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';

type LinkItem = { href: string; label: string };

export default function MobileNav({ links = [], onClose = () => {} }: { links?: LinkItem[]; onClose?: () => void }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      onClose();
    }
  };

  return (
    <div className="md:hidden fixed inset-0 z-[1100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute top-0 left-0 w-[85%] max-w-[340px] h-full bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}>P</div>
            <span className="font-bold text-brand-accent">PAKLIPPIN</span>
          </div>
          <button onClick={onClose} aria-label="Close menu"><X size={22} className="text-text-secondary" /></button>
        </div>

        <form onSubmit={submitSearch} className="p-5 border-b border-border">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              id="mobile-search"
              name="mobileSearch"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              autoComplete="off"
              className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-border focus:border-brand-accent outline-none text-sm"
            />
          </div>
        </form>

        <nav className="p-3">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={onClose}
              className="flex items-center justify-between px-4 py-3.5 rounded-lg text-sm font-medium text-text-primary hover:bg-brand-secondary hover:text-brand-accent transition">
              {l.label}
              <span className="text-text-secondary">›</span>
            </Link>
          ))}
        </nav>

        <div className="p-5 border-t border-border mt-3">
          <Link href="/account" onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-accent text-white font-semibold text-sm">
            👤 Login / Register
          </Link>
          <p className="text-[11px] text-text-secondary text-center mt-3">📞 +92 339 7579547</p>
        </div>
      </aside>
    </div>
  );
}
