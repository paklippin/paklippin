'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';
import ProductCard, { type Product } from '@/components/shop/ProductCard';
import ProductModal from '@/components/ui/ProductModal';
import Toast from '@/components/ui/Toast';
import { fetchProducts } from '@/lib/api';

export default function WishlistPage() {
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    try {
      const raw = localStorage.getItem('wishlist');
      const ids = raw ? JSON.parse(raw) : [];
      setWishlistIds(Array.isArray(ids) ? ids.map(Number) : []);
    } catch { setWishlistIds([]); }
  };

  useEffect(() => {
    load();
    fetchProducts().then((list) => { setAllProducts(list); setLoading(false); });
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  const addToCart = (id: number) => {
    const p = allProducts.find((x) => x.id === id);
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

  const removeFromWishlist = (id: number) => {
    const next = wishlistIds.filter((x) => x !== id);
    setWishlistIds(next);
    try { localStorage.setItem('wishlist', JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event('storage'));
    showToast('Removed from wishlist');
  };

  const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-accent mb-6 text-sm">
        <ArrowLeft size={16} /> Continue shopping
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
          <Heart className="text-brand-accent" /> My Wishlist
        </h1>
        <p className="text-sm text-text-secondary">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading...</p>
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-bold text-xl mb-2">Your wishlist is empty</h2>
          <p className="text-text-secondary mb-6">Tap the ❤️ on any product to save it here.</p>
          <Link href="/shop" className="inline-block bg-brand-accent text-white font-semibold px-8 py-3 rounded-full hover:bg-[#e55a2b] transition">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {wishlistProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={(id) => setModalProduct(allProducts.find((x) => x.id === id) || null)}
              onAdd={addToCart}
              onWish={(id) => removeFromWishlist(id)}
            />
          ))}
        </div>
      )}

      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onAdd={(id) => { addToCart(id); setModalProduct(null); }}
      />
      <Toast message={toast.msg} show={toast.show} />
    </div>
  );
}
