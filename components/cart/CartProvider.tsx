'use client';
import { useEffect, useState } from 'react';
import CartSidebar, { type CartItem } from './CartSidebar';
import { useUI } from '@/lib/ui-store';

export default function CartProvider() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cartOpen  = useUI((s) => s.cartOpen);
  const closeCart = useUI((s) => s.closeCart);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.location.host.startsWith('admin.')) setIsAdmin(true);
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    const read = () => {
      try {
        const raw = localStorage.getItem('cart-storage');
        if (raw) {
          const data = JSON.parse(raw);
          const list = data?.state?.items || data?.items || [];
          setItems(Array.isArray(list) ? list : []);
        } else setItems([]);
      } catch { setItems([]); }
    };
    read();
    const id = setInterval(read, 600);
    window.addEventListener('storage', read);
    return () => { clearInterval(id); window.removeEventListener('storage', read); };
  }, [isAdmin]);

  const persist = (next: CartItem[]) => {
    try { localStorage.setItem('cart-storage', JSON.stringify({ state: { items: next }, version: 0 })); } catch {}
    window.dispatchEvent(new Event('storage'));
    setItems(next);
  };

  const updateQty = (id: number, delta: number) => {
    persist(items.map((x) => x.id === id ? { ...x, quantity: x.quantity + delta } : x).filter((x) => x.quantity > 0));
  };

  const removeItem = (id: number) => persist(items.filter((x) => x.id !== id));

  if (!mounted || isAdmin) return null;

  return <CartSidebar open={cartOpen} items={items} onClose={closeCart} onQty={updateQty} onRemove={removeItem} />;
}
