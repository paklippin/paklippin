'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Truck, Settings, LogOut } from 'lucide-react';

type User = { name?: string; email?: string };

export function AccountShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();

  const links = [
    { href: '/account',          icon: LayoutDashboard, label: 'Overview' },
    { href: '/account/orders',   icon: Package,         label: 'My Orders' },
    { href: '/account/track',    icon: Truck,           label: 'Track Order' },
    { href: '/account/settings', icon: Settings,        label: 'Settings' },
  ];

  const handleLogout = () => {
    ['auth-storage', 'paklippin-auth', 'auth', 'user', 'user_email', 'user_name']
      .forEach((k) => localStorage.removeItem(k));
    window.location.href = '/';
  };

  const displayName = user.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-12 grid md:grid-cols-[260px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="bg-white border border-border rounded-2xl p-6 h-fit">
        <div className="flex flex-col items-center text-center pb-6 border-b border-border">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-3"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}
          >
            {initial}
          </div>
          <div className="font-bold text-base">{displayName}</div>
          <div className="text-xs text-text-secondary truncate w-full">{user.email}</div>
        </div>

        <nav className="flex flex-col gap-1 mt-4">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  active
                    ? 'bg-brand-accent text-white'
                    : 'text-text-secondary hover:bg-brand-secondary hover:text-brand-accent'
                }`}
              >
                <Icon size={16} /> {l.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition mt-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="min-w-0">{children}</main>
    </div>
  );
}
