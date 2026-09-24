export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, passwordResetHtml } from '@/lib/email';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://paklippinshop.pages.dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    // If token returned, send the email
    if (data.ok && data.token && body.email) {
      const resetLink = `${SITE_URL}/account/reset-password?token=${data.token}`;
      await sendEmail({
        to: body.email,
        subject: 'Reset your PAKLIPPIN password',
        html: passwordResetHtml(resetLink),
      });
    }

    return NextResponse.json({ ok: true, message: 'If this email exists, a reset link has been sent.' });
  } catch {
    return NextResponse.json({ ok: true, message: 'If this email exists, a reset link has been sent.' });
  }
}
