import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(request) {
  const token = request.cookies.get('token')?.value

  // Protect dashboard and profile routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/profile')) {
    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirect authenticated users away from login/register
  if (request.nextUrl.pathname === '/' || 
      request.nextUrl.pathname === '/register') {
    if (token && verifyToken(token)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}