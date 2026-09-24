'use client';
import { useEffect, useState } from 'react';
import { Check, X, Trash2, Star } from 'lucide-react';

type Review = {
  id: string;
  product_id: number;
  customer_email: string;
  customer_name: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const url = tab === 'all' ? '/api/admin/reviews' : `/api/admin/reviews?status=${tab}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      if (data.counts) setCounts(data.counts);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [tab]);

  const setStatus = async (id: string, status: string) => {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: status as any } : r));
    await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setTimeout(load, 400);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    setTimeout(load, 400);
  };

  const starDisplay = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Reviews</h1>
        <p className="text-sm text-text-secondary">Moderate customer reviews before they appear on the storefront</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {([
          ['pending', 'Pending', counts.pending],
          ['approved', 'Approved', counts.approved],
          ['rejected', 'Rejected', counts.rejected],
          ['all', 'All', counts.pending + counts.approved + counts.rejected],
        ] as const).map(([key, label, n]) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
              tab === key
                ? 'bg-brand-accent text-white'
                : 'bg-white border-2 border-border text-text-secondary hover:border-brand-accent hover:text-brand-accent'
            }`}
          >
            {label} ({n})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-text-secondary text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <Star size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-text-secondary">No {tab === 'all' ? '' : tab} reviews</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-border rounded-2xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-sm">{r.customer_name || 'Customer'}</div>
                  <div className="text-[10px] text-text-secondary">{r.customer_email}</div>
                  <div className="text-[10px] text-text-secondary">
                    Product #{r.product_id} · {new Date(r.created_at).toLocaleDateString('en-PK')}
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  r.status === 'approved' ? 'bg-green-100 text-green-700' :
                  r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-orange-100 text-orange-700'
                }`}>{r.status}</span>
              </div>

              <div className="text-[#ffc107] text-base mb-2">{starDisplay(r.rating)}</div>
              {r.comment && (
                <p className="text-sm text-text-secondary mb-4 leading-relaxed line-clamp-3">{r.comment}</p>
              )}

              <div className="flex gap-2 pt-3 border-t border-border">
                {r.status !== 'approved' && (
                  <button onClick={() => setStatus(r.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition">
                    <Check size={12} /> Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button onClick={() => setStatus(r.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 transition">
                    <X size={12} /> Reject
                  </button>
                )}
                <button onClick={() => remove(r.id)}
                  className="px-3 py-2 rounded-lg border-2 border-border text-red-500 hover:border-red-500 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
