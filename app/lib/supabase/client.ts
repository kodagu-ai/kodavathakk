"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client (auth only — data goes through server routes).
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
