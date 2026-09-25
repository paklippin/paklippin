export const runtime = 'edge';
import { NextResponse } from 'next/server';

// Server-side: hardcoded URLs are fine (no CORS between servers)
const WORKER_API = 'https://paklippinshop.paklippin.workers.dev';

export async function GET() {
  try {
    const res = await fetch(`${WORKER_API}/products`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products ?? []);
      if (list.length) {
        return NextResponse.json({ products: list, source: 'd1' });
      }
    }
  } catch (e) {
    console.warn('[products proxy] worker fetch failed:', (e as Error).message);
  }
  return NextResponse.json({ products: [], source: 'empty' });
}
