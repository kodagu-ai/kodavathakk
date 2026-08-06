"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

// Admin sign-in via magic link. The link is only ever sent to the one admin
// address, so although anyone can load this page, only the admin's inbox can
// complete a login. The server (middleware + every admin page/route) is the
// real gate; the client check just avoids emailing strangers.
const ADMIN_EMAIL = "poonacha@cyberhuman.ai";

function LoginInner() {
  const params = useSearchParams();
  const urlError = params.get("error");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState(urlError || "");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setStatus("error");
      setMessage("This admin area is restricted.");
      return;
    }
    setStatus("sending");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: ADMIN_EMAIL,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
          shouldCreateUser: false,
        },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Could not send the link. Try again."
      );
    }
  }

  return (
    <section>
      <div className="container" style={{ maxWidth: 460, paddingTop: 40, paddingBottom: 60 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/kodava-thakk-logo-transparent.svg" alt="" style={{ width: 88, marginBottom: 20 }} />
        <h1 style={{ fontSize: "2rem" }}>Admin sign in</h1>
        <hr className="gold-rule" />
        {status === "sent" ? (
          <div className="notice-ok">
            <p style={{ margin: 0 }}>
              Check your inbox — a one-time sign-in link is on its way to{" "}
              <strong>{ADMIN_EMAIL}</strong>. Open it <strong>on this device</strong>{" "}
              to enter the dashboard. You can close this tab.
            </p>
          </div>
        ) : (
          <>
            <p style={{ marginBottom: 20, color: "var(--mist)" }}>
              We&apos;ll email you a one-time magic link — no password to
              remember.
            </p>
            <form onSubmit={sendLink}>
              <div className="field">
                <label htmlFor="adm-email">Email</label>
                <input
                  id="adm-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              {message && (
                <p className="notice-err" role="alert">
                  {message}
                </p>
              )}
              <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send me a magic link"}
              </button>
            </form>
          </>
        )}
        <p style={{ marginTop: 22, fontSize: "0.85rem", color: "var(--mist)" }}>
          Access is limited to the project administrator.
        </p>
      </div>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
