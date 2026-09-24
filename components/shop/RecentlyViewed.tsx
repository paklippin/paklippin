'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCurrency } from '@/lib/use-currency';
import { getRecentIds, clearRecent } from '@/lib/recent';
import type { Product } from './ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export default function RecentlyViewed() {
  const [recent, setRecent] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { price } = useCurrency();

  const load = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const json = await res.json();
      const list: Product[] = Array.isArray(json.products) ? json.products : [];
      setAllProducts(list);
      const ids = getRecentIds();
      const recentProducts = ids
        .map((id) => list.find((p) => p.id === id))
        .filter(Boolean) as Product[];
      setRecent(recentProducts);
    } catch {}
  };

  useEffect(() => {
    load();
    window.addEventListener('recent-change', load);
    return () => window.removeEventListener('recent-change', load);
  }, []);

  if (recent.length < 2) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-[5%] py-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <button
          onClick={() => { clearRecent(); setRecent([]); }}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-brand-accent transition"
        >
          <X size={12} /> Clear
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
        {recent.map((p) => {
          const hasImage = p.imageUrl && p.imageUrl.trim();
          return (
            <Link
              key={p.id}
              href="/shop"
              className="shrink-0 w-[140px] bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-square bg-brand-secondary flex items-center justify-center overflow-hidden">
                {hasImage ? (
                  <img
                    src={p.imageUrl!.startsWith('http') ? p.imageUrl! : `${API_BASE}${p.imageUrl}`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">{p.emoji}</span>
                )}
              </div>
              <div className="p-2">
                <div className="text-[11px] font-semibold truncate">{p.name}</div>
                <div className="text-[11px] font-bold text-brand-accent mt-0.5">{price(p.price)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
