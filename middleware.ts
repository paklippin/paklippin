import { NextRequest, NextResponse } from 'next/server';

const STOREFRONT_HOST = 'paklippinshop.pages.dev';

const ADMIN_PAGES = ['orders', 'products', 'users', 'media', 'coupons', 'reviews', 'social', 'settings'];

export function middleware(req: NextRequest) {
  // ✅ Try EVERY possible header — one of these will have admin.paklippin.com
  const host =
    req.headers.get('x-forwarded-host') ||
    req.headers.get('x-original-host') ||
    req.headers.get('host') ||
    req.nextUrl.hostname ||
    '';

  const path = req.nextUrl.pathname;

  // Passthrough for non-admin
  if (!host.includes('admin.')) {
    return NextResponse.next();
  }

  // Passthrough internal paths
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path === '/favicon.ico' ||
    path === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  // Root → admin dashboard
  if (path === '/' || path === '') {
    const url = req.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.rewrite(url);
  }

  // Admin sub-pages → /admin/xxx
  const segment = path.replace(/^\/+|\/+$/g, '');
  if (ADMIN_PAGES.includes(segment)) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/' + segment;
    return NextResponse.rewrite(url);
  }

  // Everything else → 307 redirect to storefront
  const target = new URL(path + req.nextUrl.search, 'https://' + STOREFRONT_HOST);
  return NextResponse.redirect(target, 307);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
