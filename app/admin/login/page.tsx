"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Admin sign-in. Auth is Supabase email + password; only the admin email
// passes the middleware/layout gates, so a stray sign-in gets bounced.
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      window.location.href = "/admin";
    } catch (e) {
      setErr(
        e instanceof Error && /credential/i.test(e.message)
          ? "Email or password did not match."
          : "Could not sign in. Please try again."
      );
      setBusy(false);
    }
  }

  return (
    <section>
      <div className="container" style={{ maxWidth: 440, paddingTop: 40, paddingBottom: 60 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/kodava-thakk-logo-transparent.svg" alt="" style={{ width: 88, marginBottom: 20 }} />
        <h1 style={{ fontSize: "2rem" }}>Admin sign in</h1>
        <hr className="gold-rule" />
        <form onSubmit={signIn}>
          <div className="field">
            <label htmlFor="adm-email">Email</label>
            <input
              id="adm-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="adm-pass">Password</label>
            <input
              id="adm-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {err && (
            <p className="notice-err" role="alert">
              {err}
            </p>
          )}
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={{ marginTop: 22, fontSize: "0.85rem", color: "var(--mist)" }}>
          Access is limited to the project administrator.
        </p>
      </div>
    </section>
  );
}
