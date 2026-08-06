import Link from "next/link";
import { serviceClient } from "../../lib/server";

export const dynamic = "force-dynamic";

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="card" style={{ padding: "18px 22px", minWidth: 150 }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          fontWeight: 700,
          lineHeight: 1,
          color: accent ? "var(--gold)" : "var(--maroon)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--mist)", marginTop: 8 }}>{label}</div>
    </div>
  );
}

const DIALECT_LABEL: Record<string, string> = {
  mendele: "Mendele",
  kiggat: "Kiggat",
  diaspora: "Diaspora",
  unsure: "Unclassified",
};

export default async function AdminDashboard() {
  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("thakk_contributions")
    .select("status, dialect, duration_seconds, contributor_key, name, place, content_type, created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  const rows = data ?? [];
  const counted = rows.filter((r) => r.status === "received" || r.status === "reviewed");
  const seconds = counted.reduce((s, r) => s + (r.duration_seconds ?? 0), 0);
  const hours = Math.round((seconds / 3600) * 10) / 10;
  const contributors = new Set(counted.map((r) => r.contributor_key)).size;
  const byStatus: Record<string, number> = {};
  for (const r of rows) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  const byDialect: Record<string, number> = {};
  for (const r of counted)
    byDialect[r.dialect] = (byDialect[r.dialect] ?? 0) + (r.duration_seconds ?? 0);
  const dialectTotal = Object.values(byDialect).reduce((a, b) => a + b, 0) || 1;
  const recent = rows.slice(0, 8);

  return (
    <>
      <h1 style={{ fontSize: "2rem", marginTop: 8 }}>Dashboard</h1>
      <hr className="gold-rule" />
      {error && (
        <p className="notice-err">Could not load data — check the Supabase env vars.</p>
      )}

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 30 }}>
        <Stat label="Voices contributed" value={contributors} accent />
        <Stat label="Hours in the corpus" value={hours} accent />
        <Stat label="Awaiting review" value={byStatus.received ?? 0} />
        <Stat label="Reviewed" value={byStatus.reviewed ?? 0} />
        <Stat label="Rejected" value={byStatus.rejected ?? 0} />
        <Stat label="Stuck uploading" value={byStatus.uploading ?? 0} />
      </div>

      {(byStatus.received ?? 0) > 0 && (
        <p style={{ marginBottom: 30 }}>
          <Link href="/admin/contributions?status=received" className="btn btn-primary">
            Review {byStatus.received} new recording{(byStatus.received ?? 0) === 1 ? "" : "s"} →
          </Link>
        </p>
      )}

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <p className="kicker">Dialect balance (counted hours)</p>
          {Object.keys(byDialect).length === 0 ? (
            <p style={{ margin: 0, color: "var(--mist)" }}>No counted recordings yet.</p>
          ) : (
            Object.entries(byDialect)
              .sort((a, b) => b[1] - a[1])
              .map(([k, secs]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.92rem" }}>
                    <span>{DIALECT_LABEL[k] ?? k}</span>
                    <span style={{ color: "var(--mist)" }}>
                      {(secs / 3600).toFixed(1)}h · {Math.round((secs / dialectTotal) * 100)}%
                    </span>
                  </div>
                  <div className="progress">
                    <span style={{ width: `${(secs / dialectTotal) * 100}%` }} />
                  </div>
                </div>
              ))
          )}
        </div>
        <div className="card">
          <p className="kicker">Latest activity</p>
          {recent.length === 0 ? (
            <p style={{ margin: 0, color: "var(--mist)" }}>Nothing yet.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: "0.92rem" }}>
              {recent.map((r, i) => (
                <li
                  key={i}
                  style={{
                    padding: "8px 0",
                    borderBottom: i === recent.length - 1 ? "none" : "1px solid var(--line)",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <span>
                    <strong style={{ color: "var(--maroon)" }}>{r.name}</strong> · {r.place} ·{" "}
                    {r.content_type}
                  </span>
                  <span className={`badge badge-${r.status}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
