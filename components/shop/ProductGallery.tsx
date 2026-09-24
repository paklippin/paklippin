'use client';
import { useEffect, useState } from 'react';
import ProductBox3D from '@/components/3d/ProductBox3D';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

type GalleryImage = { id: string; url: string; sort_order: number };

export default function ProductGallery({
  productId,
  fallbackImage,
  productName,
  fallbackEmoji,
}: {
  productId: number;
  fallbackImage?: string;
  productName: string;
  fallbackEmoji?: string;
}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/products/${productId}/gallery`, { cache: 'no-store' });
        const data = await res.json();
        let list: GalleryImage[] = Array.isArray(data.images) ? data.images : [];
        // If no gallery images but we have a fallback, use that
        if (list.length === 0 && fallbackImage) {
          list = [{ id: 'fallback', url: fallbackImage, sort_order: 0 }];
        }
        setImages(list);
      } catch {}
      setLoading(false);
    })();
  }, [productId, fallbackImage]);

  const imgSrc = (url: string) =>
    url.startsWith('http') ? url : `${API_BASE}${url}`;

  // No images at all — show 3D cube
  if (!loading && images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-brand-secondary">
        <ProductBox3D />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-brand-secondary">
      {/* Main image */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {loading ? (
          <div className="text-text-secondary text-sm">Loading...</div>
        ) : (
          <img
            src={imgSrc(images[activeIdx].url)}
            alt={productName}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
        )}

        {/* Left / Right arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-lg"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-lg"
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
            {activeIdx + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-white border-t border-border">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                idx === activeIdx ? 'border-brand-accent' : 'border-transparent hover:border-border'
              }`}
            >
              <img src={imgSrc(img.url)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
