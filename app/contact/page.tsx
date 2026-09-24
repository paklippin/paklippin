export const metadata = { title: 'Contact — PAKLIPPIN' };

export default function ContactPage() {
  return (
    <div className="max-w-[1000px] mx-auto px-[5%] py-12">
      <h1 className="text-4xl font-bold mb-3 text-center">Contact Us</h1>
      <p className="text-text-secondary text-center mb-12">
        We&apos;d love to hear from you. Reach out through any channel below.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <a href="tel:+923397579547" className="bg-white border border-border rounded-2xl p-6 text-center hover:border-brand-accent transition">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-orange-50 flex items-center justify-center text-2xl">📞</div>
          <div className="font-bold mb-1">Phone</div>
          <div className="text-sm text-text-secondary">+92 339 7579547</div>
        </a>
        <a href="https://wa.me/923397579547" target="_blank" rel="noopener noreferrer"
           className="bg-white border border-border rounded-2xl p-6 text-center hover:border-brand-accent transition">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center text-2xl">💬</div>
          <div className="font-bold mb-1">WhatsApp</div>
          <div className="text-sm text-text-secondary">Chat 24/7</div>
        </a>
        <a href="mailto:info@paklippin.com" className="bg-white border border-border rounded-2xl p-6 text-center hover:border-brand-accent transition">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-50 flex items-center justify-center text-2xl">✉️</div>
          <div className="font-bold mb-1">Email</div>
          <div className="text-sm text-text-secondary">info@paklippin.com</div>
        </a>
        <div className="bg-white border border-border rounded-2xl p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-purple-50 flex items-center justify-center text-2xl">📍</div>
          <div className="font-bold mb-1">Address</div>
          <div className="text-sm text-text-secondary">Hajvari Rd, Faisalabad</div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-5">Send us a message</h2>
        <form
          action="https://formsubmit.co/info@paklippin.com"
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="_subject" value="New contact from PAKLIPPIN website" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Name</label>
              <input id="contact-name" name="name" autoComplete="name" required
                className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Email</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" required
                className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Subject</label>
            <input id="contact-subject" name="subject" required
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Message</label>
            <textarea id="contact-message" name="message" rows={5} required
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm resize-none" />
          </div>
          <button type="submit" className="w-full bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition">
            Send Message
          </button>
        </form>
      </div>

      <div className="mt-8 bg-brand-secondary rounded-2xl p-6 text-center text-sm text-text-secondary">
        <p className="font-semibold text-text-primary mb-2">Business Hours</p>
        <p>Mon–Sat: 9 AM – 9 PM · Sunday: 12 PM – 6 PM</p>
        <p className="mt-2 text-xs">We respond to all messages within 1 hour during business hours.</p>
      </div>
    </div>
  );
}
