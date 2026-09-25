'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Lock, CheckCircle2, Copy, ArrowLeft, MessageCircle, Ticket, X as XIcon } from 'lucide-react';
import {
  readUser, createOrder, generateOrderId,
  type StoredUser,
} from '@/lib/user';
import type { Product } from '@/components/shop/ProductCard';
import { useSettings } from '@/lib/settings-store';

type CartItem = Product & { quantity: number };
type Stage = 'review' | 'payment' | 'success';
type Coupon = { code: string; type: string; value: number; discount: number; description: string };

export default function CheckoutPage() {
  const { settings, load } = useSettings();
  const [user, setUser]     = useState<StoredUser>(null);
  const [ready, setReady]   = useState(false);
  const [items, setItems]   = useState<CartItem[]>([]);
  const [stage, setStage]   = useState<Stage>('review');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: 'Faisalabad', notes: '' });
  const [txnId, setTxnId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);
  const [copied, setCopied] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    load();
    const u = readUser();
    setUser(u);
    if (u) setForm((f) => ({ ...f, name: u.name, email: u.email, phone: u.phone || '' }));
    try {
      const raw = localStorage.getItem('cart-storage');
      if (raw) {
        const data = JSON.parse(raw);
        const list = data?.state?.items || data?.items || [];
        setItems(Array.isArray(list) ? list : []);
      }
    } catch {}
    setReady(true);
  }, [load]);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const freeShip = subtotal >= settings.shipping_threshold;
  const delivery = freeShip ? 0 : (items.length ? settings.delivery_fee : 0);
  const discount = coupon?.discount || 0;
  const total    = Math.max(0, subtotal + delivery - discount);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.ok && data.coupon) {
        setCoupon(data.coupon);
        setCouponInput('');
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setCoupon(null);
      }
    } catch {
      setCouponError('Could not validate coupon');
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
    setCouponInput('');
  };

  const buildWhatsAppLink = () => {
    const lines = [
      `*PAKLIPPIN — ORDER SLIP*`,
      ``,
      `*Order:* ${orderId}`,
      `*Date:* ${new Date().toLocaleString('en-PK')}`,
      ``,
      `*Customer:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      `*Email:* ${form.email}`,
      `*Address:* ${form.address}, ${form.city}`,
      form.notes ? `*Notes:* ${form.notes}` : null,
      ``,
      `*Items:*`,
      ...items.map((i) => `• ${i.name} ×${i.quantity} — Rs ${(i.price * i.quantity).toLocaleString()}`),
      ``,
      `*Subtotal:* Rs ${subtotal.toLocaleString()}`,
      `*Delivery:* ${freeShip ? 'FREE' : `Rs ${delivery}`}`,
      coupon ? `*Coupon:* ${coupon.code} (-Rs ${discount.toLocaleString()})` : null,
      `*TOTAL:* Rs ${total.toLocaleString()}`,
      ``,
      `*Payment:* EasyPaisa`,
      `*TID:* ${txnId}`,
      `*Status:* Processing`,
    ].filter(Boolean);
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!user) { setError('Please login to continue.'); return; }
    if (items.length === 0) { setError('Your cart is empty.'); return; }
    if (!form.address.trim() || !form.city.trim()) { setError('Address and city are required.'); return; }
    if (!txnId.trim()) { setError('Please enter your EasyPaisa transaction ID (TID).'); return; }
    if (txnId.trim().length < 4) { setError('Transaction ID looks too short.'); return; }

    setSubmitting(true);
    const id = generateOrderId();
    const order: any = {
      id,
      date: new Date().toISOString(),
      status: 'processing',
      total,
      items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      customer: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, notes: form.notes },
      payment: { method: 'easypaisa', txnId: txnId.trim(), amount: total },
    };
    if (coupon) {
      order.coupon = { code: coupon.code, discount };
    }

    const res = await createOrder(order as any);
    setSubmitting(false);
    if (!res.ok) { setError('Could not save your order. Please try again.'); return; }

    try { localStorage.setItem('cart-storage', JSON.stringify({ state: { items: [] }, version: 0 })); } catch {}

    setOrderId(id);
    setOffline(!!res.offline);
    setStage('success');
  };

  if (!ready) return null;

  if (!user) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-16">
        <div className="w-full max-w-[480px] bg-white border border-border rounded-2xl p-8 shadow text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-orange-50 flex items-center justify-center">
            <Lock size={28} className="text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Login required</h1>
          <p className="text-sm text-text-secondary mb-6">Please login or create an account to proceed to payment.</p>
          <Link href="/account" className="inline-block w-full bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition">
            Login / Register
          </Link>
          <Link href="/" className="inline-block mt-3 text-sm text-text-secondary hover:text-brand-accent">← Back to shop</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && stage !== 'success') {
    return (
      <div className="min-h-[60vh] grid place-items-center px-5 py-16">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Your cart is empty.</p>
          <Link href="/" className="inline-block bg-brand-accent text-white px-8 py-3 rounded-full font-semibold">Start Shopping</Link>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="min-h-[80vh] grid place-items-center px-5 py-16">
        <div className="w-full max-w-[560px] bg-white border border-border rounded-2xl p-8 shadow text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={44} className="text-brand-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order placed successfully!</h1>
          <p className="text-sm text-text-secondary mb-6">Thank you for shopping with PAKLIPPIN.</p>

          <div className="bg-brand-secondary rounded-xl p-4 mb-5">
            <div className="text-xs uppercase tracking-wider text-text-secondary mb-1 font-semibold">Order ID</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-bold text-brand-accent">{orderId}</span>
              <button onClick={() => copyToClipboard(orderId)} className="text-text-secondary hover:text-brand-accent" aria-label="Copy">
                <Copy size={16} />
              </button>
            </div>
            {copied && <div className="text-[10px] text-brand-success mt-1">Copied!</div>}
          </div>

          <a href={buildWhatsAppLink()} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white font-semibold py-3.5 rounded-xl mb-3 transition">
            <MessageCircle size={18} /> Send Order Slip on WhatsApp
          </a>
          <p className="text-xs text-text-secondary mb-6">
            Send to <strong>{settings.store_phone}</strong> so we can process faster.
          </p>

          <div className="text-sm text-text-secondary mb-6 text-left bg-orange-50 rounded-xl p-4">
            <div className="font-semibold text-text-primary mb-2">What happens next?</div>
            <ol className="list-decimal pl-5 space-y-1">
              <li>We verify your payment (usually within 1 hour)</li>
              <li>Your order is processed and packed</li>
              <li>Shipped to: {form.city}</li>
              <li>Same-day delivery in Faisalabad</li>
              <li><strong>Order before 2 PM</strong> for same-day dispatch</li>
            </ol>
          </div>

          {offline && (
            <p className="text-xs text-text-secondary mb-4 bg-yellow-50 rounded-lg p-2">
              ⚠️ Saved locally. Our team will sync your order shortly.
            </p>
          )}

          <div className="flex gap-3">
            <Link href="/account/track" className="flex-1 bg-brand-accent text-white font-semibold py-3 rounded-xl hover:bg-[#e55a2b] transition text-center">
              Track Order
            </Link>
            <Link href="/" className="flex-1 bg-white border-2 border-border font-semibold py-3 rounded-xl hover:border-brand-accent hover:text-brand-accent transition text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm transition bg-white';

  return (
    <div className="max-w-[1200px] mx-auto px-[5%] py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-accent mb-6 text-sm">
        <ArrowLeft size={16} /> Continue shopping
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex items-center gap-2 mb-8 text-xs font-semibold">
        <span className={stage === 'review' ? 'text-brand-accent' : 'text-text-secondary'}>1. Delivery</span>
        <span className="text-border">›</span>
        <span className={stage === 'payment' ? 'text-brand-accent' : 'text-text-secondary'}>2. Payment</span>
        <span className="text-border">›</span>
        <span className="text-text-secondary">3. Confirm</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          {stage === 'review' && (
            <form onSubmit={(e) => { e.preventDefault(); setStage('payment'); }} className="bg-white border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-lg">Delivery details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="co-name" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Full name</label>
                  <input id="co-name" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label htmlFor="co-phone" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Phone</label>
                  <input id="co-phone" name="phone" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+92 3XX XXXXXXX" className={inputCls} required />
                </div>
              </div>
              <div>
                <label htmlFor="co-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Email</label>
                <input id="co-email" name="email" autoComplete="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label htmlFor="co-address" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Address</label>
                <input id="co-address" name="address" autoComplete="street-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House, street, area" className={inputCls} required />
              </div>
              <div>
                <label htmlFor="co-city" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">City</label>
                <select id="co-city" name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls}>
                  {['Faisalabad','Lahore','Karachi','Islamabad','Rawalpindi','Multan','Peshawar','Quetta','Sialkot','Gujranwala','Hyderabad','Other'].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="co-notes" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Notes (optional)</label>
                <input id="co-notes" name="notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Delivery instructions" className={inputCls} />
              </div>
              <button type="submit" className="w-full bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition">
                Continue to payment
              </button>
            </form>
          )}

          {stage === 'payment' && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="bg-white border-2 border-brand-accent rounded-2xl overflow-hidden">
                <div className="bg-brand-accent text-white px-6 py-3 flex items-center gap-2">
                  <span className="font-bold">💰 EasyPaisa Payment</span>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-sm text-text-secondary">
                    Send <strong className="text-brand-accent">Rs {total.toLocaleString()}</strong> to the EasyPaisa account below, then enter your TID.
                  </p>
                  <div className="bg-brand-secondary rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Number</div>
                        <div className="font-bold text-lg">{settings.easypaisa_number}</div>
                      </div>
                      <button type="button" onClick={() => copyToClipboard(settings.easypaisa_number.replace(/\s/g, ''))} className="text-text-secondary hover:text-brand-accent">
                        <Copy size={18} />
                      </button>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Account Name</div>
                      <div className="font-semibold">{settings.easypaisa_name}</div>
                    </div>
                    <div className="flex justify-between items-center border-t border-border pt-3">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-text-secondary font-semibold mb-1">Amount</div>
                        <div className="font-bold text-brand-accent text-lg">Rs {total.toLocaleString()}</div>
                      </div>
                      <button type="button" onClick={() => copyToClipboard(total.toString())} className="text-text-secondary hover:text-brand-accent">
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="co-tid" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                      EasyPaisa Transaction ID (TID) *
                    </label>
                    <input id="co-tid" name="tid" value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="e.g. 1234567890123" className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm" required />
                  </div>
                </div>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">{error}</div>}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStage('review')} className="px-6 py-3.5 rounded-xl border-2 border-border font-semibold hover:border-brand-accent transition">
                  Back
                </button>
                <button type="submit" disabled={submitting} className="flex-1 bg-brand-accent text-white font-semibold py-3.5 rounded-xl hover:bg-[#e55a2b] transition disabled:opacity-60">
                  {submitting ? 'Placing order...' : `Confirm Order — Rs ${total.toLocaleString()}`}
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit bg-white border border-border rounded-2xl p-6">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>

          <div className="space-y-3 max-h-[300px] overflow-y-auto mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center text-lg shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `${process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com'}${item.imageUrl}`}
                      alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.emoji
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.name}</div>
                  <div className="text-xs text-text-secondary">Qty: {item.quantity}</div>
                </div>
                <div className="font-semibold text-brand-accent whitespace-nowrap">Rs {(item.price * item.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>

          {/* Coupon input */}
          <div className="border-t border-border pt-4 mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2 flex items-center gap-1.5">
              <Ticket size={12} /> Have a coupon?
            </label>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                <div>
                  <div className="font-bold text-green-700 text-sm">{coupon.code}</div>
                  <div className="text-xs text-green-600">-Rs {coupon.discount.toLocaleString()} off</div>
                </div>
                <button type="button" onClick={removeCoupon} className="text-green-700 hover:bg-green-100 p-1 rounded">
                  <XIcon size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  id="co-coupon"
                  name="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="flex-1 px-3 py-2 rounded-lg border-2 border-border focus:border-brand-accent outline-none text-sm font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-4 py-2 rounded-lg bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition disabled:opacity-50"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Delivery</span>
              <span className={freeShip ? 'text-brand-success font-semibold' : ''}>
                {freeShip ? 'FREE' : `Rs ${delivery}`}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({coupon?.code})</span>
                <span>-Rs {discount.toLocaleString()}</span>
              </div>
            )}
            {!freeShip && subtotal > 0 && (
              <p className="text-xs text-text-secondary pt-1">
                Add Rs {(settings.shipping_threshold - subtotal).toLocaleString()} more for free shipping
              </p>
            )}
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-brand-accent">Rs {total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border text-xs text-text-secondary space-y-1">
            <div>🔐 Secure checkout</div>
            <div>💰 EasyPaisa only</div>
            <div>📞 Support: {settings.store_phone}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
