'use client';
import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Loader2, Check } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/components/shop/ProductCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export default function ProductImageManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [imageMap, setImageMap] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [justSaved, setJustSaved] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [list, imgs] = await Promise.all([
      fetchProducts(),
      fetch('/api/product-images', { cache: 'no-store' }).then((r) => r.json()).catch(() => ({ images: {} })),
    ]);
    setProducts(list);
    setImageMap(imgs.images || {});
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (productId: number, file: File) => {
    setBusy(productId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const upRes = await fetch('/api/upload?folder=products', { method: 'POST', body: fd });
      const upData = await upRes.json();
      if (!upData.ok || !upData.url) throw new Error('upload failed');

      const mapRes = await fetch('/api/product-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, key: upData.key, url: upData.url }),
      });
      const mapData = await mapRes.json();
      if (!mapData.ok) throw new Error('save failed');

      setImageMap((prev) => ({ ...prev, [productId]: upData.url }));
      setJustSaved(productId);
      setTimeout(() => setJustSaved(null), 2000);
    } catch (e) {
      alert('Upload failed: ' + (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Remove this image?')) return;
    setBusy(productId);
    try {
      await fetch(`/api/product-images?id=${productId}`, { method: 'DELETE' });
      setImageMap((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch {}
    setBusy(null);
  };

  if (loading) return <p className="text-text-secondary text-sm">Loading products...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((p) => {
        const imgUrl = imageMap[p.id];
        const isBusy = busy === p.id;
        const isDone = justSaved === p.id;
        return (
          <div key={p.id} className="bg-white border border-border rounded-2xl p-3">
            <div className="relative h-[180px] bg-brand-secondary rounded-xl overflow-hidden mb-3">
              {imgUrl ? (
                <>
                  <img src={`${API_BASE}${imgUrl}`} alt={p.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-red-500 hover:text-white flex items-center justify-center shadow transition"
                    title="Remove image"
                    disabled={isBusy}
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">{p.emoji}</div>
              )}
              {isBusy && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-brand-accent" />
                </div>
              )}
              {isDone && !isBusy && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Check size={36} className="text-green-600" />
                </div>
              )}
            </div>

            <div className="text-xs font-semibold text-text-primary truncate mb-1">{p.name}</div>
            <div className="text-[11px] text-text-secondary mb-2">#{p.id} · {p.category}</div>

            <label className="block">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={isBusy}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(p.id, file);
                  e.target.value = '';
                }}
              />
              <span className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
                isBusy ? 'bg-brand-secondary text-text-secondary cursor-not-allowed'
                       : 'bg-brand-accent text-white hover:bg-[#e55a2b]'
              }`}>
                <Upload size={12} /> {imgUrl ? 'Replace' : 'Upload'}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
