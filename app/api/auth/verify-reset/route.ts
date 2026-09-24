export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') || '';
  try {
    const res = await fetch(`${API_BASE}/auth/verify-reset?token=${encodeURIComponent(token)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ ok: false, error: 'Network error' }, { status: 502 });
  }
}
