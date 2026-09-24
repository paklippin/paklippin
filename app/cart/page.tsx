'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store';

export default function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.total());
  const shipping = subtotal > 5000 ? 0 : subtotal > 0 ? 300 : 0;
  const total = subtotal + shipping;

  if (!items.length) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-5 py-20">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-brand-primary-light/20 grid place-items-center mb-6">
            <ShoppingBag size={40} className="text-brand-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Add some products to get started!</p>
          <Link href="/shop" className="inline-block bg-brand-primary text-white font-semibold px-8 py-4 rounded-full hover:-translate-y-1 transition">
            Browse Products →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-5 py-5 border-b border-gray-100 last:border-0">
              <div className="w-[110px] h-[110px] relative rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill sizes="110px" className="object-cover" unoptimized />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-lg mb-2">{item.name}</h3>
                <div className="text-brand-dark font-bold text-xl mb-3">
                  PKR {item.price.toLocaleString()}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQty(item.id, item.quantity - 1)} className="w-9 h-9 grid place-items-center hover:bg-brand-primary-light/20">
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => setQty(item.id, item.quantity + 1)} className="w-9 h-9 grid place-items-center hover:bg-brand-primary-light/20">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-brand-accent hover:text-brand-accent-dark p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right font-display font-bold text-lg whitespace-nowrap">
                PKR {(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="font-display font-bold text-xl mb-5">Order Summary</h2>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-semibold">PKR {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-3 text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold">{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
          </div>
          {subtotal > 0 && subtotal <= 5000 && (
            <div className="bg-brand-primary-light/15 border-l-4 border-brand-primary text-xs text-gray-700 p-3 rounded my-3">
              Add <strong>PKR {(5000 - subtotal).toLocaleString()}</strong> more for FREE shipping.
            </div>
          )}
          <div className="flex justify-between pt-4 mt-4 border-t-2 border-gray-100 text-lg font-display font-bold">
            <span>Total</span>
            <span className="text-brand-dark">PKR {total.toLocaleString()}</span>
          </div>
          <Link href="/checkout" className="w-full mt-6 bg-brand-primary text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition">
            Proceed to Checkout <ArrowRight size={16} />
          </Link>
          <Link href="/shop" className="block text-center text-sm text-gray-500 hover:text-brand-primary mt-4">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
