export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

async function forward(req: NextRequest, method: string) {
  const path = req.nextUrl.pathname.replace('/api/admin', '');
  const url = `${API_BASE}${path}${req.nextUrl.search || ''}`;
  try {
    const init: RequestInit = { method, headers: { Accept: 'application/json' } };
    if (method !== 'GET' && method !== 'DELETE') {
      init.body = await req.text();
      (init.headers as any)['Content-Type'] = 'application/json';
    }
    const res = await fetch(url, init);
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message) }, { status: 502 });
  }
}

export async function GET(req: NextRequest)    { return forward(req, 'GET'); }
export async function POST(req: NextRequest)   { return forward(req, 'POST'); }
export async function PATCH(req: NextRequest)  { return forward(req, 'PATCH'); }
export async function DELETE(req: NextRequest) { return forward(req, 'DELETE'); }
