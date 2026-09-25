import NoticeBar from '@/components/layout/NoticeBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartProvider from '@/components/cart/CartProvider';
import BottomNav from '@/components/layout/BottomNav';
import ChatWidget from '@/components/chat/ChatWidget';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NoticeBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartProvider />
      <BottomNav />
      <ChatWidget />
    </>
  );
}
