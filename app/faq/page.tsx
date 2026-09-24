export const metadata = { title: 'FAQ — PAKLIPPIN' };

const FAQS = [
  { q: 'How can I place an order?', a: 'Browse products → add to cart → register/login → fill shipping info → pay via EasyPaisa → enter your transaction ID → order confirmed.' },
  { q: 'When is my order placed?', a: 'Your order is placed after you confirm payment and submit the EasyPaisa Transaction ID.' },
  { q: 'What payment methods do you accept?', a: 'EasyPaisa only. Send to 0339 7910131 (Shouaib Imran) and enter the Transaction ID at checkout.' },
  { q: 'How long does delivery take?', a: 'Same-day in Faisalabad. 3–5 days in major cities. 5–7 days other areas.' },
  { q: 'What is your shipping charge?', a: 'Rs 300 flat. FREE on orders above Rs 5,000.' },
  { q: 'How do I track my order?', a: 'Log in → My Account → Track Order. Enter your PKL-XXX order ID.' },
  { q: 'What is your return policy?', a: '7-day returns on unused items in original packaging. Refunds within 7–14 business days.' },
  { q: 'How do I contact support?', a: 'Email info@paklippin.com or call +92 339 7579547.' },
];

export default function FAQPage() {
  return (
    <div className="max-w-[800px] mx-auto px-5 py-12">
      <div className="text-center mb-10">
        <div className="inline-block bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">FAQ</div>
        <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] tracking-tighter">Questions? Answered.</h1>
      </div>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <details key={i} className="bg-white border border-gray-100 rounded-2xl p-5 group">
            <summary className="font-display font-semibold cursor-pointer flex justify-between items-center">
              {f.q}
              <span className="text-brand-primary text-xl group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
