export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email') || '';
  const all   = req.nextUrl.searchParams.get('all') === 'true';
  const qs    = all ? '?all=true' : (email ? `?email=${encodeURIComponent(email)}` : '');

  try {
    const res = await fetch(`${API_BASE}/orders${qs}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ orders: [] });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return NextResponse.json({ ok: true, data });
      }
    } catch (e) {
      console.warn('[proxy POST] upstream failed:', (e as Error).message);
    }
    return NextResponse.json({ ok: false, offline: true, message: 'Saved locally' });
  } catch {
    return NextResponse.json({ ok: false, offline: true });
  }
}

// PATCH — update order status (used by admin)
export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id  = url.searchParams.get('id') || '';
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const body = await req.json();
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}

// DELETE — remove order (used by admin)
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id  = url.searchParams.get('id') || '';
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
