'use client';
import ProductImageManager from '@/components/admin/ProductImageManager';

export default function AdminMediaPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Media Library</h1>
        <p className="text-sm text-text-secondary">
          Upload and manage product images stored in R2.
        </p>
      </div>
      <ProductImageManager />
    </div>
  );
}
