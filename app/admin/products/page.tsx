'use client';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Search, Images } from 'lucide-react';
import ProductGalleryManager from '@/components/admin/ProductGalleryManager';

type Product = {
  id: number; name: string; category: string;
  price: number; originalPrice: number; stock: number;
  badge: string; emoji: string; imageUrl: string;
  description: string; active: number;
};

const EMPTY: Omit<Product, 'id'> = {
  name: '', category: 'Electronics', price: 0, originalPrice: 0,
  stock: 100, badge: '', emoji: '📦', imageUrl: '', description: '', active: 1,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', { cache: 'no-store' });
      const json = await res.json();
      setProducts(Array.isArray(json.products) ? json.products : []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, price: p.price,
      originalPrice: p.originalPrice, stock: p.stock, badge: p.badge,
      emoji: p.emoji, imageUrl: p.imageUrl, description: p.description,
      active: p.active,
    });
    setEditing(p);
    setCreating(false);
  };

  const closeModal = () => { setEditing(null); setCreating(false); };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload?folder=products', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.ok && data.url) {
        setForm((f) => ({ ...f, imageUrl: data.url }));
      } else {
        alert('Upload failed');
      }
    } catch { alert('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/products/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      closeModal();
      load();
    } catch { alert('Save failed'); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = products.filter((p) =>
    !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5';

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Products</h1>
          <p className="text-sm text-text-secondary">{products.length} product{products.length !== 1 ? 's' : ''} in catalogue</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-brand-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#e55a2b] transition text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative max-w-[400px] mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or category..."
          className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-border focus:border-brand-accent outline-none text-sm" />
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading products...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <p className="text-text-secondary mb-4">No products found.</p>
          <button onClick={openCreate} className="text-brand-accent font-semibold hover:underline">
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-brand-secondary text-left text-xs uppercase tracking-wider text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-brand-secondary/40">
                  <td className="px-4 py-3">
                    <div className="w-12 h-12 rounded-lg bg-brand-secondary flex items-center justify-center overflow-hidden">
                      {p.imageUrl ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com'}${p.imageUrl}`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">{p.emoji || '📦'}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-sm">{p.name}</div>
                    {p.badge && <span className="inline-block mt-1 text-[10px] font-bold uppercase bg-brand-accent text-white px-2 py-0.5 rounded">{p.badge}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{p.category}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-brand-accent text-sm">Rs {p.price.toLocaleString()}</div>
                    {p.originalPrice > p.price && (
                      <div className="text-xs text-text-secondary line-through">Rs {p.originalPrice.toLocaleString()}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setGalleryProduct(p)}
                        className="p-2 rounded-lg hover:bg-brand-secondary text-text-secondary hover:text-brand-accent transition"
                        title="Manage photos">
                        <Images size={15} />
                      </button>
                      <button onClick={() => openEdit(p)}
                        className="p-2 rounded-lg hover:bg-brand-secondary text-text-secondary hover:text-brand-accent transition" title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition" title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {(editing || creating) && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-center justify-center p-4 overflow-y-auto" onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-[600px] w-full p-6 relative my-8">
            <button onClick={closeModal} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center">
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold mb-5">{editing ? 'Edit Product' : 'Add Product'}</h2>

            {/* Image upload */}
            <div className="mb-4">
              <label className={labelCls}>Image</label>
              <div className="flex gap-3 items-center">
                <div className="w-24 h-24 rounded-xl bg-brand-secondary flex items-center justify-center overflow-hidden shrink-0">
                  {form.imageUrl ? (
                    <img src={`${process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com'}${form.imageUrl}`}
                      alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">{form.emoji || '📦'}</span>
                  )}
                </div>
                <label className="flex-1">
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />
                  <span className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition ${
                    uploading ? 'bg-brand-secondary text-text-secondary' : 'bg-brand-accent text-white hover:bg-[#e55a2b]'
                  }`}>
                    {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : <><Upload size={14} /> Upload Image</>}
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                  {['Electronics','Clothing','Sports','Beauty','Accessories','Home & Living','Books','Toys','Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Badge (optional)</label>
                <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Sale, New, Hot" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Price (Rs) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Original Price (Rs)</label>
                <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Emoji (fallback)</label>
                <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                  placeholder="📦" maxLength={2} className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className={inputCls} />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={closeModal}
                className="flex-1 py-3 rounded-lg border-2 border-border font-semibold hover:border-brand-accent transition text-sm">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || !form.name || !form.price}
                className="flex-1 py-3 rounded-lg bg-brand-accent text-white font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 text-sm">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

      {galleryProduct && (
        <ProductGalleryManager
          productId={galleryProduct.id}
          productName={galleryProduct.name}
          onClose={() => { setGalleryProduct(null); load(); }}
        />
      )}
    </div>
  );
}