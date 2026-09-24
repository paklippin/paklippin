const features = [
  {
    icon: '🚚',
    title: 'Fast Delivery',
    desc: 'Free shipping on orders over Rs 5,000. Delivery charges Rs 300. Same day delivery in Faisalabad.',
  },
  {
    icon: '🛡️',
    title: 'Secure Shopping',
    desc: '100% secure payments with SSL encryption and buyer protection.',
  },
  {
    icon: '💰',
    title: 'Best Prices',
    desc: 'Quality products at competitive prices with regular discounts.',
  },
  {
    icon: '📞',
    title: '24/7 Support',
    desc: 'Round the clock customer support via phone, email, and chat.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-20 px-[5%] max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="text-center p-10 bg-white rounded-2xl shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
          >
            <div
              className="w-[70px] h-[70px] mx-auto mb-5 rounded-full flex items-center justify-center text-3xl text-white"
              style={{ background: 'linear-gradient(135deg, #FF6B35, #ff8c5a)' }}
            >
              {f.icon}
            </div>
            <div className="text-lg font-semibold mb-2.5">{f.title}</div>
            <div className="text-sm text-text-secondary leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
