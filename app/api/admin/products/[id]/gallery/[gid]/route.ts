export const runtime = 'edge';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://shop.paklippin.com';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; gid: string }> }) {
  const { id, gid } = await params;
  try {
    const res = await fetch(`${API_BASE}/admin/products/${id}/gallery/${gid}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
