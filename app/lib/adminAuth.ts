import { createSupabaseServerClient } from "./supabase/server";

// The single admin allowed into /admin. Not a secret — an allow-list of one.
// Everything under /admin and /api/admin verifies the signed-in user's email
// against it.
export const ADMIN_EMAIL = "poonacha@cyberhuman.ai";

// Returns the signed-in Supabase user IFF their email is the admin email,
// else null. Server-only: middleware, the panel layout, every admin page and
// every admin API route use this as the single source of truth.
export async function getAdminUser() {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    if ((user.email || "").toLowerCase() !== ADMIN_EMAIL) return null;
    return user;
  } catch {
    return null;
  }
}
