import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.scss';
import NoticeBar from '@/components/layout/NoticeBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartProvider from '@/components/cart/CartProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "PAKLIPPIN - Pakistan's Trusted Online Store",
  description: 'Quality products, fast delivery, excellent service.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2218%22 fill=%22%23FF6B35%22/><text x=%2250%22 y=%2268%22 font-size=%2260%22 font-family=%22Arial%22 font-weight=%22bold%22 fill=%22white%22 text-anchor=%22middle%22>P</text></svg>',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <NoticeBar />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartProvider />
      </body>
    </html>
  );
}
