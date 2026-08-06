import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

// Magic-link landing. Supabase redirects here with a `code` (PKCE) which we
// exchange for a session cookie, then send the admin to the dashboard.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error_description") || searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${origin}/admin/login?error=${encodeURIComponent(error)}`
    );
  }
  if (code) {
    const supabase = createSupabaseServerClient();
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      return NextResponse.redirect(
        `${origin}/admin/login?error=${encodeURIComponent(exchangeError.message)}`
      );
    }
  }
  return NextResponse.redirect(`${origin}/admin`);
}
