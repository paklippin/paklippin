export const metadata = { title: 'Contact Us — PAKLIPPIN' };

export default function ContactPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-12">
      <div className="text-center mb-10">
        <div className="inline-block bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">Contact</div>
        <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] tracking-tighter mb-3">Get in Touch</h1>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">📞</div>
          <h3 className="font-display font-bold mb-2">Phone</h3>
          <a href="tel:+923397579547" className="text-brand-primary hover:underline">+92 339 7579547</a>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="font-display font-bold mb-2">Email</h3>
          <a href="mailto:info@paklippin.com" className="text-brand-primary hover:underline">info@paklippin.com</a>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">📍</div>
          <h3 className="font-display font-bold mb-2">Address</h3>
          <p className="text-gray-600 text-sm">Hajvari Rd, Faisalabad, Pakistan</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <div className="text-3xl mb-3">🕐</div>
          <h3 className="font-display font-bold mb-2">Hours</h3>
          <p className="text-gray-600 text-sm">Mon–Sat: 9 AM – 9 PM</p>
        </div>
      </div>
    </div>
  );
}
