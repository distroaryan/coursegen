import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

// Demo course that is publicly accessible without authentication
const DEMO_COURSE_ID = "c743ec58-f854-4a10-b883-227e9137f5f6";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Fast-pass: always public ──────────────────────────────────
  if (
    pathname === "/" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/inngest") ||
    // demo course is publicly accessible
    pathname.startsWith(`/course/${DEMO_COURSE_ID}`)
  ) {
    return NextResponse.next();
  }

  // ── 2. Only check session for routes that actually need protection ─
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/course") ||
    pathname.startsWith("/create-course");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // ── 3. Fetch session only when needed ────────────────────────────
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude static assets, images, fonts and inngest from middleware entirely
  matcher: [
    "/((?!api/inngest|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
