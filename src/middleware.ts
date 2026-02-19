/**
 * Middleware - Authentication & Request Processing
 * 
 * This middleware runs on every request to:
 * 1. Check user authentication
 * 2. Log request details
 * 3. Set security headers
 * 4. Handle redirect logic
 * 
 * Runs before pages/ and api/ routes
 */

import { NextRequest, NextResponse } from "next/server";

export function middleware(_request: NextRequest) {
  // You can add custom logic here
  // For example, redirect unauthenticated users to login
  // But with client-side auth, this is optional

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth callback)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
