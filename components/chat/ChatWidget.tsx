'use client';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { useSettings } from '@/lib/settings-store';

type Msg = { role: 'user' | 'bot'; text: string; at: number };

const SUGGESTIONS = [
  'Where is my order?',
  'Shipping charges?',
  'How to pay?',
  'Return policy',
  'Talk to human',
];

export default function ChatWidget() {
  const { settings, load } = useSettings();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    load();
    // Load history
    try {
      const raw = localStorage.getItem('chat-history');
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, [load]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('chat-history', JSON.stringify(messages.slice(-50)));
    } catch {}
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [messages, mounted]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'bot',
        text: `👋 Hi! I'm the PAKLIPPIN assistant. How can I help you today?\n\nYou can ask me about:\n• Orders & tracking\n• Shipping\n• Payment\n• Returns & refunds`,
        at: Date.now(),
      }]);
    }
  }, [open, messages.length]);

  const generateReply = (q: string): string => {
    const query = q.toLowerCase();
    const wa = settings.whatsapp;

    // Order tracking
    if (/(order|track|status|where.*(is|my))/.test(query) && /(order|pkl)/.test(query)) {
      return `📦 To track your order:\n\n1. Open your account\n2. Go to "Track Order"\n3. Enter your PKL-XXXXXX order ID\n\nYou can also check My Orders for status.\n\nNeed help? WhatsApp: wa.me/${wa}`;
    }

    // Shipping
    if (/(ship|delivery|deliver|how long|kab|kab tak|kitna din)/.test(query)) {
      return `🚚 Shipping info:\n\n• Free shipping over Rs 5,000\n• Rs 300 delivery fee below that\n• Same-day delivery in Faisalabad (before 2 PM)\n• Nationwide: 2-4 business days\n\nTrack your order anytime in your account.`;
    }

    // Payment
    if (/(pay|payment|easypaisa|jazz|bank|card|cod|cash)/.test(query)) {
      return `💰 We accept EasyPaisa only.\n\nAfter placing your order, send payment to:\n• ${settings.easypaisa_number}\n• Name: ${settings.easypaisa_name}\n\nThen submit your TID at checkout. Orders ship once payment is verified.`;
    }

    // Return/refund
    if (/(return|refund|money back|wapas|exchange)/.test(query)) {
      return `↩️ Returns & Refunds:\n\n• 7-day return window\n• Product must be unused, in original packaging\n• Refunds processed in 3-5 business days to your EasyPaisa\n\nTo start a return:\n1. Open My Orders\n2. Click "Return" on the order\n3. Add a reason and submit`;
    }

    // Cancel
    if (/(cancel|refuse|reject)/.test(query)) {
      return `❌ You can cancel any order before it ships:\n\n1. Open My Orders\n2. Click "Cancel Order"\n3. Provide a reason\n\nOnce cancelled, orders are excluded from revenue and you'll be refunded.`;
    }

    // Coupon
    if (/(coupon|code|discount|promo|voucher)/.test(query)) {
      return `🎟️ To use a coupon:\n\n1. Add items to cart\n2. Go to Checkout\n3. In the Order Summary, find "Have a coupon?"\n4. Enter your code\n5. Discount applies instantly\n\nTry: WELCOME10, FLAT100, EID15`;
    }

    // Contact / human
    if (/(human|person|agent|talk|call|whatsapp|contact|support)/.test(query)) {
      return `📞 Talk to a human:\n\n• Phone: ${settings.store_phone}\n• WhatsApp: wa.me/${wa}\n• Email: ${settings.store_email}\n\nWe reply within 1 hour during business hours (Mon-Sat 9 AM - 9 PM).`;
    }

    // Greeting
    if (/(hi|hello|hey|salam|assalam|aoa)/.test(query) && query.length < 20) {
      return `👋 Hello! Welcome to PAKLIPPIN.\n\nHow can I help you today? Try asking about:\n• Order tracking\n• Shipping\n• Payment\n• Returns`;
    }

    // Thanks
    if (/(thank|shukriya|thanks|thx)/.test(query)) {
      return `😊 You're welcome! Anything else I can help with?`;
    }

    // Product questions
    if (/(product|price|cost|available|stock|size|color)/.test(query)) {
      return `🛍️ For product info:\n\n• Browse all products: paklippinshop.pages.dev/shop\n• Click any product to see full details, sizes, and reviews\n• All prices update live with your currency preference\n\nCan't find something? WhatsApp us at wa.me/${wa}`;
    }

    // Default
    return `🤔 I'm not sure about that. Try asking:\n\n• "Where is my order?"\n• "Shipping charges?"\n• "How to pay?"\n• "Return policy"\n\nOr WhatsApp us: wa.me/${wa}`;
  };

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg, at: Date.now() }]);
    setTyping(true);
    setTimeout(() => {
      const reply = generateReply(msg);
      setMessages((m) => [...m, { role: 'bot', text: reply, at: Date.now() }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('chat-history');
  };

  // Don't show on admin (only customer side)
  if (!mounted) return null;
  if (typeof window !== 'undefined' && window.location.host.startsWith('admin.')) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[950] w-14 h-14 rounded-full bg-brand-accent text-white shadow-lg hover:bg-[#e55a2b] hover:scale-110 transition flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-[1000] w-[calc(100vw-2rem)] sm:w-[380px] h-[560px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
          {/* Header */}
          <div className="bg-brand-accent text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <div className="font-bold text-sm">PAKLIPPIN Assistant</div>
                <div className="text-[10px] opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-[10px]" title="Clear chat">
                🗑
              </button>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center" aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-secondary/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-accent text-white rounded-br-sm'
                    : 'bg-white text-text-primary rounded-bl-sm shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <Loader2 size={14} className="animate-spin text-brand-accent" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-border bg-white">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border hover:border-brand-accent hover:text-brand-accent transition">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="border-t border-border p-3 flex gap-2 bg-white">
            <input
              id="chat-input"
              name="chatInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              autoComplete="off"
              className="flex-1 px-3.5 py-2.5 rounded-full border-2 border-border focus:border-brand-accent outline-none text-sm"
            />
            <button type="submit" disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-brand-accent text-white flex items-center justify-center hover:bg-[#e55a2b] transition disabled:opacity-40">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
