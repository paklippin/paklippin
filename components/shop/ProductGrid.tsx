'use client';
import { useEffect, useState } from 'react';
import ProductCard, { type Product } from './ProductCard';
import ProductModal from '@/components/ui/ProductModal';
import Toast from '@/components/ui/Toast';
import { fetchProducts } from '@/lib/api';

type Props = {
  limit?: number;
  filter?: 'sale' | 'new' | 'all';
};

export default function ProductGrid({ limit, filter = 'all' }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '' });

  useEffect(() => {
    fetchProducts().then((all) => {
      let list = all;
      if (filter === 'sale') list = all.filter((p) => p.badge?.toLowerCase() === 'sale' || p.originalPrice > p.price);
      if (filter === 'new')  list = all.filter((p) => p.badge?.toLowerCase() === 'new');
      if (limit) list = list.slice(0, limit);
      setProducts(list);
    });
  }, [limit, filter]);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  const addToCart = (id: number) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    try {
      const raw = localStorage.getItem('cart-storage') || '{}';
      const data = JSON.parse(raw);
      const items = data?.state?.items || data?.items || [];
      const existing = items.find((x: any) => x.id === id);
      const next = existing
        ? items.map((x: any) => x.id === id ? { ...x, quantity: x.quantity + 1 } : x)
        : [...items, { ...p, quantity: 1 }];
      localStorage.setItem('cart-storage', JSON.stringify({ state: { items: next }, version: 0 }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast('Item added to cart!');
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-text-secondary text-sm">
        Loading products...
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onOpen={(id) => setModalProduct(products.find((x) => x.id === id) || null)}
            onAdd={addToCart}
            onWish={() => showToast('Added to wishlist!')}
          />
        ))}
      </div>

      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAdd={(id) => { addToCart(id); setModalProduct(null); }}
      />

      <Toast message={toast.msg} show={toast.show} />
    </>
  );
}
