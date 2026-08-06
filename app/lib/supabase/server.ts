import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Cookie-based Supabase client for server components and route handlers.
// Used ONLY for auth/session reading — data access goes through the
// service-role client in app/lib/server.ts.
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error("Supabase auth env not configured.");
  const store = cookies();
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            store.set(name, value, options)
          );
        } catch {
          // Server components can't set cookies; middleware handles refresh.
        }
      },
    },
  });
}
