export const metadata = { title: 'Privacy Policy — PAKLIPPIN' };
export default function PrivacyPage() {
  return (
    <div className="max-w-[860px] mx-auto px-5 py-12">
      <h1 className="font-display font-bold text-4xl mb-3">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: 23 September 2026</p>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 space-y-4 text-gray-700 text-[15px] leading-relaxed">
        <p>PAKLIPPIN (SMC-PRIVATE) LIMITED respects your privacy.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">Information We Collect</h2>
        <p>Name, email, phone, delivery address, EasyPaisa TID.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">How We Use It</h2>
        <p>To process orders, deliver, provide support, prevent fraud.</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">Sharing</h2>
        <p>We never sell your data. Shared only with courier partners and Cloudflare (our host).</p>
        <h2 className="font-display font-bold text-lg text-brand-dark pt-3">Contact</h2>
        <p>info@paklippin.com</p>
      </div>
    </div>
  );
}
