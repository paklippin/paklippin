import { NextRequest, NextResponse } from 'next/server';

const STOREFRONT_URL = 'https://paklippinshop.pages.dev';

const ADMIN_PATHS = new Set([
  '', 'orders', 'products', 'users', 'media',
  'coupons', 'reviews', 'social', 'settings',
]);

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const path = req.nextUrl.pathname;
  const isAdminHost = host.startsWith('admin.');

  if (!isAdminHost) return NextResponse.next();

  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path === '/favicon.ico' ||
    path === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const cleaned = path.replace(/^\/+|\/+$/g, '');

  if (cleaned === '') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  if (ADMIN_PATHS.has(cleaned)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/' + cleaned;
    return NextResponse.rewrite(url);
  }

  return NextResponse.redirect(STOREFRONT_URL + path + req.nextUrl.search, 307);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
