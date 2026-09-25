import PolicyLayout from '@/components/legal/PolicyLayout';

export const metadata = { title: 'Shipping Policy — PAKLIPPIN' };

export default function ShippingPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      updated="September 2026"
      sections={[
        { heading: 'Delivery Charges',
          body: [
            'Free shipping on all orders over Rs 5,000',
            'Flat Rs 300 delivery fee for orders below Rs 5,000',
            'No hidden charges — the amount at checkout is what you pay',
          ]},
        { heading: 'Delivery Timelines',
          body: [
            'Same-day delivery within Faisalabad for orders placed before 2 PM',
            'Next-day delivery in Faisalabad for later orders',
            'Lahore, Karachi, Islamabad & major cities: 1–2 business days',
            'Other cities: 2–4 business days',
            'Remote areas: up to 5 business days',
          ]},
        { heading: 'Processing Time',
          body: 'Orders are processed within 1 hour during business hours (Mon–Sat 9 AM–9 PM) after EasyPaisa payment is verified. Orders placed after 9 PM are processed next morning.' },
        { heading: 'Order Tracking',
          body: 'You receive a tracking ID once your order ships. Track anytime at paklippin.com/account/track using your order ID (e.g. PKL-ABC123).' },
        { heading: 'Delivery Attempts',
          body: 'Our courier makes up to 3 delivery attempts. If unreachable, the order is returned to us and a refund is issued minus shipping costs.' },
        { heading: 'Delivery Areas',
          body: 'We deliver nationwide across Pakistan. For remote areas or restricted zones, please WhatsApp us at +92 339 7579547 before ordering.' },
        { heading: 'Damaged or Missing Items',
          body: 'Inspect your package on delivery. Report any damage or missing items within 48 hours with photos. We\'ll replace or refund immediately.' },
        { heading: 'Address Changes',
          body: 'Address changes are possible if the order hasn\'t shipped. Contact us via WhatsApp with your order ID and new address.' },
      ]}
    />
  );
}
