// This is Next.js middleware that runs on every request to the app. 
// Its job is to create a unique cart session ID for each user so you can track 
// their cart even if they're not logged in.
// In simple terms, on every request it checks if the user has a cart ID. If not, gives them one. 
// This lets us track their cart across browsing sessions.

// These import two classes from Next.js that intercept requests and responses.
import { NextRequest, NextResponse } from 'next/server';

// Next.js looks for this function and automatically runs it before every request.
export function middleware(request: NextRequest) {

    // Creates a response that continues to the next handler (my actual page/API route). 
    // This basically says "allow the request to proceed normally."
  const response = NextResponse.next();

  // Checks if the user already has a cookie, if they don't we create one
  if (!request.cookies.get('sessionCartId')) {
    response.cookies.set('sessionCartId', crypto.randomUUID());
  }

  return response;
}

// This tells Next.js which routes should run this middleware. The regex pattern means 
// "run middleware on all routes EXCEPT Next.js internal files 
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
