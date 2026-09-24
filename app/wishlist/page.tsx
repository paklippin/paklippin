import Link from 'next/link';

export const metadata = { title: 'Wishlist — PAKLIPPIN' };

export default function WishlistPage() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-5 py-20">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">❤️</div>
        <h1 className="font-display text-3xl font-bold mb-3">Your wishlist is empty</h1>
        <p className="text-gray-500 mb-8">Save your favorite products to view them here.</p>
        <Link href="/shop" className="inline-block bg-brand-primary text-white font-semibold px-8 py-4 rounded-full hover:-translate-y-1 transition">Browse Products →</Link>
      </div>
    </div>
  );
}
