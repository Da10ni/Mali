// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Define protected routes (require login)
  const protectedRoutes = ['/mybookings', '/myadmin'];
  
  // 2. Login page path
  const loginPath = '/login';
  
  // 3. Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // 4. Check route types
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isLoginPage = pathname === loginPath;

  try {
    if (token) {
      // 5. Verify token if exists
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      
      console.log('User is logged in:', payload.userId);

      // 6. If logged-in user tries to access login page, redirect to /myadmin
      if (isLoginPage) {
        const adminUrl = new URL('/myadmin', request.url);
        return NextResponse.redirect(adminUrl);
      }
      
      // 7. Allow access to protected routes for logged-in users
      if (isProtectedRoute) {
        return NextResponse.next();
      }
    }

    // 8. If no token and trying to access protected route, redirect to login
    if (!token && isProtectedRoute) {
      const loginUrl = new URL(loginPath, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // 9. Default behavior for all other cases
    return NextResponse.next();

  } catch (error) {
    console.error('Token verification failed:', error);
    
    // 10. Clear invalid token and redirect
    const response = isProtectedRoute 
      ? NextResponse.redirect(new URL(loginPath, request.url))
      : NextResponse.next();
    
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/mybookings/:path*',
    '/myadmin/:path*',
    '/login'
  ],
};