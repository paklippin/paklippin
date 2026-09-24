'use client';
import { useEffect, useState } from 'react';
import ProductBox3D from '@/components/3d/ProductBox3D';
import { useCurrency } from '@/lib/use-currency';

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  emoji: string;
  imageUrl?: string;
  stock?: number;
  description?: string;
  active?: number;
};

type Props = {
  product: Product;
  onOpen: (id: number) => void;
  onAdd: (id: number) => void;
  onWish: (id: number) => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export default function ProductCard({ product, onOpen, onAdd, onWish }: Props) {
  const [wished, setWished] = useState(false);
  const { price } = useCurrency();
  const hasImage = product.imageUrl && product.imageUrl.trim();
  const stock = product.stock ?? 999;
  const outOfStock = stock <= 0;
  const lowStock = stock > 0 && stock <= 5;

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem('wishlist');
        const ids = raw ? JSON.parse(raw) : [];
        setWished(Array.isArray(ids) && ids.map(Number).includes(product.id));
      } catch { setWished(false); }
    };
    check();
    window.addEventListener('storage', check);
    return () => window.removeEventListener('storage', check);
  }, [product.id]);

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWish(product.id);
    setWished((v) => !v);
  };

  return (
    <div
      onClick={() => onOpen(product.id)}
      className="bg-white rounded-2xl overflow-hidden shadow cursor-pointer relative transition-all duration-300 hover:-translate-y-2 hover:shadow-hover"
    >
      <div className="h-[280px] bg-brand-secondary relative overflow-hidden">
        {hasImage ? (
          <img
            src={product.imageUrl!.startsWith('http') ? product.imageUrl! : `${API_BASE}${product.imageUrl}`}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover ${outOfStock ? 'opacity-40' : ''}`}
          />
        ) : (
          <ProductBox3D />
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-4 left-4 bg-brand-accent text-white px-3 py-1.5 rounded-full text-xs font-semibold">
            {product.badge}
          </span>
        )}

        {/* Low stock indicator */}
        {lowStock && !outOfStock && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-bold">
            Only {stock} left!
          </span>
        )}

        {/* Out of stock overlay */}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={handleWish}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center shadow transition text-sm ${
            wished ? 'bg-[#ff4757] text-white' : 'bg-white hover:bg-[#ff4757] hover:text-white'
          }`}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wished ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="p-5">
        <div className="text-xs text-brand-accent font-semibold uppercase tracking-wider">
          {product.category}
        </div>
        <div className="text-base font-semibold my-2 text-text-primary">
          {product.name}
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-xl font-bold text-brand-accent">{price(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-text-secondary line-through">{price(product.originalPrice)}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 text-sm text-text-secondary">
          <span className="text-[#ffc107]">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span>({product.reviews})</span>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product.id); }}
          disabled={outOfStock}
          className={`w-full py-3 rounded-lg font-semibold mt-4 transition ${
            outOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-brand-primary text-white hover:bg-brand-accent'
          }`}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
