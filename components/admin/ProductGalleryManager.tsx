'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Upload, Trash2, Loader2, ImagePlus, GripVertical } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

type GalleryImage = { id: string; url: string; r2_key?: string; sort_order: number };

export default function ProductGalleryManager({
  productId,
  productName,
  onClose,
}: {
  productId: number;
  productName: string;
  onClose: () => void;
}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/gallery`, { cache: 'no-store' });
      const data = await res.json();
      setImages(Array.isArray(data.images) ? data.images : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const list = Array.from(files);
    for (const file of list) {
      try {
        // 1. Upload to R2
        const fd = new FormData();
        fd.append('file', file);
        const upRes = await fetch('/api/upload?folder=products', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (!upData.ok || !upData.url) continue;

        // 2. Attach to product gallery
        await fetch(`/api/admin/products/${productId}/gallery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: upData.url, r2_key: upData.key }),
        });
      } catch (e) {
        console.warn('[gallery upload] failed:', e);
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    setBusy(id);
    try {
      await fetch(`/api/admin/products/${productId}/gallery/${id}`, { method: 'DELETE' });
      setImages((prev) => prev.filter((i) => i.id !== id));
    } catch {}
    setBusy(null);
  };

  const imgSrc = (url: string) => (url.startsWith('http') ? url : `${API_BASE}${url}`);

  return (
    <div className="fixed inset-0 bg-black/70 z-[3000] flex items-center justify-center p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-[720px] w-full max-h-[85vh] overflow-y-auto p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <div className="mb-6 pr-12">
          <h2 className="text-xl font-bold mb-1">Manage Photos</h2>
          <p className="text-xs text-text-secondary">
            {productName} · Product #{productId}
          </p>
        </div>

        {/* Upload zone */}
        <div className="mb-6">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 hover:border-brand-accent hover:bg-orange-50 transition disabled:opacity-50"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-text-secondary">
                <Loader2 size={28} className="animate-spin text-brand-accent" />
                <span className="text-sm font-semibold">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-text-secondary">
                <ImagePlus size={28} className="text-brand-accent" />
                <span className="text-sm font-semibold text-text-primary">Click to upload photos</span>
                <span className="text-xs">Select multiple images at once (JPG, PNG, WEBP)</span>
              </div>
            )}
          </button>
        </div>

        {/* Gallery grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">
              {images.length} photo{images.length !== 1 ? 's' : ''}
            </h3>
            {images.length > 0 && (
              <span className="text-[11px] text-text-secondary">First photo = main product image</span>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-text-secondary text-center py-8">Loading...</p>
          ) : images.length === 0 ? (
            <p className="text-sm text-text-secondary text-center py-8 bg-brand-secondary rounded-xl">
              No photos yet — upload one above
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-border group"
                >
                  <img src={imgSrc(img.url)} alt="" className="w-full h-full object-cover" />

                  {/* Index badge */}
                  <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {idx === 0 ? 'MAIN' : idx + 1}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={busy === img.id}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 hover:bg-red-500 hover:text-white flex items-center justify-center shadow transition disabled:opacity-50"
                  >
                    {busy === img.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-brand-accent text-white font-semibold text-sm hover:bg-[#e55a2b] transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
