export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status') || '';
    const url = status ? `${API_BASE}/admin/reviews?status=${status}` : `${API_BASE}/admin/reviews`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ reviews: [], counts: { pending: 0, approved: 0, rejected: 0 } });
  }
}
