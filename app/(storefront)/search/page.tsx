'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import ProductCard, { type Product } from '@/components/shop/ProductCard';
import ProductModal from '@/components/ui/ProductModal';
import Toast from '@/components/ui/Toast';
import { fetchProducts } from '@/lib/api';

function SearchContent() {
  const params = useSearchParams();
  const query = (params?.get('q') || '').trim();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((list) => { setAllProducts(list); setLoading(false); });
  }, []);

  const q = query.toLowerCase();
  const results = q
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )
    : [];

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

  return (
    <div className="max-w-[1400px] mx-auto px-[5%] py-12">
      <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-accent mb-6 text-sm">
        <ArrowLeft size={16} /> Continue shopping
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-3">
          <SearchIcon className="text-brand-accent" size={28} />
          Search
        </h1>
        {query ? (
          <p className="text-sm text-text-secondary">
            {loading ? 'Searching...' : (
              <><strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''} for &ldquo;<strong className="text-brand-accent">{query}</strong>&rdquo;</>
            )}
          </p>
        ) : (
          <p className="text-sm text-text-secondary">Type something in the search bar above</p>
        )}
      </div>

      {!loading && query && results.length === 0 && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-bold text-xl mb-2">No products found</h2>
          <p className="text-text-secondary mb-6">Try different keywords or browse all products.</p>
          <Link href="/shop" className="inline-block bg-brand-accent text-white font-semibold px-8 py-3 rounded-full hover:bg-[#e55a2b] transition">
            Browse All Products
          </Link>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {results.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onOpen={(id) => setModalProduct(allProducts.find((x) => x.id === id) || null)}
              onAdd={addToCart}
              onWish={toggleWishlist}
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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-[1400px] mx-auto px-[5%] py-12 text-center text-text-secondary">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
