export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const products = Array.isArray(body.products) ? body.products : [];
    const results = { created: 0, failed: 0, errors: [] as string[] };

    for (const p of products) {
      try {
        const res = await fetch(`${API_BASE}/admin/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(p),
        });
        if (res.ok) results.created++;
        else { results.failed++; results.errors.push(p.name || 'unknown'); }
      } catch {
        results.failed++;
        results.errors.push(p.name || 'unknown');
      }
    }
    return NextResponse.json({ ok: true, ...results });
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
}
