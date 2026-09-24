'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email'); return; }
    setSubmitting(true);
    setError('');
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setSent(true);
    } catch {
      setError('Something went wrong. Try again.');
    }
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-12">
        <div className="w-full max-w-[440px] bg-white border border-border rounded-2xl p-8 shadow text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-sm text-text-secondary mb-6">
            If <strong>{email}</strong> is registered, we&apos;ve sent a password reset link.
            The link expires in 30 minutes.
          </p>
          <p className="text-xs text-text-secondary mb-6 bg-brand-secondary rounded-lg p-3">
            💡 <strong>Tip:</strong> Check your spam/promotions folder if you don&apos;t see it within 2 minutes.
          </p>
          <Link href="/account" className="inline-block w-full bg-brand-accent text-white font-semibold py-3 rounded-xl hover:bg-[#e55a2b] transition">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-5 py-12">
      <div className="w-full max-w-[440px] bg-white border border-border rounded-2xl p-8 shadow">
        <Link href="/account" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-accent mb-6 text-sm">
          <ArrowLeft size={14} /> Back to Login
        </Link>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
            <Mail size={28} className="text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-sm text-text-secondary">
            Enter your email — we&apos;ll send you a link to reset it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Email
            </label>
            <input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm"
              autoFocus
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
