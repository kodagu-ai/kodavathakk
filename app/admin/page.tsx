"use client";

import { useCallback, useEffect, useState } from "react";

// The backend tracker (admin view). Access is a single admin key (ADMIN_KEY
// env), kept in localStorage after first entry. All data flows through
// /api/admin/contributions, which verifies the key on every request.

type Row = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  place: string;
  okka: string | null;
  age_band: string | null;
  dialect: string;
  fluency: string | null;
  content_type: string;
  prompt_label: string | null;
  notes: string | null;
  consent: { archive?: boolean; research?: boolean; training?: boolean; public?: boolean } | null;
  duration_seconds: number | null;
  file_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  status: string;
  created_at: string;
  audioUrl: string | null;
};

function fmtDur(s: number | null) {
  if (!s) return "—";
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [entered, setEntered] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const saved = window.localStorage.getItem("thakk_admin_key");
    if (saved) {
      setKey(saved);
      setEntered(true);
    }
  }, []);

  const load = useCallback(
    async (k: string) => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch("/api/admin/contributions", {
          headers: { authorization: `Bearer ${k}` },
          cache: "no-store",
        });
        if (res.status === 401) {
          window.localStorage.removeItem("thakk_admin_key");
          setEntered(false);
          setErr("That key was not accepted.");
          return;
        }
        const body = await res.json();
        setRows(body.rows ?? []);
      } catch {
        setErr("Could not load the tracker.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (entered && key) load(key);
  }, [entered, key, load]);

  async function setStatus(id: string, status: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch("/api/admin/contributions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  }

  if (!entered) {
    return (
      <section>
        <div className="container" style={{ maxWidth: 460 }}>
          <h1>Tracker access</h1>
          <hr className="gold-rule" />
          <div className="field">
            <label htmlFor="adm-key">Admin key</label>
            <input
              id="adm-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && key.trim()) {
                  window.localStorage.setItem("thakk_admin_key", key.trim());
                  setEntered(true);
                }
              }}
            />
          </div>
          {err && <p className="notice-err">{err}</p>}
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!key.trim()) return;
              window.localStorage.setItem("thakk_admin_key", key.trim());
              setEntered(true);
            }}
          >
            Enter
          </button>
        </div>
      </section>
    );
  }

  const filtered = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.status] = (counts[r.status] ?? 0) + 1;

  return (
    <section>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ marginBottom: 0 }}>Backend tracker</h1>
          <button
            className="btn btn-outline"
            onClick={() => {
              window.localStorage.removeItem("thakk_admin_key");
              setEntered(false);
              setKey("");
            }}
          >
            Lock
          </button>
        </div>
        <hr className="gold-rule" style={{ marginTop: 18 }} />

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
          {["all", "received", "reviewed", "rejected", "uploading"].map((f) => (
            <button
              key={f}
              className={`choice ${filter === f ? "selected" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
              {f === "all" ? ` (${rows.length})` : counts[f] ? ` (${counts[f]})` : " (0)"}
            </button>
          ))}
          <button className="choice" onClick={() => load(key)} disabled={loading}>
            {loading ? "Refreshing…" : "↻ Refresh"}
          </button>
        </div>

        {err && <p className="notice-err">{err}</p>}

        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Speaker</th>
                <th>Details</th>
                <th>Consent</th>
                <th>Audio</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </td>
                  <td>
                    <strong>{r.name}</strong>
                    {r.okka ? ` (${r.okka})` : ""}
                    <br />
                    {r.place}
                    {r.age_band ? ` · ${r.age_band}` : ""}
                    <br />
                    <span style={{ color: "var(--mist)" }}>
                      {[r.phone, r.email].filter(Boolean).join(" · ") || "no contact"}
                    </span>
                  </td>
                  <td>
                    {r.content_type} · {r.dialect}
                    {r.fluency ? ` · ${r.fluency}` : ""}
                    <br />
                    {fmtDur(r.duration_seconds)} ·{" "}
                    {r.size_bytes ? `${(r.size_bytes / 1024 / 1024).toFixed(1)} MB` : "—"}
                    {r.prompt_label && (
                      <>
                        <br />
                        <em style={{ color: "var(--mist)" }}>{r.prompt_label}</em>
                      </>
                    )}
                    {r.notes && (
                      <>
                        <br />
                        <span style={{ color: "var(--coffee)" }}>{r.notes}</span>
                      </>
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {r.consent?.archive ? "archive " : ""}
                    {r.consent?.research ? "· research " : ""}
                    {r.consent?.training ? "· training " : ""}
                    {r.consent?.public ? "· public" : ""}
                  </td>
                  <td style={{ minWidth: 220 }}>
                    {r.audioUrl ? <audio controls preload="none" src={r.audioUrl} /> : "—"}
                  </td>
                  <td>
                    <span className={`badge badge-${r.status}`}>{r.status}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {r.status !== "reviewed" && (
                      <button className="choice" onClick={() => setStatus(r.id, "reviewed")}>✓ review ok</button>
                    )}{" "}
                    {r.status !== "rejected" && (
                      <button className="choice" onClick={() => setStatus(r.id, "rejected")}>✕ reject</button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "var(--mist)", padding: 24 }}>
                    Nothing here yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
