import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If env vars aren't set, skip middleware entirely
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.next({ request });
    }

    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresh the session — required for Supabase SSR
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Redirect authenticated users away from auth pages
    if (user && (pathname === "/login" || pathname === "/signup")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Protect app routes
    const appRoutes = ["/dashboard", "/courses", "/leaderboard", "/profile"];
    const isAppRoute = appRoutes.some((route) => pathname.startsWith(route));

    if (!user && isAppRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return supabaseResponse;
  } catch {
    // If middleware crashes for any reason, pass through to avoid 500
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|bg-hero.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
