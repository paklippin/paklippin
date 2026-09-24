import Link from 'next/link';
export default function Footer() {
  const quickLinks = [
    { href:'/shop', label:'All Products' },
    { href:'/categories', label:'Categories' },
    { href:'/new-arrivals', label:'New Arrivals' },
    { href:'/sale', label:'Sale' },
    { href:'/account', label:'Wishlist' },
  ];
  const companyLinks = [
    { href:'/about', label:'About Us' },
    { href:'/contact', label:'Contact Us' },
    { href:'/faq', label:'FAQ' },
    { href:'/terms', label:'Terms & Conditions' },
    { href:'/privacy', label:'Privacy Policy' },
  ];
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 px-[5%]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-bold mb-5">PAKLIPPIN</h3>
          <p className="text-[#aaa] text-sm leading-relaxed mb-5">Pakistan&apos;s trusted online store. Quality products, fast delivery, excellent service.</p>
          <div className="flex gap-3">
            {['📘','📷','🐦','📺'].map((icon) => (
              <a key={icon} href="#" className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center hover:bg-brand-accent hover:-translate-y-0.5 transition">{icon}</a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((l) => (<li key={l.label}><Link href={l.href} className="text-[#aaa] text-sm hover:text-brand-accent transition">{l.label}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-5">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((l) => (<li key={l.label}><Link href={l.href} className="text-[#aaa] text-sm hover:text-brand-accent transition">{l.label}</Link></li>))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold mb-5">Contact Us</h3>
          <p className="text-[#aaa] text-sm mb-2.5">📍 Hajvari Rd, Faisalabad</p>
          <p className="text-[#aaa] text-sm mb-2.5">📞 +92 339 7579547</p>
          <p className="text-[#aaa] text-sm mb-2.5">✉️ info@paklippin.com</p>
          <p className="text-[#666] text-xs mt-4">FBR J756870 · SECP 0352216 · PSW UN-00-J756870</p>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto mt-10 pt-6 border-t border-[#333] text-center text-[#aaa] text-xs">
        © 2026 PAKLIPPIN (SMC-PRIVATE) LIMITED. All rights reserved.
      </div>
    </footer>
  );
}
