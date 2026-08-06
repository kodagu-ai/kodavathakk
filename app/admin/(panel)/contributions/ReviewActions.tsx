"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// One-tap review actions. Session-cookie authenticated (the API route
// verifies the admin session server-side).
export default function ReviewActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [current, setCurrent] = useState(status);

  async function set(next: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/contributions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (res.ok) {
        setCurrent(next);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
      {current !== "reviewed" && (
        <button className="choice" onClick={() => set("reviewed")} disabled={busy}>
          ✓ Approve
        </button>
      )}
      {current !== "rejected" && (
        <button className="choice" onClick={() => set("rejected")} disabled={busy}>
          ✕ Reject
        </button>
      )}
      {current === "rejected" && (
        <button className="choice" onClick={() => set("received")} disabled={busy}>
          ↩ Restore
        </button>
      )}
    </div>
  );
}
