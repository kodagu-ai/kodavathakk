import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Gates the /admin area. Refreshes the Supabase auth cookie on every request
// (so sessions stay alive) and redirects anyone who isn't the signed-in admin
// to /admin/login. First line of defence; the panel layout and every admin
// API route re-verify server-side.
const ADMIN_EMAIL = "poonacha@cyberhuman.ai";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // The login page and the magic-link callback must stay reachable while
  // signed out — never gate them (that would loop).
  const isPublicAdminPath =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth");

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return isPublicAdminPath
      ? response
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = !!user && (user.email || "").toLowerCase() === ADMIN_EMAIL;

  if (isPublicAdminPath) {
    if (isAdmin && pathname === "/admin/login")
      return NextResponse.redirect(new URL("/admin", request.url));
    return response;
  }
  if (!isAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
