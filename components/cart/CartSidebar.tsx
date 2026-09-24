'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import type { Product } from '@/components/shop/ProductCard';
import { useSettings } from '@/lib/settings-store';

export type CartItem = Product & { quantity: number };

type Props = {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
};

export default function CartSidebar({ open, items, onClose, onQty, onRemove }: Props) {
  const { settings, load } = useSettings();

  useEffect(() => { load(); }, [load]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count    = items.reduce((s, i) => s + i.quantity, 0);

  const freeShipping = subtotal >= settings.shipping_threshold;
  const deliveryFee  = freeShipping ? 0 : (items.length ? settings.delivery_fee : 0);
  const total        = subtotal + deliveryFee;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-[1500] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <aside
        className={`fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white z-[2000] flex flex-col transition-transform duration-300 shadow-2xl ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="px-5 py-5 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Shopping Cart ({count})</h3>
          <button onClick={onClose} className="text-2xl text-text-secondary leading-none" aria-label="Close cart">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="text-center text-text-secondary mt-10 text-sm">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 border-b border-border">
                <div className="w-20 h-20 bg-brand-secondary rounded-lg flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com'}${item.imageUrl}`}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    item.emoji
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1">{item.name}</div>
                  <div className="text-brand-accent font-semibold text-sm">
                    Rs {item.price.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2.5 mt-2">
                    <button onClick={() => onQty(item.id, -1)} className="w-7 h-7 border border-border bg-white rounded font-semibold text-sm">−</button>
                    <span className="text-sm min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => onQty(item.id, 1)} className="w-7 h-7 border border-border bg-white rounded font-semibold text-sm">+</button>
                    <button onClick={() => onRemove(item.id)} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-5 border-t border-border">
          {!freeShipping && subtotal > 0 && (
            <div className="text-xs text-text-secondary mb-3 text-center">
              Add <strong className="text-brand-accent">Rs {(settings.shipping_threshold - subtotal).toLocaleString()}</strong> more for free shipping
            </div>
          )}
          {freeShipping && subtotal > 0 && (
            <div className="text-xs text-brand-success mb-3 text-center font-semibold">
              🎉 You qualify for free shipping!
            </div>
          )}

          <div className="space-y-2 text-sm mb-3">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal:</span>
              <span>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Delivery:</span>
              <span className={freeShipping ? 'text-brand-success font-semibold' : ''}>
                {freeShipping ? 'FREE' : `Rs ${deliveryFee}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-4 pt-3 border-t border-border">
            <span>Total:</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>

          <Link
            href="/checkout"
            onClick={onClose}
            className={`block text-center w-full py-3.5 rounded-lg font-semibold text-sm transition ${
              items.length
                ? 'bg-brand-accent text-white hover:bg-[#e55a2b]'
                : 'bg-gray-200 text-gray-500 pointer-events-none'
            }`}
          >
            Proceed to Checkout
          </Link>

          <p className="text-[11px] text-text-secondary text-center mt-3 leading-relaxed">
            🔐 Login/Register required for payment
          </p>
        </div>
      </aside>
    </>
  );
}
