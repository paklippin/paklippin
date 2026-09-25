'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useUI } from '@/lib/ui-store';
import { useI18n } from '@/lib/use-i18n';

export default function BottomNav() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openCart = useUI((s) => s.openCart);
  const { t } = useI18n();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.location.host.startsWith('admin.')) setIsAdmin(true);
  }, []);

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
    const id = setInterval(read, 800);
    window.addEventListener('storage', read);
    return () => { clearInterval(id); window.removeEventListener('storage', read); };
  }, []);

  if (!mounted || isAdmin) return null;

  const items = [
    { href: '/',        label: t('nav.home')    || 'Home',    icon: Home },
    { href: '/shop',    label: t('nav.shop')    || 'Shop',    icon: ShoppingBag },
    { href: '/account', label: t('nav.account') || 'Account', icon: User },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[900] bg-white border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-4 h-[60px]">
        {items.map((it) => {
          const Icon = it.icon;
          const active = isActive(it.href);
          return (
            <Link key={it.href} href={it.href} prefetch={false}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${active ? 'text-brand-accent' : 'text-text-secondary'}`}>
              <Icon size={20} />
              {it.label}
            </Link>
          );
        })}
        <button onClick={openCart}
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-text-secondary relative">
          <ShoppingCart size={20} />
          {t('nav.cart') || 'Cart'}
          {cartCount > 0 && (
            <span className="absolute top-1 right-1/4 bg-brand-accent text-white text-[9px] font-bold min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center">{cartCount}</span>
          )}
        </button>
      </div>
    </nav>
  );
}
