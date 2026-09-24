'use client';
import { useEffect, useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import { readUser } from '@/lib/user';

type Review = {
  id: string;
  product_id: number;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export default function ReviewSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // form
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, { cache: 'no-store' });
      const data = await res.json();
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setAverage(Number(data.average) || 0);
      setCount(Number(data.count) || 0);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    const user = readUser();
    if (!user) {
      setMsg({ type: 'error', text: 'Please login to submit a review' });
      return;
    }
    if (rating < 1) {
      setMsg({ type: 'error', text: 'Please select a star rating' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          customer_email: user.email,
          customer_name: user.name,
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg({ type: 'success', text: '✓ Review submitted for approval' });
        setRating(0);
        setComment('');
      } else {
        setMsg({ type: 'error', text: data.error || 'Could not submit review' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error' });
    }
    setSubmitting(false);
  };

  const starDisplay = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Customer Reviews</h3>
        {count > 0 && (
          <div className="text-sm">
            <span className="text-[#ffc107]">{'★'.repeat(Math.round(average))}</span>
            <span className="text-text-secondary ml-2">{average} ({count})</span>
          </div>
        )}
      </div>

      {/* Submit form */}
      <form onSubmit={handleSubmit} className="bg-brand-secondary rounded-xl p-4 mb-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Your rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="text-2xl transition"
                aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
              >
                <span className={(hover || rating) >= n ? 'text-[#ffc107]' : 'text-gray-300'}>★</span>
              </button>
            ))}
          </div>
          {rating > 0 && <span className="text-xs text-text-secondary">{rating} of 5</span>}
        </div>

        <textarea
          id="review-comment"
          name="reviewComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm resize-none mb-3"
        />

        {msg.text && (
          <p className={`text-xs mb-3 ${msg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
            {msg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || rating < 1}
          className="w-full flex items-center justify-center gap-2 bg-brand-accent text-white font-semibold py-2.5 rounded-lg hover:bg-[#e55a2b] transition disabled:opacity-50 text-sm"
        >
          {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : <><Send size={14} /> Submit Review</>}
        </button>
      </form>

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-text-secondary text-center py-4">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-4">
          No reviews yet. Be the first to review this product!
        </p>
      ) : (
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-border rounded-xl p-3">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <div className="font-semibold text-sm">{r.customer_name || 'Customer'}</div>
                  <div className="text-[10px] text-text-secondary">
                    {new Date(r.created_at).toLocaleDateString('en-PK')}
                  </div>
                </div>
                <div className="text-[#ffc107] text-sm">{starDisplay(r.rating)}</div>
              </div>
              {r.comment && <p className="text-sm text-text-secondary leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
