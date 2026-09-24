export const metadata = { title: 'Shipping Policy — PAKLIPPIN' };
export default function ShippingPage() {
  return (
    <div className="max-w-[860px] mx-auto px-5 py-12">
      <h1 className="font-display font-bold text-4xl mb-3">Shipping Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: 23 September 2026</p>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4 text-gray-700 text-[15px] leading-relaxed">
        <h2 className="font-display font-bold text-lg text-brand-dark">Shipping Charges</h2>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-brand-primary-light/20"><th className="text-left p-3">Order Value</th><th className="text-left p-3">Fee</th></tr></thead>
          <tbody>
            <tr><td className="p-3 border-b">Under Rs 5,000</td><td className="p-3 border-b">Rs 300</td></tr>
            <tr><td className="p-3">Rs 5,000+</td><td className="p-3"><strong>FREE</strong></td></tr>
          </tbody>
        </table>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-4">Delivery Time</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Faisalabad:</strong> Same-day</li>
          <li><strong>Karachi, Lahore, Islamabad:</strong> 3–5 days</li>
          <li><strong>Other cities:</strong> 5–7 days</li>
          <li><strong>Remote areas:</strong> 7–10 days</li>
        </ul>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-4">Tracking</h2>
        <p>Track anytime from My Account → Track Order.</p>
      </div>
    </div>
  );
}
