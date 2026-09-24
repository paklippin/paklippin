export const metadata = {
  title: 'About Us — PAKLIPPIN',
  description: 'Pakistan\'s trusted online store. Quality products, fast delivery, excellent service.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">About PAKLIPPIN</h1>
      <p className="text-text-secondary text-center mb-12">
        Pakistan&apos;s trusted online store — serving customers since 2026
      </p>

      <div className="prose max-w-none space-y-6 text-text-primary">
        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            PAKLIPPIN was founded with one mission: to make quality products accessible to every Pakistani household.
            From our base in Faisalabad, we curate products that combine value, reliability, and style —
            delivered straight to your door.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We&apos;re proud to be a registered company — <strong>SECP 0352216</strong>, <strong>FBR J756870</strong>, and
            <strong> PSW UN-00-J756870</strong> — committed to transparent, honest service you can trust.
          </p>
        </section>

        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Genuine products at competitive prices</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Free shipping on orders over Rs 5,000</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Same-day delivery in Faisalabad</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Secure EasyPaisa payments</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> 24/7 customer support via WhatsApp and phone</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Easy returns within 7 days</li>
          </ul>
        </section>

        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Our Promise</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold mb-1">Quality</div>
              <p className="text-xs text-text-secondary">Every product is checked before shipping</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="font-bold mb-1">Speed</div>
              <p className="text-xs text-text-secondary">Fast processing and delivery</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <div className="font-bold mb-1">Trust</div>
              <p className="text-xs text-text-secondary">Secure payments and buyer protection</p>
            </div>
          </div>
        </section>

        <section className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
          <p className="text-text-secondary mb-4">
            Questions? We&apos;re here to help 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="tel:+923397579547" className="px-6 py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition">
              📞 Call Us
            </a>
            <a href="https://wa.me/923397579547" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition">
              💬 WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
