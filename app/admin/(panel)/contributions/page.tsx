import Link from "next/link";
import { serviceClient, VOICE_BUCKET } from "../../../lib/server";
import ReviewActions from "./ReviewActions";

export const dynamic = "force-dynamic";

// The review queue: every recording with playback, metadata, consent, and
// one-tap review actions. Filter with ?status=received|reviewed|rejected|uploading.

const FILTERS = ["all", "received", "reviewed", "rejected", "uploading"] as const;

function fmtDur(s: number | null) {
  if (!s) return "—";
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default async function ContributionsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const filter = FILTERS.includes(searchParams.status as (typeof FILTERS)[number])
    ? (searchParams.status as string)
    : "all";

  const supabase = serviceClient();
  let query = supabase
    .from("thakk_contributions")
    .select(
      "id, name, phone, email, place, okka, age_band, dialect, fluency, content_type, prompt_label, notes, consent, duration_seconds, storage_path, size_bytes, status, created_at, analysis"
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (filter !== "all") query = query.eq("status", filter);
  const { data, error } = await query;
  const rows = data ?? [];

  // Community validation tallies for the listed clips.
  const voteTally = new Map<string, { pos: number; neg: number }>();
  if (rows.length) {
    const { data: votes } = await supabase
      .from("thakk_validations")
      .select("contribution_id, audible, is_thakk")
      .in("contribution_id", rows.map((r) => r.id));
    for (const v of votes ?? []) {
      const t = voteTally.get(v.contribution_id) ?? { pos: 0, neg: 0 };
      if (v.audible && v.is_thakk) t.pos += 1;
      else t.neg += 1;
      voteTally.set(v.contribution_id, t);
    }
  }

  const withAudio = await Promise.all(
    rows.map(async (r) => {
      let audioUrl: string | null = null;
      if (r.storage_path && r.status !== "uploading") {
        const { data: signed } = await supabase.storage
          .from(VOICE_BUCKET)
          .createSignedUrl(r.storage_path, 3600);
        audioUrl = signed?.signedUrl ?? null;
      }
      return { ...r, audioUrl };
    })
  );

  return (
    <>
      <h1 style={{ fontSize: "2rem", marginTop: 8 }}>Review queue</h1>
      <hr className="gold-rule" />
      {error && <p className="notice-err">Could not load contributions.</p>}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
        {FILTERS.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/admin/contributions" : `/admin/contributions?status=${f}`}
            className={`choice ${filter === f ? "selected" : ""}`}
          >
            {f}
          </Link>
        ))}
      </div>

      {withAudio.length === 0 ? (
        <p style={{ color: "var(--mist)" }}>Nothing here.</p>
      ) : (
        <div className="grid" style={{ gap: 16 }}>
          {withAudio.map((r) => (
            <div className="card" key={r.id} style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ minWidth: 220, flex: "1 1 260px" }}>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--ink)" }}>
                    {r.name}
                    {r.okka ? ` · ${r.okka}` : ""}{" "}
                    <span className={`badge badge-${r.status}`} style={{ marginLeft: 6 }}>
                      {r.status}
                    </span>
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "var(--mist)" }}>
                    {r.place}
                    {r.age_band ? ` · ${r.age_band}` : ""} · {r.dialect}
                    {r.fluency ? ` · ${r.fluency}` : ""} · {r.content_type} · {fmtDur(r.duration_seconds)}
                    {r.size_bytes ? ` · ${(r.size_bytes / 1024 / 1024).toFixed(1)} MB` : ""}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--mist)" }}>
                    {[r.phone, r.email].filter(Boolean).join(" · ") || "no contact"} ·{" "}
                    {new Date(r.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--kaveri)" }}>
                    Consent:{" "}
                    {["archive", "research", "training", "public"]
                      .filter((k) => (r.consent as Record<string, boolean> | null)?.[k])
                      .join(" · ") || "—"}
                  </p>
                  {(() => {
                    const t = voteTally.get(r.id);
                    const a = (r.analysis ?? {}) as {
                      client?: Record<string, number>;
                      flags?: Record<string, boolean>;
                    };
                    const flags = Object.keys(a.flags ?? {});
                    const validated = t && t.pos >= 2 && t.pos > t.neg;
                    if (!t && !a.client && flags.length === 0) return null;
                    return (
                      <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
                        {t && (
                          <span style={{ color: validated ? "var(--forest)" : "var(--mist)", fontWeight: 600 }}>
                            👂 {t.pos}✓ {t.neg}✗{validated ? " · validated" : ""}
                          </span>
                        )}
                        {a.client && (
                          <span style={{ color: "var(--mist)" }}>
                            {t ? " · " : ""}
                            {a.client.rmsDb !== undefined ? `${a.client.rmsDb} dB` : ""}
                            {a.client.silenceRatio !== undefined
                              ? ` · ${Math.round(a.client.silenceRatio * 100)}% silence`
                              : ""}
                          </span>
                        )}
                        {flags.length > 0 && (
                          <span style={{ color: "var(--maroon)", fontWeight: 600 }}>
                            {" "}
                            · ⚠ {flags.join(", ")}
                          </span>
                        )}
                      </p>
                    );
                  })()}
                  {r.prompt_label && (
                    <p style={{ margin: "6px 0 0", fontSize: "0.88rem", fontStyle: "italic", color: "var(--mist)" }}>
                      Prompt: {r.prompt_label}
                    </p>
                  )}
                  {r.notes && (
                    <p style={{ margin: "6px 0 0", fontSize: "0.92rem" }}>{r.notes}</p>
                  )}
                </div>
                <div style={{ flex: "1 1 280px", maxWidth: 420 }}>
                  {r.audioUrl ? (
                    <audio controls preload="none" src={r.audioUrl} style={{ width: "100%", marginTop: 0 }} />
                  ) : (
                    <p style={{ color: "var(--mist)", fontSize: "0.88rem" }}>No audio yet.</p>
                  )}
                  <ReviewActions id={r.id} status={r.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
