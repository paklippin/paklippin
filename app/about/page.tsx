export const metadata = {
  title: 'About Us — PAKLIPPIN',
  description: 'Pakistan\'s trusted online store. A registered private limited company with SECP, FBR, and PSW credentials.',
};

export default function AboutPage() {
  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <h1 className="text-4xl font-bold mb-4 text-center">About PAKLIPPIN</h1>
      <p className="text-text-secondary text-center mb-12">
        A registered Pakistani company delivering quality products nationwide
      </p>

      <div className="space-y-6">

        {/* OUR STORY */}
        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            PAKLIPPIN was founded in 2026 with a simple mission: make quality products accessible to
            every Pakistani household at fair prices. From our base in Faisalabad, we curate products
            that combine value, reliability, and style — delivered straight to your door.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We&apos;re proud to be a fully registered private limited company with
            <strong> SECP</strong>, <strong>FBR</strong>, and <strong>PSW</strong> credentials —
            committed to transparent, honest service you can trust.
          </p>
        </section>

        {/* COMPANY CREDENTIALS */}
        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-5">Official Registration</h2>
          <p className="text-sm text-text-secondary mb-5">
            PAKLIPPIN is a legally registered company in Pakistan. All credentials are verifiable
            through the relevant government portals.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-brand-accent mb-1">
                Company Name
              </div>
              <div className="font-semibold text-sm">PAKLIPPIN (SMC-PRIVATE) LIMITED</div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-brand-accent mb-1">
                Incorporated
              </div>
              <div className="font-semibold text-sm">24 August 2026</div>
            </div>

            <div className="bg-white border-2 border-border rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                SECP Registration
              </div>
              <div className="font-mono font-semibold text-sm">CUIN 0352216</div>
            </div>

            <div className="bg-white border-2 border-border rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                FBR NTN
              </div>
              <div className="font-mono font-semibold text-sm">J756870</div>
              <div className="text-[10px] text-green-600 font-semibold mt-1">
                ✅ Active Filer (ATL)
              </div>
            </div>

            <div className="bg-white border-2 border-border rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                PSW License
              </div>
              <div className="font-mono font-semibold text-sm">UN-00-J756870</div>
            </div>

            <div className="bg-white border-2 border-border rounded-xl p-4">
              <div className="text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1">
                Registered Office
              </div>
              <div className="text-xs font-medium leading-snug">
                P 7585, St No. 3, Hijvary Park<br />
                Mansoorabad, Faisalabad
              </div>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border text-xs text-text-secondary">
            <div className="font-semibold mb-2">Verification Links:</div>
            <div className="space-y-1">
              <div>
                🔗 SECP: <a
                  href="https://leap.secp.gov.pk/#/verify-company-info/0352216"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-accent hover:underline font-mono"
                >leap.secp.gov.pk → 0352216</a>
              </div>
              <div>
                🔗 FBR ATL: <a
                  href="https://www.fbr.gov.pk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-accent hover:underline"
                >fbr.gov.pk → ATL → J756870</a>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE OFFER */}
        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-5">What We Offer</h2>
          <ul className="space-y-3 text-text-secondary text-sm">
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Genuine products at competitive prices</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Free shipping on orders over Rs 5,000</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Same-day delivery in Faisalabad (before 2 PM)</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Nationwide delivery in 2–4 business days</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> Secure EasyPaisa payments</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> 24/7 customer support via WhatsApp and phone</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> 7-day easy returns & refunds</li>
            <li className="flex gap-3"><span className="text-brand-accent font-bold">✓</span> QR-coded delivery slips for verified handoff</li>
          </ul>
        </section>

        {/* OUR PROMISE */}
        <section className="bg-white border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Our Promise</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold mb-1">Quality</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Every product is inspected before dispatch
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="font-bold mb-1">Speed</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Same-day delivery in Faisalabad
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤝</div>
              <div className="font-bold mb-1">Trust</div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Registered company, secure payments
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Get in Touch</h2>
          <p className="text-text-secondary text-sm mb-5">
            Questions? We&apos;re here to help 24/7.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 mb-5 text-sm">
            <div className="bg-white rounded-xl p-3">
              <div className="text-lg mb-1">📞</div>
              <div className="font-semibold text-xs">Phone</div>
              <a href="tel:+923397579547" className="text-brand-accent hover:underline text-xs font-mono">
                +92 339 7579547
              </a>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="text-lg mb-1">✉️</div>
              <div className="font-semibold text-xs">Email</div>
              <a href="mailto:info@paklippin.com" className="text-brand-accent hover:underline text-xs font-mono">
                info@paklippin.com
              </a>
            </div>
            <div className="bg-white rounded-xl p-3">
              <div className="text-lg mb-1">📍</div>
              <div className="font-semibold text-xs">Office</div>
              <div className="text-xs text-text-secondary">Faisalabad, Pakistan</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+923397579547"
              className="px-6 py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition text-sm"
            >
              📞 Call Us
            </a>
            <a
              href="https://wa.me/923397579547"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#1da851] transition text-sm"
            >
              💬 WhatsApp
            </a>
            <a
              href="/contact"
              className="px-6 py-3 bg-white border-2 border-border text-text-primary rounded-xl font-semibold hover:border-brand-accent transition text-sm"
            >
              📧 Send Message
            </a>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="text-center py-6">
          <div className="text-xs text-text-secondary">
            <div className="font-semibold mb-2">Verified & Registered</div>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> SECP Registered
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> FBR Active Taxpayer
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600">✓</span> PSW Licensed
              </span>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
