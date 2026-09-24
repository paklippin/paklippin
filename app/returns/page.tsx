import PolicyLayout from '@/components/legal/PolicyLayout';

export const metadata = { title: 'Returns & Refunds — PAKLIPPIN' };

export default function ReturnsPage() {
  return (
    <PolicyLayout
      title="Returns & Refunds"
      updated="September 2026"
      sections={[
        { heading: 'Return Window',
          body: 'You can return any product within 7 days of delivery. Products must be unused, undamaged, and in original packaging with all tags attached.' },
        { heading: 'Non-Returnable Items',
          body: [
            'Perishable goods (food, fresh produce)',
            'Personal care items (opened cosmetics, skincare)',
            'Intimate apparel and swimwear',
            'Customized or personalized products',
            'Digital downloads and gift cards',
          ]},
        { heading: 'How to Initiate a Return',
          body: [
            'Log in to your account and go to My Orders',
            'Click "Return" on the relevant order',
            'Provide a reason and any photos of damage/defect',
            'Our team reviews within 24 hours and provides return instructions',
            'Ship the product back to us (we reimburse shipping for defective items)',
          ]},
        { heading: 'Refund Timelines',
          body: [
            'Refunds processed within 3–5 business days after we receive and inspect the return',
            'Amount refunded to your original EasyPaisa account',
            'You receive confirmation via WhatsApp',
          ]},
        { heading: 'Exchanges',
          body: 'Prefer an exchange instead of a refund? Mention it in the return note. We\'ll send the new item once the original is received.' },
        { heading: 'Defective or Wrong Items',
          body: 'If you received a damaged, defective, or incorrect product: contact us within 48 hours with photos. We cover return shipping and send a replacement immediately.' },
        { heading: 'Cancellations',
          body: 'Cancel free of charge any time before your order ships. After shipping, treat it as a return. To cancel: My Orders → Cancel Order.' },
        { heading: 'Refusals',
          body: 'You may refuse delivery at the door if the package is visibly damaged. The order will be returned to us and fully refunded.' },
      ]}
    />
  );
}
