'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard, { type Product } from './ProductCard';
import ProductModal from '@/components/ui/ProductModal';
import Toast from '@/components/ui/Toast';
import { fetchProducts } from '@/lib/api';

type Props = {
  limit?: number;
  filter?: 'sale' | 'new' | 'all';
  categoryFilter?: string;
};

export default function ProductGrid({ limit, filter = 'all', categoryFilter }: Props) {
  const params = useSearchParams();
  const urlCategory = params?.get('category') || '';
  const activeCategory = categoryFilter || urlCategory;

  const [products, setProducts] = useState<Product[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((all) => {
      let list = all;
      if (filter === 'sale') list = all.filter((p) => p.badge?.toLowerCase() === 'sale' || p.originalPrice > p.price);
      if (filter === 'new')  list = all.filter((p) => p.badge?.toLowerCase() === 'new');
      if (activeCategory) {
        list = list.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
      }
      if (limit) list = list.slice(0, limit);
      setProducts(list);
      setLoading(false);
    });
  }, [limit, filter, activeCategory]);

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
      const items = data?.state?.items || [];
      const existing = items.find((x: any) => x.id === id);
      const next = existing
        ? items.map((x: any) => x.id === id ? { ...x, quantity: x.quantity + 1 } : x)
        : [...items, { ...p, quantity: 1 }];
      localStorage.setItem('cart-storage', JSON.stringify({ state: { items: next }, version: 0 }));
      window.dispatchEvent(new Event('storage'));
    } catch {}
    showToast('Item added to cart!');
  };

  const toggleWishlist = (id: number) => {
    try {
      const raw = localStorage.getItem('wishlist');
      const ids: number[] = raw ? JSON.parse(raw).map(Number) : [];
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      localStorage.setItem('wishlist', JSON.stringify(next));
      window.dispatchEvent(new Event('storage'));
      showToast(ids.includes(id) ? 'Removed from wishlist' : 'Added to wishlist!');
    } catch {}
  };

  if (loading) {
    return <div className="text-center py-16 text-text-secondary text-sm">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary mb-4">
          {activeCategory ? `No products in "${activeCategory}" yet.` : 'No products found.'}
        </p>
        {activeCategory && (
          <a href="/shop" className="text-brand-accent hover:underline text-sm">View all products →</a>
        )}
      </div>
    );
  }

  return (
    <>
      {activeCategory && (
        <div className="mb-6 text-center">
          <p className="text-sm text-text-secondary">
            Showing <strong className="text-brand-accent">{products.length}</strong> product{products.length !== 1 ? 's' : ''} in <strong>{activeCategory}</strong>
            {' · '}
            <a href="/shop" className="text-brand-accent hover:underline">Clear filter</a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onOpen={(id) => setModalProduct(products.find((x) => x.id === id) || null)}
            onAdd={addToCart}
            onWish={toggleWishlist}
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
