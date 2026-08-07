"use client";

import { useCallback, useEffect, useState } from "react";

// Festival-drive manager: a window, a target, a banner. While a drive is
// active (and now is inside its window) the live site shows the gold banner
// with the drive's own hour counter.

type Drive = {
  id: string;
  name: string;
  name_kn: string | null;
  starts_at: string;
  ends_at: string;
  target_hours: number;
  active: boolean;
};

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DrivesAdmin() {
  const [rows, setRows] = useState<Drive[]>([]);
  const [err, setErr] = useState("");
  const [name, setName] = useState("");
  const [nameKn, setNameKn] = useState("");
  const [startsAt, setStartsAt] = useState(toLocalInput(new Date()));
  const [endsAt, setEndsAt] = useState(toLocalInput(new Date(Date.now() + 7 * 86400_000)));
  const [targetHours, setTargetHours] = useState("10");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/drives", { cache: "no-store" });
      const d = await res.json();
      setRows(d.drives ?? []);
    } catch {
      setErr("Could not load drives.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/drives", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save failed.");
      await load();
      return true;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 style={{ fontSize: "2rem", marginTop: 8 }}>Recording drives</h1>
      <hr className="gold-rule" />
      <p style={{ color: "var(--mist)", maxWidth: 720 }}>
        Tie collection pushes to moments the community already loves — Puthari,
        the Padayatra, Samaja gatherings. An <strong>active</strong> drive
        inside its window shows a gold banner on the home page and tracker with
        its own live hour counter.
      </p>

      <div className="card" style={{ marginBottom: 26, maxWidth: 720 }}>
        <p className="kicker">Create a drive</p>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="d-name">Name *</label>
            <input id="d-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Voices of the Walk — Padayatra" />
          </div>
          <div className="field">
            <label htmlFor="d-kn">Kannada name</label>
            <input id="d-kn" type="text" value={nameKn} onChange={(e) => setNameKn(e.target.value)} className="kn" />
          </div>
          <div className="field">
            <label htmlFor="d-start">Starts</label>
            <input id="d-start" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="d-end">Ends</label>
            <input id="d-end" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="d-target">Target hours</label>
            <input id="d-target" type="text" inputMode="decimal" value={targetHours} onChange={(e) => setTargetHours(e.target.value)} />
          </div>
        </div>
        {err && <p className="notice-err">{err}</p>}
        <button
          className="btn btn-primary"
          disabled={busy || !name.trim()}
          onClick={async () => {
            const ok = await post({
              name,
              nameKn,
              startsAt: new Date(startsAt).toISOString(),
              endsAt: new Date(endsAt).toISOString(),
              targetHours: Number(targetHours),
              active: true,
            });
            if (ok) setName("");
          }}
        >
          Create &amp; activate
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Drive</th>
              <th>Window</th>
              <th>Target</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>
                  <strong style={{ color: "var(--maroon)" }}>{d.name}</strong>
                  {d.name_kn && <><br /><span className="kn">{d.name_kn}</span></>}
                </td>
                <td style={{ fontSize: "0.85rem" }}>
                  {new Date(d.starts_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  <br />→ {new Date(d.ends_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </td>
                <td>{d.target_hours}h</td>
                <td>
                  <span className={`badge ${d.active ? "badge-reviewed" : "badge-uploading"}`}>
                    {d.active ? "active" : "off"}
                  </span>
                </td>
                <td>
                  <button className="choice" disabled={busy} onClick={() => post({ id: d.id, active: !d.active })}>
                    {d.active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ color: "var(--mist)", padding: 20 }}>
                  No drives yet. The Padayatra in late August is the obvious first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
