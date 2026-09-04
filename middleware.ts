import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/api/health', '/api/v1/events'];
const VALID_ROLES = new Set(['viewer', 'analyst', 'reviewer', 'admin']);

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) return NextResponse.next();

  if (process.env.NODE_ENV !== 'production') return NextResponse.next();

  const expectedProxySecret = process.env.AUTH_PROXY_SHARED_SECRET;
  const suppliedProxySecret = request.headers.get('x-auth-proxy-secret');
  const subject = request.headers.get('x-auth-subject');
  const organisationId = request.headers.get('x-auth-organisation');
  const role = request.headers.get('x-auth-role');

  if (
    !expectedProxySecret ||
    !suppliedProxySecret ||
    suppliedProxySecret !== expectedProxySecret ||
    !subject ||
    !organisationId ||
    !role ||
    !VALID_ROLES.has(role)
  ) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  const headers = new Headers(request.headers);
  headers.delete('x-auth-proxy-secret');
  headers.set('x-principal-subject', subject);
  headers.set('x-principal-organisation', organisationId);
  headers.set('x-principal-role', role);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
