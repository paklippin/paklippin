'use client';
import { Suspense } from 'react';
import ProductGrid from '@/components/shop/ProductGrid';

export default function ShopPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">All Products</h1>
        <p className="text-text-secondary">Browse our full catalogue</p>
      </div>
      <Suspense fallback={<p className="text-center text-text-secondary text-sm">Loading...</p>}>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
