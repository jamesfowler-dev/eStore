// This is Next.js middleware that runs on every request to the app. 
// Its job is to create a unique cart session ID for each user so you can track 
// their cart even if they're not logged in.
// In simple terms, on every request it checks if the user has a cart ID. If not, gives them one. 
// This lets us track their cart across browsing sessions.

// These import two classes from Next.js that intercept requests and responses.
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import NEXTAUTH_SECRET from 'dotenv';

// Next.js looks for this function and automatically runs it before every request.
export async function middleware(request: NextRequest) {

  // Creates a response that continues to the next handler (my actual page/API route). 
  // This basically says "allow the request to proceed normally."
  const response = NextResponse.next();

  // Array of patterns of paths we want to protect, basically for routes that require authentication
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];

  // Get pathname from the req URL object 
  const { pathname } = request.nextUrl;

  // Calls getToken() and pass in NEXTAUTH secret to get the current user session
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if user is not authenticated and accessing a protected path/route. If so, 
  // returns false but should redirect to /sign-in
  if (!token && protectedPaths.some((p) => p.test(pathname))) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Checks if the user already has a cookie, if they don't we create one
  if (!request.cookies.get('sessionCartId')) {
    response.cookies.set('sessionCartId', crypto.randomUUID());
  }

  return response;
}

// This tells Next.js which routes should run this middleware. The regex pattern means 
// "run middleware on all routes EXCEPT Next.js internal files. 
// Another way of looking at it, exports a config object to tell Next.js to run this middleware on 
// all routes except static/image assets and favicon.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
