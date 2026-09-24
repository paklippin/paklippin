export const runtime = 'edge';
import { NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/settings`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ settings: {} });
  }
}
