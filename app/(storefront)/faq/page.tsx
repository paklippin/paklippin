export const metadata = { title: 'FAQ — PAKLIPPIN' };

const FAQS = [
  { q: 'How long does delivery take?',
    a: 'Same-day delivery within Faisalabad for orders placed before 2 PM. Nationwide delivery takes 2–4 business days.' },
  { q: 'Is shipping really free?',
    a: 'Yes! Free shipping on all orders over Rs 5,000. Below that, a flat Rs 300 delivery fee applies.' },
  { q: 'What payment methods do you accept?',
    a: 'We accept EasyPaisa only. After placing your order, you\'ll receive EasyPaisa details and need to submit your transaction ID (TID).' },
  { q: 'How do I track my order?',
    a: 'Use the Track Order link in your account. Enter your order ID (e.g. PKL-ABC123) to see live status.' },
  { q: 'What is your return policy?',
    a: 'We offer 7-day returns. Products must be unused, in original packaging. Return shipping is covered for defective items.' },
  { q: 'Can I cancel my order?',
    a: 'Yes — you can cancel any order that hasn\'t shipped yet. Go to My Orders → Cancel Order and provide a reason.' },
  { q: 'Do you offer refunds?',
    a: 'Refunds are processed within 3–5 business days after we receive the returned product. Amount is refunded to your EasyPaisa account.' },
  { q: 'Is my payment secure?',
    a: 'All transactions go through EasyPaisa — Pakistan\'s most trusted mobile payment platform. We never store your payment details.' },
  { q: 'What if I receive a damaged product?',
    a: 'Contact us within 48 hours of delivery with photos. We\'ll send a replacement or issue a full refund immediately.' },
  { q: 'Do you offer bulk/wholesale pricing?',
    a: 'Yes, for orders over Rs 100,000. WhatsApp us at +92 339 7579547 with your requirement.' },
  { q: 'Can I change my delivery address after ordering?',
    a: 'Yes, if the order hasn\'t shipped. Cancel and re-order, or WhatsApp us with the new address and order ID.' },
  { q: 'How do I use a coupon code?',
    a: 'At checkout, enter your code in the "Have a coupon?" field. The discount applies instantly if valid.' },
];

export default function FAQPage() {
  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <h1 className="text-4xl font-bold mb-3 text-center">Frequently Asked Questions</h1>
      <p className="text-text-secondary text-center mb-12">
        Everything you need to know about shopping with PAKLIPPIN
      </p>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <details key={i} className="group bg-white border border-border rounded-2xl overflow-hidden">
            <summary className="cursor-pointer list-none px-6 py-4 flex items-center justify-between gap-4 hover:bg-brand-secondary transition">
              <span className="font-semibold text-sm sm:text-base">{f.q}</span>
              <span className="text-brand-accent text-xl shrink-0 group-open:rotate-45 transition">+</span>
            </summary>
            <div className="px-6 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border pt-4">
              {f.a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
        <h2 className="font-bold text-lg mb-2">Still have questions?</h2>
        <p className="text-sm text-text-secondary mb-4">Our team is available 24/7 to help.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://wa.me/923397579547" target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition">
            💬 Chat on WhatsApp
          </a>
          <a href="/contact" className="px-6 py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition">
            📧 Send Message
          </a>
        </div>
      </div>
    </div>
  );
}
