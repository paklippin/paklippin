export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/product-images`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({ images: {} }));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ images: {} });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/product-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id') || '';
    const res = await fetch(`${API_BASE}/product-images/${id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
