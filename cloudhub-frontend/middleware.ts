import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const authRequiredPaths = [
  '/dashboard',
  '/dashboard/marketplace',
  '/dashboard/my-hackathons',
  '/dashboard/teams',
  '/dashboard/messages',
  '/dashboard/settings',
  '/dashboard/profile',
];

// Paths that require organizer role
const organizerPaths = [
  '/dashboard/organizer',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const userDataStr = request.cookies.get('user')?.value;
  
  // Safely parse user data
  let userData = null;
  if (userDataStr) {
    try {
      userData = JSON.parse(userDataStr);
    } catch (error) {
      console.error('Failed to parse user data from cookie:', error);
      // If we can't parse user data, treat as if no user data exists
      userData = null;
    }
  }
  
  // Check if path requires authentication
  const requiresAuth = authRequiredPaths.some(path => pathname.startsWith(path));
  
  // If path requires auth and no token exists, redirect to login
  if (requiresAuth && !accessToken) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Check organizer-only paths
  const isOrganizerPath = organizerPaths.some(path => pathname.startsWith(path));
  if (isOrganizerPath && userData?.role !== 'organizer') {
    // Redirect non-organizers to participant dashboard
    console.log('Redirecting non-organizer from organizer path:', { 
      pathname, 
      userRole: userData?.role, 
      hasUserData: !!userData,
      hasAccessToken: !!accessToken 
    });
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If we have a token and we're on the login page,
  // redirect to the dashboard
  if (accessToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/login'
  ],
}; 