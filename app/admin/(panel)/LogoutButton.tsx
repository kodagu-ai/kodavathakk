"use client";

import { createBrowserClient } from "@supabase/ssr";

export default function LogoutButton() {
  async function logout() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }
  return (
    <button className="choice" onClick={logout} style={{ fontWeight: 600 }}>
      Sign out
    </button>
  );
}
