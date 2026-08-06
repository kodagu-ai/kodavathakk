import { serviceClient } from "../../../lib/server";
import { badgeFor } from "../../../lib/site";

export const dynamic = "force-dynamic";

// Contributor management: one row per person (deduped the same way the
// public counter works), with full contact details, output, badge tier, and
// consent posture. Sorted by time given.
export default async function ContributorsPage() {
  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("thakk_contributions")
    .select(
      "name, okka, place, phone, email, dialect, duration_seconds, contributor_key, consent, status, created_at"
    )
    .in("status", ["received", "reviewed"])
    .order("created_at", { ascending: false })
    .limit(5000);
  const rows = data ?? [];

  type Agg = {
    name: string;
    okka: string | null;
    place: string;
    phone: string | null;
    email: string | null;
    dialects: Set<string>;
    clips: number;
    seconds: number;
    training: number;
    publicOk: number;
    since: string;
  };
  const byKey = new Map<string, Agg>();
  for (const r of rows) {
    const consent = (r.consent ?? {}) as Record<string, boolean>;
    const cur = byKey.get(r.contributor_key);
    if (cur) {
      cur.clips += 1;
      cur.seconds += r.duration_seconds ?? 0;
      cur.dialects.add(r.dialect);
      if (consent.training) cur.training += 1;
      if (consent.public) cur.publicOk += 1;
      if (r.created_at < cur.since) cur.since = r.created_at;
      cur.phone = cur.phone || r.phone;
      cur.email = cur.email || r.email;
    } else {
      byKey.set(r.contributor_key, {
        name: r.name,
        okka: r.okka,
        place: r.place,
        phone: r.phone,
        email: r.email,
        dialects: new Set([r.dialect]),
        clips: 1,
        seconds: r.duration_seconds ?? 0,
        training: consent.training ? 1 : 0,
        publicOk: consent.public ? 1 : 0,
        since: r.created_at,
      });
    }
  }
  const people = Array.from(byKey.values()).sort(
    (a, b) => b.seconds - a.seconds || b.clips - a.clips
  );

  return (
    <>
      <h1 style={{ fontSize: "2rem", marginTop: 8 }}>Contributors</h1>
      <hr className="gold-rule" />
      {error && <p className="notice-err">Could not load contributors.</p>}
      <p style={{ color: "var(--mist)", marginBottom: 20 }}>
        {people.length} contributor{people.length === 1 ? "" : "s"} with counted
        recordings. Contact details are for coordination only — never published.
      </p>
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Contributor</th>
              <th>Contact</th>
              <th>Dialect(s)</th>
              <th>Clips</th>
              <th>Minutes</th>
              <th>Badge</th>
              <th>Consent</th>
              <th>First gave</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p, i) => {
              const b = badgeFor(p.clips, p.seconds);
              return (
                <tr key={i}>
                  <td>
                    <strong style={{ color: "var(--maroon)" }}>{p.name}</strong>
                    {p.okka ? ` · ${p.okka}` : ""}
                    <br />
                    <span style={{ color: "var(--mist)" }}>{p.place}</span>
                  </td>
                  <td style={{ fontSize: "0.84rem" }}>
                    {[p.phone, p.email].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td>{Array.from(p.dialects).join(", ")}</td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>{p.clips}</td>
                  <td style={{ fontVariantNumeric: "tabular-nums" }}>
                    {Math.round(p.seconds / 60)}
                  </td>
                  <td>
                    <span title={b.meaning}>
                      {b.motif} {b.label}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.84rem" }}>
                    {p.training}/{p.clips} training · {p.publicOk}/{p.clips} public
                  </td>
                  <td style={{ whiteSpace: "nowrap", fontSize: "0.84rem" }}>
                    {new Date(p.since).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </td>
                </tr>
              );
            })}
            {people.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: "var(--mist)", padding: 20 }}>
                  No contributors yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
