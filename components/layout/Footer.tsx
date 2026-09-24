'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type SocialLink = { platform: string; label: string; url: string; enabled: boolean };

const PLATFORM_EMOJI: Record<string, string> = {
  facebook: '📘', instagram: '📷', whatsapp: '💬',
  tiktok: '🎵', youtube: '📺', twitter: '🐦',
  linkedin: '💼', snapchat: '👻', telegram: '✈️',
  pinterest: '📌',
};

export default function Footer() {
  const [social, setSocial] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch('/api/social-links', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setSocial(Array.isArray(j.links) ? j.links : []))
      .catch(() => setSocial([]));
  }, []);

  const activeSocial = social.filter((s) => s.enabled && s.url.trim());

  const quickLinks = [
    { href: '/shop',         label: 'All Products' },
    { href: '/categories',   label: 'Categories' },
    { href: '/new-arrivals', label: 'New Arrivals' },
    { href: '/sale',         label: 'Sale' },
    { href: '/account',      label: 'Wishlist' },
  ];
  const companyLinks = [
    { href: '/about',    label: 'About Us' },
    { href: '/contact',  label: 'Contact Us' },
    { href: '/faq',      label: 'FAQ' },
    { href: '/terms',    label: 'Terms & Conditions' },
    { href: '/privacy',  label: 'Privacy Policy' },
    { href: '/shipping', label: 'Shipping Policy' },
    { href: '/returns',  label: 'Returns Policy' },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-[5%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 className="text-lg font-bold mb-5">PAKLIPPIN</h3>
          <p className="text-[#aaa] text-sm leading-relaxed mb-5">
            Pakistan&apos;s trusted online store. Quality products, fast delivery, excellent service.
          </p>
          {activeSocial.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {activeSocial.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center hover:bg-brand-accent hover:-translate-y-0.5 transition"
                  title={s.label}
                  aria-label={s.label}
                >
                  {PLATFORM_EMOJI[s.platform] || '🔗'}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[#aaa] text-sm hover:text-brand-accent transition">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Company</h3>
          <ul className="space-y-3">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[#aaa] text-sm hover:text-brand-accent transition">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5">Contact Us</h3>
          <p className="text-[#aaa] text-sm mb-3">📍 Hajvari Rd, Faisalabad</p>
          <p className="text-[#aaa] text-sm mb-3">📞 +92 339 7579547</p>
          <p className="text-[#aaa] text-sm mb-3">✉️ info@paklippin.com</p>
          <p className="text-[#666] text-xs mt-4">FBR J756870 · SECP 0352216 · PSW UN-00-J756870</p>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-[5%] mt-10 pt-6 border-t border-[#333] text-center text-[#aaa] text-xs">
        © {new Date().getFullYear()} PAKLIPPIN (SMC-PRIVATE) LIMITED. All rights reserved.
      </div>
    </footer>
  );
}
