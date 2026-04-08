import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!);
const ALLOWED_ROLES = ['admin', 'manager'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_access_token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ error: 'Erişim reddedildi.' }, { status: 403 });
    }

    const exp = payload.exp || 0;
    if (exp * 1000 < Date.now() + 30 * 60 * 1000) {
      const res = NextResponse.next();
      res.cookies.set('admin_access_token', '', { maxAge: 0, path: '/' });
      return res;
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = { matcher: ['/admin/:path*'] };
