import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PAGES = ['orders', 'products', 'users', 'media', 'coupons', 'reviews', 'social', 'settings'];

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const path = req.nextUrl.pathname;

  // Non-admin host → do nothing
  if (!host.startsWith('admin.')) return NextResponse.next();

  // Passthrough internal paths
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path === '/favicon.ico' ||
    path === '/robots.txt' ||
    path === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Root → admin dashboard
  if (path === '/' || path === '') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // Known admin page (users, orders, etc.)
  const segment = path.slice(1).split('/')[0];
  if (ADMIN_PAGES.includes(segment)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/' + segment;
    return NextResponse.rewrite(url);
  }

  // Everything else on admin → 404 (no redirect, no CORS)
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'content-type': 'text/plain' },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
