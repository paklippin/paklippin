'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, User, LogOut, Menu, Search } from 'lucide-react';
import { useUI } from '@/lib/ui-store';
import { useI18n } from '@/lib/use-i18n';
import MobileNav from './MobileNav';

type UserInfo = { name?: string; email?: string } | null;

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserInfo>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState('');
  const openCart = useUI((s) => s.openCart);
  const { t } = useI18n();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.host.startsWith('admin.')) setIsAdmin(true);
  }, []);
  const router = useRouter();

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem('cart-storage') || '{}';
        const data = JSON.parse(raw);
        const items = data?.state?.items || data?.items || [];
        setCartCount(Array.isArray(items) ? items.reduce((s: number, i: any) => s + (i.quantity || 0), 0) : 0);
      } catch { setCartCount(0); }
    };
    read();
    const id = setInterval(read, 600);
    window.addEventListener('storage', read);
    return () => { clearInterval(id); window.removeEventListener('storage', read); };
  }, []);

  useEffect(() => {
    const readUser = () => {
      try {
        for (const key of ['auth-storage', 'paklippin-auth', 'auth', 'user']) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const data = JSON.parse(raw);
          const u = data?.state?.user || data?.user || data;
          if (u && (u.email || u.name)) {
            setUser({ name: u.name || 'User', email: u.email || '' });
            return;
          }
        }
        const email = localStorage.getItem('user_email');
        const name  = localStorage.getItem('user_name');
        if (email || name) { setUser({ name: name || 'User', email: email || '' }); return; }
        setUser(null);
      } catch { setUser(null); }
    };
    readUser();
    const id = setInterval(readUser, 1000);
    window.addEventListener('storage', readUser);
    return () => { clearInterval(id); window.removeEventListener('storage', readUser); };
  }, []);

  const handleLogout = () => {
    ['auth-storage', 'paklippin-auth', 'auth', 'user', 'user_email', 'user_name', 'user_phone'].forEach((k) => localStorage.removeItem(k));
    setUser(null);
    setMenuOpen(false);
    window.location.href = '/';
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const navLinks = [
    { href:'/shop',         label:t('nav.shop') },
    { href:'/shop',         label:t('nav.allProducts') },
    { href:'/categories',   label:t('nav.categories') },
    { href:'/new-arrivals', label:t('nav.newArrivals') },
    { href:'/sale',         label:t('nav.sale') },
    { href:'/about',        label:t('nav.about') },
    { href:'/contact',      label:t('nav.contact') },
    { href:'/faq',          label:t('nav.faq') },
  ];

  const firstName = user?.name?.split(' ')[0] || 'User';

  if (isAdmin) return null;

  return (
    <>
      <header className="sticky top-0 z-[1000] bg-white border-b border-border shadow">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-[5%] py-3 sm:py-4 gap-3 sm:gap-4">
          <button onClick={() => setMobileOpen(true)} className="md:hidden text-text-secondary hover:text-brand-accent transition shrink-0" aria-label="Open menu">
            <Menu size={22} />
          </button>

          <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-brand-accent shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg"
                 style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}>P</div>
            <span className="hidden xs:inline sm:inline">PAKLIPPIN</span>
          </Link>

          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-[500px] mx-6 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
            <input
              id="navbar-search"
              name="search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('nav.search')}
              autoComplete="off"
              className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-border focus:border-brand-accent focus:outline-none transition text-sm"
            />
          </form>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {user ? (
              <div className="relative">
                <button onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition text-sm font-semibold">
                  <div className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-[11px] font-bold">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">Hi, {firstName}</span>
                </button>
                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-[90]" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-hover border border-border py-2 z-[100]">
                      <div className="px-4 py-2 border-b border-border">
                        <div className="text-sm font-semibold text-text-primary truncate">{user.name}</div>
                        <div className="text-xs text-text-secondary truncate">{user.email}</div>
                      </div>
                      <Link href="/account" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-secondary transition"><User size={15}/> {t('nav.account')}</Link>
                      <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-secondary transition">📦 My Orders</Link>
                      <Link href="/account/track" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-brand-secondary transition">🚚 Track Order</Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition border-t border-border mt-1"><LogOut size={15}/> {t('nav.logout')}</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/account" className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border-2 border-border text-text-primary hover:border-brand-accent hover:text-brand-accent transition text-sm font-semibold">
                <User size={16} />
                <span className="hidden sm:inline">{t('nav.loginRegister')}</span>
              </Link>
            )}

            <Link href="/wishlist" className="text-text-secondary hover:text-brand-accent transition" aria-label="Wishlist">
              <Heart size={22} />
            </Link>

            <button onClick={openCart} className="relative text-text-secondary hover:text-brand-accent transition" aria-label="Open cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-semibold w-[18px] h-[18px] rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        <nav className="bg-brand-secondary hidden md:block">
          <ul className="max-w-[1400px] mx-auto px-[5%] flex gap-10 overflow-x-auto">
            {navLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="block py-4 text-sm font-medium text-text-secondary border-b-2 border-transparent hover:text-brand-accent hover:border-brand-accent transition whitespace-nowrap">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {mobileOpen && <MobileNav links={navLinks} onClose={() => setMobileOpen(false)} />}
    </>
  );
}
