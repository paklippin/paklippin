'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Image as ImageIcon, Ticket, Settings, LogOut, Menu, X, Share2
} from 'lucide-react';

const ADMIN_PASSWORD = 'P@52545254';
const ADMIN_KEY = 'paklippin_admin_auth';

const NAV = [
  { href: '/admin',           label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders',    label: 'Orders',    icon: ShoppingBag },
  { href: '/admin/products',  label: 'Products',  icon: Package },
  { href: '/admin/media',     label: 'Media',     icon: ImageIcon },
  { href: '/admin/users',     label: 'Users',     icon: Users },
  { href: '/admin/coupons',   label: 'Coupons',   icon: Ticket },
  { href: '/admin/social',    label: 'Social',    icon: Share2 },
  { href: '/admin/settings',  label: 'Settings',  icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdminHost, setIsAdminHost] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAuthed(localStorage.getItem(ADMIN_KEY) === '1');
    setIsAdminHost(window.location.host.startsWith('admin.'));
    setReady(true);
  }, []);

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
    setMobileOpen(false);
  };

  if (!ready) return null;

  if (!authed) {
    return (
      <div className="min-h-[80vh] grid place-items-center px-5 py-16">
        <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl p-8 shadow">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Access</h1>
          <p className="text-sm text-text-secondary text-center mb-6">Enter your password to continue</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              id="admin-password"
              name="adminPassword"
              autoComplete="current-password"
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

  const resolveHref = (href: string) => isAdminHost ? (href.replace('/admin', '') || '/') : href;
  const isActive = (href: string) => {
    const p = resolveHref(href);
    if (p === '/' || p === '/admin') return pathname === '/' || pathname === '/admin';
    return pathname.startsWith(p);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-8 grid lg:grid-cols-[240px_1fr] gap-8">
      <div className="lg:hidden flex items-center justify-between mb-2">
        <div className="font-bold text-lg text-brand-accent">Admin</div>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg border border-border">
          <Menu size={20} />
        </button>
      </div>

      <aside className={`
        fixed lg:static top-0 left-0 h-full lg:h-fit w-[260px] lg:w-auto z-[2100] lg:z-0
        bg-white border-r lg:border-r-0 lg:rounded-2xl lg:border lg:border-border p-5
        transition-transform duration-300 overflow-y-auto
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                 style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}>P</div>
            <div className="text-sm font-bold">PAKLIPPIN<br/><span className="text-[10px] text-text-secondary font-normal">Admin Panel</span></div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-text-secondary">
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 mb-6">
          {NAV.map((l) => {
            const Icon = l.icon;
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={resolveHref(l.href)}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-brand-accent text-white'
                    : 'text-text-secondary hover:bg-brand-secondary hover:text-brand-accent'
                }`}
              >
                <Icon size={16} /> {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
          >
            <LogOut size={16} /> Logout
          </button>
          <Link
            href={isAdminHost ? 'https://paklippinshop.pages.dev' : '/'}
            className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-brand-secondary transition"
          >
            ← View Store
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-[2000]" onClick={() => setMobileOpen(false)} />
      )}

      <main className="min-w-0">{children}</main>
    </div>
  );
}
