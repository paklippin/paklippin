'use client';
import Link from 'next/link';

const categories = [
  { icon: '📱', name: 'Electronics', count: 248, slug: 'Electronics' },
  { icon: '👕', name: 'Clothing', count: 512, slug: 'Clothing' },
  { icon: '🏠', name: 'Home & Living', count: 189, slug: 'Home & Living' },
  { icon: '⚽', name: 'Sports', count: 156, slug: 'Sports' },
  { icon: '💄', name: 'Beauty', count: 203, slug: 'Beauty' },
  { icon: '📚', name: 'Books', count: 98, slug: 'Books' },
];

export default function CategoryGrid() {
  return (
    <section className="bg-brand-secondary py-20 px-[5%]" id="categories">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2.5">Shop by Category</h2>
          <p className="text-text-secondary text-base">Browse through our diverse product categories</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/shop?category=${encodeURIComponent(c.slug)}`}
              className="bg-white rounded-2xl p-7 text-center shadow cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
            >
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, #fff5f0, #ffe0d0)' }}
              >
                {c.icon}
              </div>
              <div className="font-semibold text-base mb-1">{c.name}</div>
              <div className="text-xs text-text-secondary">{c.count} Products</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
