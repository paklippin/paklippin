import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const path = req.nextUrl.pathname;
  const isAdminSubdomain = host.startsWith('admin.');

  if (isAdminSubdomain) {
    if (path === '/') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
    if (!path.startsWith('/admin') && !path.startsWith('/api') && !path.startsWith('/_next')) {
      const url = req.nextUrl.clone();
      url.pathname = `/admin${path}`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
