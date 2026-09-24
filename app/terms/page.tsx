export const metadata = { title: 'Terms & Conditions — PAKLIPPIN' };
export default function TermsPage() {
  return (
    <div className="max-w-[860px] mx-auto px-5 py-12">
      <h1 className="font-display font-bold text-4xl mb-3">Terms &amp; Conditions</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: 23 September 2026</p>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4 text-gray-700 text-[15px] leading-relaxed">
        <p>Welcome to <strong>PAKLIPPIN (SMC-PRIVATE) LIMITED</strong>. By using paklippin.com you agree to these Terms.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">1. About Us</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>PAKLIPPIN (SMC-PRIVATE) LIMITED</li>
          <li>Hajvari Rd, Faisalabad, Pakistan</li>
          <li>FBR: J756870 · SECP: 0352216 · PSW: UN-00-J756870</li>
        </ul>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">2. Payment</h2>
        <p>EasyPaisa only: <strong>0339 7910131</strong> (Shouaib Imran). No Cash on Delivery.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">3. Shipping</h2>
        <p>Rs 300 flat. Free over Rs 5,000. Same-day in Faisalabad.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">4. Returns</h2>
        <p>7-day returns on unused items. Refunds in 7–14 business days.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">5. Contact</h2>
        <p>info@paklippin.com · +92 339 7579547</p>
      </div>
    </div>
  );
}
