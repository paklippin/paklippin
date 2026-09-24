import PolicyLayout from '@/components/legal/PolicyLayout';

export const metadata = { title: 'Terms & Conditions — PAKLIPPIN' };

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      updated="September 2026"
      sections={[
        { heading: '1. Agreement to Terms',
          body: 'By accessing or purchasing from PAKLIPPIN (SMC-PRIVATE) LIMITED, you agree to be bound by these Terms. If you do not agree, please do not use the platform.' },
        { heading: '2. Account Registration',
          body: 'You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your credentials. Notify us immediately if you suspect unauthorized access.' },
        { heading: '3. Orders & Acceptance',
          body: 'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order due to stock issues, pricing errors, or suspected fraud. A confirmation is sent via WhatsApp once payment is verified.' },
        { heading: '4. Pricing & Payment',
          body: 'All prices are in Pakistani Rupees (PKR) inclusive of applicable taxes. We accept EasyPaisa only. Payment must be completed within 24 hours of placing the order or it will be auto-cancelled.' },
        { heading: '5. Shipping & Delivery',
          body: 'Same-day delivery available in Faisalabad for orders before 2 PM. Nationwide delivery takes 2–4 business days. Risk passes to you upon delivery.' },
        { heading: '6. Returns & Refunds',
          body: 'Returns accepted within 7 days of delivery for unused items in original packaging. Refunds processed within 3–5 business days to your EasyPaisa account. See our Returns Policy for details.' },
        { heading: '7. Intellectual Property',
          body: 'All content on this site — logos, product images, text — is owned by PAKLIPPIN or its licensors. Unauthorized reproduction is prohibited.' },
        { heading: '8. Limitation of Liability',
          body: 'Our maximum liability for any claim is limited to the amount you paid for the product. We are not liable for indirect, incidental, or consequential damages.' },
        { heading: '9. Governing Law',
          body: 'These Terms are governed by the laws of the Islamic Republic of Pakistan. Any dispute will be resolved in the courts of Faisalabad.' },
        { heading: '10. Changes to Terms',
          body: 'We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.' },
      ]}
    />
  );
}
