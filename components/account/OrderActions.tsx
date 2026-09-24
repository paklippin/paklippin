'use client';
import { useState } from 'react';
import { X, RotateCcw, Ban, AlertCircle, Send, Loader2 } from 'lucide-react';

type Action = {
  key: string;
  label: string;
  status: string;
  icon: any;
  color: string;
  hint: string;
};

const ACTIONS: Action[] = [
  { key: 'cancel',  label: 'Cancel Order',  status: 'cancelled',  icon: Ban,          color: 'red',    hint: 'Cancel this order before it ships' },
  { key: 'refuse',  label: 'Refuse Order',  status: 'refused',    icon: X,            color: 'orange', hint: 'Refuse delivery at the door' },
  { key: 'return',  label: 'Return',        status: 'returned',   icon: RotateCcw,    color: 'blue',   hint: 'Request a return within 7 days' },
  { key: 'refund',  label: 'Refund',        status: 'refunded',   icon: AlertCircle,  color: 'purple', hint: 'Request a refund' },
];

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
  refused:   { label: 'Refused',   color: 'bg-orange-100 text-orange-700' },
  returned:  { label: 'Returned',  color: 'bg-blue-100 text-blue-700' },
  refunded:  { label: 'Refunded',  color: 'bg-purple-100 text-purple-700' },
};

export default function OrderActions({
  orderId,
  currentStatus,
  onUpdate,
}: {
  orderId: string;
  currentStatus: string;
  onUpdate: () => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const current = (currentStatus || '').toLowerCase();
  const locked = ['cancelled', 'refused', 'returned', 'refunded', 'delivered'].includes(current);

  const submit = async (action: Action) => {
    if (!note.trim()) { setError('Please add a reason'); return; }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action.status,
          note: note.trim(),
          by: 'customer',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setOpen(null);
      setNote('');
      onUpdate();
    } catch {
      setError('Could not submit. Try again.');
    }
    setBusy(false);
  };

  if (locked) {
    const meta = STATUS_MAP[current];
    return (
      <div className="pt-3 mt-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-full font-semibold uppercase ${meta?.color || 'bg-gray-100 text-gray-700'}`}>
            {meta?.label || currentStatus}
          </span>
          <span className="text-text-secondary">This order can no longer be changed</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-3 mt-3 border-t border-border">
      <div className="text-[10px] uppercase tracking-wider font-semibold text-text-secondary mb-2">
        Manage this order
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.key}
              onClick={() => { setOpen(a.key); setNote(''); setError(''); }}
              className="flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 border-border text-xs font-semibold hover:border-brand-accent hover:text-brand-accent transition"
              title={a.hint}
            >
              <Icon size={12} /> {a.label}
            </button>
          );
        })}
      </div>

      {/* Note modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 z-[3000] flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl max-w-[440px] w-full p-6 relative">
            <button onClick={() => setOpen(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center">
              <X size={16} />
            </button>
            {(() => {
              const a = ACTIONS.find((x) => x.key === open)!;
              const Icon = a.icon;
              return (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={18} className="text-brand-accent" />
                    <h3 className="font-bold text-lg">{a.label}</h3>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">{a.hint}</p>

                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                    Reason / note *
                  </label>
                  <textarea
                    id={`order-note-${open}`}
                    name="orderNote"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={`e.g. ${a.key === 'cancel' ? 'Changed my mind' : a.key === 'refund' ? 'Product not as described' : 'Size does not fit'}`}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm resize-none"
                    autoFocus
                  />

                  {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => setOpen(null)}
                      className="flex-1 py-2.5 rounded-lg border-2 border-border font-semibold text-sm hover:border-brand-accent transition">
                      Cancel
                    </button>
                    <button onClick={() => submit(a)} disabled={busy || !note.trim()}
                      className="flex-1 py-2.5 rounded-lg bg-brand-accent text-white font-semibold text-sm hover:bg-[#e55a2b] transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                      {busy ? <><Loader2 size={13} className="animate-spin" /> Sending...</> : <><Send size={13} /> Confirm</>}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
