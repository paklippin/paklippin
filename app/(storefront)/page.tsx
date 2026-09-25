'use client';
import { useEffect, useState } from 'react';
import HeroScene from '@/components/3d/HeroScene';
import ProductCard, { type Product } from '@/components/shop/ProductCard';
import CategoryGrid from '@/components/shop/CategoryGrid';
import FeatureGrid from '@/components/shop/FeatureGrid';
import RecentlyViewed from '@/components/shop/RecentlyViewed';
import ProductModal from '@/components/ui/ProductModal';
import Toast from '@/components/ui/Toast';
import { fetchProducts, FALLBACK_PRODUCTS } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '' });

  useEffect(() => {
    let alive = true;
    fetchProducts().then((list) => { if (alive && list.length) setProducts(list); });
    return () => { alive = false; };
  }, []);

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

  return (
    <>
      <section
        className="py-16 px-[5%]"
        style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #fff 50%, #f0f9ff 100%)' }}
      >
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-[56px] font-bold leading-[1.1] mb-5 text-text-primary">
              Pakistan&apos;s <span className="text-brand-accent">Trusted</span> Online Store
            </h1>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Quality products, fast delivery, and excellent service. Discover amazing products at unbeatable prices with our immersive 3D shopping experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="#products" className="btn btn-primary">Shop Now 🛍️</a>
              <a href="#categories" className="btn btn-secondary">Explore Categories</a>
            </div>
          </div>
          <div className="h-[400px] md:h-[500px]">
            <HeroScene />
          </div>
        </div>
      </section>

      <section className="py-20 px-[5%] max-w-[1400px] mx-auto" id="products">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2.5">Featured Products</h2>
          <p className="text-text-secondary text-base">Discover our handpicked selection with interactive 3D previews</p>
        </div>
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
      </section>

      <RecentlyViewed />
      <CategoryGrid />
      <FeatureGrid />

      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAdd={(id) => { addToCart(id); setModalProduct(null); }}
      />

      <Toast message={toast.msg} show={toast.show} />
    </>
  );
}
