export const runtime = 'edge';

import { NextResponse } from 'next/server';

const PRODUCTS_BASE = process.env.NEXT_PUBLIC_PRODUCTS_URL || 'https://paklippin.com/api';

export async function GET() {
  try {
    const res = await fetch(`${PRODUCTS_BASE}/products`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      console.warn(`[products proxy] upstream ${res.status}`);
      return NextResponse.json({ products: [], fallback: true });
    }
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.products ?? data.data ?? []);
    return NextResponse.json({ products: list });
  } catch (e) {
    console.warn('[products proxy] failed:', (e as Error).message);
    return NextResponse.json({ products: [], fallback: true });
  }
}
