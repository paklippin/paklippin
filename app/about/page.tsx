export const metadata = { title: 'About Us — PAKLIPPIN' };

export default function AboutPage() {
  return (
    <div className="max-w-[900px] mx-auto px-5 py-12">
      <div className="text-center mb-10">
        <div className="inline-block bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-4">About Us</div>
        <h1 className="font-display font-bold text-[clamp(2rem,4vw,3rem)] tracking-tighter mb-3">We&apos;re PAKLIPPIN</h1>
        <p className="text-gray-500">Pakistan&apos;s trusted online store — built with care.</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 leading-relaxed text-gray-700 space-y-5">
        <p>PAKLIPPIN (SMC-PRIVATE) LIMITED is Pakistan&apos;s trusted online shopping destination. We offer quality products, fast delivery across Pakistan, and excellent customer service.</p>
        <h2 className="font-display font-bold text-xl text-brand-dark pt-4">Our Mission</h2>
        <p>To provide a seamless online shopping experience with genuine products, competitive prices, and reliable delivery.</p>
        <h2 className="font-display font-bold text-xl text-brand-dark pt-4">Company Registrations</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>FBR:</strong> J756870</li>
          <li><strong>SECP:</strong> 0352216</li>
          <li><strong>PSW:</strong> UN-00-J756870</li>
        </ul>
        <h2 className="font-display font-bold text-xl text-brand-dark pt-4">Contact</h2>
        <p>📍 Hajvari Rd, Faisalabad, Pakistan<br />📞 +92 339 7579547<br />✉️ info@paklippin.com</p>
      </div>
    </div>
  );
}
