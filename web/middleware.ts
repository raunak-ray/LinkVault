import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Landing page "/" is public and must never redirect.
 * Dashboard is protected client-side by RequireAuth + AuthProvider silent refresh.
 * We do NOT check the API httpOnly refreshToken here because that cookie is
 * host-only for the API origin (localhost:5000) and is never sent to the
 * Next.js origin (localhost:3000). Checking request.cookies.get("refreshToken")
 * here would always be undefined and would incorrectly bounce authenticated users
 * to /login on every refresh. Auth is handled by client-side silent refresh.
 */

export function middleware(request: NextRequest) {
  // Allow all routes through; client guards handle redirects correctly
  return NextResponse.next();
}

// Keep middleware active but with no matcher effect, or explicitly match only
// dashboard/auth for future server logic without cookie dependency.
// For now, keep a minimal matcher that does nothing but ensures landing is untouched.
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
