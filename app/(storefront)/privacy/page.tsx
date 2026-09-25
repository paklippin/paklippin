import PolicyLayout from '@/components/legal/PolicyLayout';

export const metadata = { title: 'Privacy Policy — PAKLIPPIN' };

export default function PrivacyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="September 2026"
      sections={[
        { heading: '1. Information We Collect',
          body: [
            'Personal details: name, email, phone, delivery address',
            'Order details: products purchased, amounts, dates',
            'Payment info: EasyPaisa transaction ID (we do NOT store card or wallet credentials)',
            'Device data: IP address, browser type, pages visited',
          ]},
        { heading: '2. How We Use Your Information',
          body: [
            'Process and deliver your orders',
            'Verify payments and prevent fraud',
            'Provide customer support',
            'Send order updates via WhatsApp, SMS, or email',
            'Improve our platform and recommendations',
          ]},
        { heading: '3. Information Sharing',
          body: 'We never sell your data. We share information only with: (a) delivery partners to ship your order, (b) payment processors to verify transactions, (c) legal authorities when required by law.' },
        { heading: '4. Data Security',
          body: 'We use industry-standard SSL encryption and secure servers. Passwords are stored using one-way hashing. We conduct regular security audits. However, no system is 100% secure — please use a strong password.' },
        { heading: '5. Cookies',
          body: 'We use essential cookies for cart functionality and login sessions. Analytics cookies help us understand site usage. You can disable non-essential cookies in your browser settings.' },
        { heading: '6. Your Rights',
          body: [
            'Access a copy of your personal data',
            'Correct inaccurate information',
            'Delete your account and data (subject to legal retention requirements)',
            'Opt out of marketing communications',
          ]},
        { heading: '7. Data Retention',
          body: 'We retain order data for 7 years (tax/legal compliance). Account data is deleted within 30 days of a deletion request, except records we must keep by law.' },
        { heading: '8. Children\'s Privacy',
          body: 'Our services are not intended for children under 13. We do not knowingly collect data from minors.' },
        { heading: '9. Changes to This Policy',
          body: 'We may update this policy periodically. Material changes will be notified via email or a site banner.' },
        { heading: '10. Contact Us',
          body: 'For privacy questions: info@paklippin.com or WhatsApp +92 339 7579547.' },
      ]}
    />
  );
}
