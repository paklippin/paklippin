'use client';
import { useEffect, useState } from 'react';
import ModalViewer from '@/components/3d/ModalViewer';
import type { Product } from '@/components/shop/ProductCard';

type Props = {
  product: Product | null;
  onClose: () => void;
  onAdd: (id: number) => void;
};

export default function ProductModal({ product, onClose, onAdd }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!product || !mounted) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-[1000px] w-full max-h-[90vh] overflow-y-auto grid md:grid-cols-2 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 bg-white rounded-full shadow flex items-center justify-center text-xl z-10"
          aria-label="Close modal"
        >×</button>

        <div className="h-[320px] md:h-[500px] bg-brand-secondary md:rounded-l-3xl overflow-hidden">
          {mounted && <ModalViewer />}
        </div>

        <div className="p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-bold text-brand-accent">Rs {product.price.toLocaleString()}</span>
            <span className="text-sm text-text-secondary line-through">Rs {product.originalPrice.toLocaleString()}</span>
          </div>
          <p className="text-text-secondary leading-relaxed mb-5 text-sm">
            Experience this amazing product in full 3D. Rotate, zoom, and explore every detail before you buy.
          </p>
          <div className="bg-brand-secondary rounded-lg p-3 mb-5 text-xs text-text-secondary space-y-1">
            <div>🚚 Free shipping on orders over Rs 5,000</div>
            <div>💰 Delivery charges Rs 300 (below Rs 5,000)</div>
          </div>
          <div className="mb-5">
            <label className="font-semibold block mb-2 text-sm">Size:</label>
            <div className="flex gap-2.5">
              {['S', 'M', 'L'].map((s) => (
                <button key={s} className="px-4 py-2 border border-border rounded-lg font-semibold text-sm hover:border-brand-accent transition">{s}</button>
              ))}
            </div>
          </div>
          <button
            onClick={() => onAdd(product.id)}
            className="w-full py-3.5 bg-brand-accent text-white rounded-lg font-semibold text-sm mb-2.5 transition hover:bg-[#e55a2b]"
          >Add to Cart</button>
          <button className="w-full py-3.5 bg-white border-2 border-border rounded-lg font-semibold text-sm transition hover:border-brand-accent hover:text-brand-accent">
            ❤️ Add to Wishlist
          </button>
          <p className="text-[11px] text-text-secondary text-center mt-4 leading-relaxed">
            🔐 Login/Register required for payment
          </p>
        </div>
      </div>
    </div>
  );
}
