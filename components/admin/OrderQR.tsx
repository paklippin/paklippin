'use client';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy } from 'lucide-react';

export type QROrder = {
  id: string;
  date?: string;
  status?: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  customer?: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    notes?: string;
  };
  payment?: { method: string; txnId: string; amount: number };
};

export function buildQRPayload(order: QROrder): string {
  const c = order.customer;
  const itemsLine = order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ');
  return [
    'PAKLIPPIN ORDER',
    `Order: ${order.id}`,
    `Name: ${c?.name || '—'}`,
    `Phone: ${c?.phone || '—'}`,
    `Address: ${c?.address || '—'}${c?.city ? `, ${c.city}` : ''}`,
    `Items: ${itemsLine || '—'}`,
    `Payment: ${order.payment?.method || 'EasyPaisa'}${order.payment?.txnId ? ` (TID: ${order.payment.txnId})` : ''}`,
    `Total: Rs ${order.total.toLocaleString()}`,
    c?.notes ? `Notes: ${c.notes}` : null,
  ].filter(Boolean).join('\n');
}

export default function OrderQR({
  order,
  size = 110,
  interactive = false,
}: {
  order: QROrder;
  size?: number;
  interactive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const payload = buildQRPayload(order);

  return (
    <>
      <div
        onClick={() => interactive && setOpen(true)}
        className={`bg-white p-2 rounded-xl border border-border inline-block ${interactive ? 'cursor-pointer hover:border-brand-accent transition' : ''}`}
      >
        <QRCodeSVG value={payload} size={size} level="M" bgColor="#FFFFFF" fgColor="#1A1A1A" />
        {interactive && (
          <div className="text-[10px] text-center text-text-secondary mt-1 font-semibold">
            Tap to enlarge
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-[3000] flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 max-w-[420px] w-full text-center relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-brand-secondary flex items-center justify-center"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="text-xs uppercase tracking-wider text-text-secondary mb-1 font-semibold">
              Delivery QR
            </div>
            <div className="font-bold text-lg mb-1">{order.id}</div>
            <p className="text-xs text-text-secondary mb-4">Show this to the courier</p>

            <div className="flex justify-center mb-4">
              <QRCodeSVG value={payload} size={280} level="M" bgColor="#FFFFFF" fgColor="#1A1A1A" />
            </div>

            <button
              onClick={() => navigator.clipboard.writeText(payload).catch(() => {})}
              className="w-full py-2.5 bg-brand-secondary rounded-lg text-xs font-semibold flex items-center justify-center gap-2 mb-4"
            >
              <Copy size={13} /> Copy details
            </button>

            <div className="text-left text-xs space-y-1.5 bg-brand-secondary rounded-xl p-4">
              <div><strong>Name:</strong> {order.customer?.name || '—'}</div>
              <div><strong>Phone:</strong> {order.customer?.phone || '—'}</div>
              <div><strong>Address:</strong> {order.customer?.address || '—'}{order.customer?.city ? `, ${order.customer.city}` : ''}</div>
              <div><strong>Items:</strong> {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ') || '—'}</div>
              <div><strong>Total:</strong> Rs {order.total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
