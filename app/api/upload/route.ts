export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const folder = req.nextUrl.searchParams.get('folder') || 'uploads';

    const upstream = await fetch(`${API_BASE}/upload?folder=${folder}`, {
      method: 'POST',
      body: form,
    });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch (e) {
    return NextResponse.json({ error: String((e as Error).message) }, { status: 500 });
  }
}
