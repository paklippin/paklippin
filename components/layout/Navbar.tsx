'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Heart, User, LogOut } from 'lucide-react';
import { useUI } from '@/lib/ui-store';

type UserInfo = { name?: string; email?: string } | null;

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserInfo>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const openCart = useUI((s) => s.openCart);

  // Read cart count
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

  // Read auth state — tries every known key
  useEffect(() => {
    const readUser = () => {
      try {
        // 1. Try the auth store key first
        const authKeys = ['auth-storage', 'paklippin-auth', 'auth', 'user'];
        for (const key of authKeys) {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const data = JSON.parse(raw);
          const u = data?.state?.user || data?.user || data;
          if (u && (u.email || u.name)) {
            setUser({ name: u.name || u.fullName || 'User', email: u.email || '' });
            return;
          }
        }
        // 2. Standalone keys
        const email = localStorage.getItem('user_email');
        const name  = localStorage.getItem('user_name');
        if (email || name) {
          setUser({ name: name || 'User', email: email || '' });
          return;
        }
        setUser(null);
      } catch { setUser(null); }
    };
    readUser();
    const id = setInterval(readUser, 1000);
    window.addEventListener('storage', readUser);
    return () => { clearInterval(id); window.removeEventListener('storage', readUser); };
  }, []);

  const handleLogout = () => {
    try {
      ['auth-storage', 'paklippin-auth', 'auth', 'user', 'user_email', 'user_name'].forEach((k) => localStorage.removeItem(k));
    } catch {}
    setUser(null);
    setMenuOpen(false);
    window.location.href = '/';
  };

  const navLinks = [
    { href:'/shop',         label:'Shop' },
    { href:'/shop',         label:'All Products' },
    { href:'/categories',   label:'Categories' },
    { href:'/new-arrivals', label:'New Arrivals' },
    { href:'/sale',         label:'Sale' },
    { href:'/about',        label:'About Us' },
    { href:'/contact',      label:'Contact' },
    { href:'/faq',          label:'FAQ' },
  ];

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="sticky top-0 z-[1000] bg-white border-b border-border shadow">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-[5%] py-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-2xl text-brand-accent shrink-0">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}
          >P</div>
          PAKLIPPIN
        </Link>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-[500px] mx-6">
          <input
            type="text"
            placeholder="Search products, categories, brands..."
            className="w-full px-5 py-3 rounded-full border-2 border-border focus:border-brand-accent focus:outline-none transition text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">

          {user ? (
            /* LOGGED IN — user pill with dropdown */
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white transition text-sm font-semibold"
              >
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
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-brand-secondary transition"
                    >
                      <User size={15} /> My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-brand-secondary transition"
                    >
                      📦 My Orders
                    </Link>
                    <Link
                      href="/account/track"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-brand-secondary transition"
                    >
                      🚚 Track Order
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition border-t border-border mt-1"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* NOT LOGGED IN — Login / Register */
            <Link
              href="/account"
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border text-text-primary hover:border-brand-accent hover:text-brand-accent transition text-sm font-semibold"
            >
              <User size={16} />
              <span className="hidden sm:inline">Login / Register</span>
            </Link>
          )}

          {/* Wishlist */}
          <Link href="/account" className="relative text-text-secondary hover:text-brand-accent transition" aria-label="Wishlist">
            <Heart size={22} />
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative text-text-secondary hover:text-brand-accent transition"
            aria-label="Open cart"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-semibold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-brand-secondary hidden md:block">
        <ul className="max-w-[1400px] mx-auto px-[5%] flex gap-10 overflow-x-auto">
          {navLinks.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                className="block py-4 text-sm font-medium text-text-secondary border-b-2 border-transparent hover:text-brand-accent hover:border-brand-accent transition whitespace-nowrap"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
