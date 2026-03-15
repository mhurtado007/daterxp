import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase sets a cookie named sb-<ref>-auth-token when logged in
  const hasSession = request.cookies
    .getAll()
    .some(
      (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );

  // Redirect authenticated users away from auth pages
  if (hasSession && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect app routes
  const appRoutes = ["/dashboard", "/courses", "/leaderboard", "/profile"];
  const isAppRoute = appRoutes.some((route) => pathname.startsWith(route));

  if (!hasSession && isAppRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|bg-hero.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
