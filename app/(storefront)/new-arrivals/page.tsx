'use client';
import { Suspense } from 'react';
import ProductGrid from '@/components/shop/ProductGrid';

export default function NewArrivalsPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">New Arrivals</h1>
        <p className="text-text-secondary">Fresh drops, just landed</p>
      </div>
      <Suspense fallback={<p className="text-center text-text-secondary text-sm">Loading...</p>}>
        <ProductGrid filter="new" />
      </Suspense>
    </div>
  );
}
