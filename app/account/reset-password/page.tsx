'use client';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, KeyRound, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function ResetContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';

  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) { setChecking(false); return; }
    (async () => {
      try {
        const res = await fetch(`/api/auth/verify-reset?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (data.ok) { setValid(true); setEmail(data.email); }
        else setError(data.error || 'Invalid link');
      } catch { setError('Could not verify link'); }
      setChecking(false);
    })();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/account'), 3000);
      } else {
        setError(data.error || 'Could not reset password');
      }
    } catch { setError('Network error'); }
    setSubmitting(false);
  };

  if (checking) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5">
        <Loader2 size={32} className="animate-spin text-brand-accent" />
      </div>
    );
  }

  if (!token || (!valid && error)) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-12">
        <div className="w-full max-w-[440px] bg-white border border-border rounded-2xl p-8 shadow text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Invalid Reset Link</h1>
          <p className="text-sm text-text-secondary mb-6">{error || 'This link is missing or broken.'}</p>
          <Link href="/account/forgot-password" className="inline-block w-full bg-brand-accent text-white font-semibold py-3 rounded-xl hover:bg-[#e55a2b] transition">
            Request New Link
          </Link>
          <Link href="/account" className="inline-block mt-3 text-sm text-text-secondary hover:text-brand-accent">
            ← Back to Login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-12">
        <div className="w-full max-w-[440px] bg-white border border-border rounded-2xl p-8 shadow text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Password Reset!</h1>
          <p className="text-sm text-text-secondary mb-6">
            Your password has been updated. Redirecting to login...
          </p>
          <Link href="/account" className="inline-block w-full bg-brand-accent text-white font-semibold py-3 rounded-xl hover:bg-[#e55a2b] transition">
            Login Now
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
            <KeyRound size={28} className="text-brand-accent" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
          <p className="text-sm text-text-secondary">
            for <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              New Password
            </label>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm"
              autoFocus
              required
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-brand-accent outline-none text-sm"
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !password || !confirm}
            className="w-full py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-[#e55a2b] transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] grid place-items-center"><Loader2 className="animate-spin text-brand-accent" /></div>}>
      <ResetContent />
    </Suspense>
  );
}
