'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/lib/use-currency';
import type { Product } from './ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export default function RelatedProducts({
  currentProduct,
  allProducts,
  onOpen,
}: {
  currentProduct: Product;
  allProducts: Product[];
  onOpen: (id: number) => void;
}) {
  const { price } = useCurrency();

  // Related = same category, exclude current, take 4
  let related = allProducts.filter(
    (p) => p.id !== currentProduct.id && p.category.toLowerCase() === currentProduct.category.toLowerCase()
  );
  // If fewer than 4, add random from other categories
  if (related.length < 4) {
    const others = allProducts.filter((p) => p.id !== currentProduct.id && !related.includes(p));
    related = [...related, ...others].slice(0, 4);
  } else {
    related = related.slice(0, 4);
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">You may also like</h3>
        <Link href="/shop" className="text-xs text-brand-accent hover:underline font-semibold">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {related.map((p) => {
          const hasImage = p.imageUrl && p.imageUrl.trim();
          return (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              className="bg-brand-secondary rounded-xl overflow-hidden text-left hover:shadow-md transition group"
            >
              <div className="aspect-square bg-white flex items-center justify-center overflow-hidden">
                {hasImage ? (
                  <img
                    src={p.imageUrl!.startsWith('http') ? p.imageUrl! : `${API_BASE}${p.imageUrl}`}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <span className="text-4xl">{p.emoji}</span>
                )}
              </div>
              <div className="p-2.5">
                <div className="text-xs font-semibold truncate text-text-primary">{p.name}</div>
                <div className="text-xs font-bold text-brand-accent mt-0.5">{price(p.price)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
