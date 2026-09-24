'use client';
import Link from 'next/link';
import { X } from 'lucide-react';

type LinkItem = { href: string; label: string };

export default function MobileNav({
  links = [],
  onClose = () => {},
}: {
  links?: LinkItem[];
  onClose?: () => void;
}) {
  return (
    <div className="md:hidden fixed inset-0 z-[1100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="absolute top-0 left-0 w-[80%] max-w-[320px] h-full bg-white shadow-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-xl text-brand-accent">Menu</span>
          <button onClick={onClose} aria-label="Close menu">
            <X size={22} className="text-text-secondary" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={onClose} className="py-3 px-3 rounded-lg text-sm font-medium text-text-primary hover:bg-brand-secondary hover:text-brand-accent transition">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
