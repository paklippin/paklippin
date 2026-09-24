'use client';
export default function Toast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-brand-primary text-white px-8 py-3.5 rounded-lg shadow-lg z-[4000] text-sm transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
}
