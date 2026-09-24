'use client';
import { useState } from 'react';

export default function NoticeBar() {
  const [show, setShow] = useState(true);
  if (!show) return null;

  return (
    <div className="bg-brand-primary text-white text-xs sm:text-sm px-4 py-2 relative">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-3 flex-wrap text-center">
        <span>🚚 Free shipping over Rs 5,000</span>
        <span className="text-brand-accent">•</span>
        <span>Delivery charges Rs 300</span>
        <span className="text-brand-accent">•</span>
        <span>🔐 Login/Register required for payment</span>
      </div>
      <button
        onClick={() => setShow(false)}
        aria-label="Dismiss notice"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
