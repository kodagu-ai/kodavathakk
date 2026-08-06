import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS (the tables have RLS on with no
// policies, so this is the ONLY way in). Server-only: never import from a
// client component.
export function serviceClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role not configured.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (u: any, i: any) => fetch(u, { ...i, cache: "no-store" }) },
  });
}

export const VOICE_BUCKET = "thakk-voice";

// Admin access: a single bearer key (set ADMIN_KEY in the environment).
// The tracker is single-admin; every /api/admin/* route checks this.
export function isAdmin(req: Request): boolean {
  const configured = process.env.ADMIN_KEY;
  if (!configured) return false;
  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && token === configured;
}

export const str = (v: unknown, max = 500): string | null =>
  typeof v === "string" ? v.trim().slice(0, max) || null : null;
