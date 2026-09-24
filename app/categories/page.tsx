import CategoryGrid from '@/components/shop/CategoryGrid';

export const metadata = { title: 'Categories — PAKLIPPIN' };

export default function CategoriesPage() {
  return (
    <div className="py-12">
      <CategoryGrid />
    </div>
  );
}
