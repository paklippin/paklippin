export const metadata = { title: 'Returns & Refunds — PAKLIPPIN' };
export default function ReturnsPage() {
  return (
    <div className="max-w-[860px] mx-auto px-5 py-12">
      <h1 className="font-display font-bold text-4xl mb-3">Returns &amp; Refunds</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: 23 September 2026</p>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4 text-gray-700 text-[15px] leading-relaxed">
        <h2 className="font-display font-bold text-lg text-brand-dark">Return Window</h2>
        <p>7 days from delivery.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">Eligible</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Defective or damaged items</li>
          <li>Wrong product delivered</li>
          <li>Unused items in original packaging</li>
        </ul>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">Refund</h2>
        <p>7–14 business days to your EasyPaisa account.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">Contact</h2>
        <p>info@paklippin.com · +92 339 7579547</p>
      </div>
    </div>
  );
}
