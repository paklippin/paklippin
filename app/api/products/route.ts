export const runtime = 'edge';
import { NextResponse } from 'next/server';

const D1_API = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';
const LIVE_API = process.env.NEXT_PUBLIC_PRODUCTS_URL || 'https://paklippin.com/api';

export async function GET() {
  // Tier 1: D1 via our Worker
  try {
    const res = await fetch(`${D1_API}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products ?? []);
      if (list.length) {
        return NextResponse.json({ products: list, source: 'd1' });
      }
    }
  } catch {}

  // Tier 2: live API
  try {
    const res = await fetch(`${LIVE_API}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products ?? []);
      if (list.length) {
        return NextResponse.json({ products: list, source: 'live' });
      }
    }
  } catch {}

  return NextResponse.json({ products: [], source: 'empty' });
}
