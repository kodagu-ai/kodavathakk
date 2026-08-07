import { NextResponse } from "next/server";
import { serviceClient } from "../../lib/server";

// Public corpus stats for the dial, ticker, and tracker. Counts only clips
// that actually arrived ('received' or 'reviewed'). Cached briefly at the
// edge so the home-page dial can poll without hammering the database.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = serviceClient();
    const { data, error } = await supabase
      .from("thakk_contributions")
      .select(
        "name, place, dialect, content_type, duration_seconds, contributor_key, created_at"
      )
      .in("status", ["received", "reviewed"])
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw error;

    const rows = data ?? [];
    const seconds = rows.reduce((s, r) => s + (r.duration_seconds ?? 0), 0);
    const contributors = new Set(rows.map((r) => r.contributor_key)).size;

    // Validated hours: clips where ≥2 listeners agreed (audible AND Thakk)
    // and positives outnumber negatives.
    let validatedSeconds = 0;
    let validationVotes = 0;
    {
      const { data: votes } = await supabase
        .from("thakk_validations")
        .select("contribution_id, audible, is_thakk")
        .limit(20000);
      const tally = new Map<string, { pos: number; neg: number }>();
      for (const v of votes ?? []) {
        const t = tally.get(v.contribution_id) ?? { pos: 0, neg: 0 };
        if (v.audible && v.is_thakk) t.pos += 1;
        else t.neg += 1;
        tally.set(v.contribution_id, t);
      }
      validationVotes = (votes ?? []).length;
      // rows were fetched without ids; refetch minimal id+duration map only
      // when there are any votes at all.
      if (tally.size > 0) {
        const { data: durRows } = await supabase
          .from("thakk_contributions")
          .select("id, duration_seconds")
          .in("id", Array.from(tally.keys()));
        for (const r of durRows ?? []) {
          const t = tally.get(r.id);
          if (t && t.pos >= 2 && t.pos > t.neg)
            validatedSeconds += r.duration_seconds ?? 0;
        }
      }
    }

    // Active festival drive (window contains now).
    let activeDrive: Record<string, unknown> | null = null;
    {
      const nowIso = new Date().toISOString();
      const { data: drives } = await supabase
        .from("thakk_drives")
        .select("name, name_kn, starts_at, ends_at, target_hours")
        .eq("active", true)
        .lte("starts_at", nowIso)
        .gte("ends_at", nowIso)
        .limit(1);
      const d = drives?.[0];
      if (d) {
        const driveSeconds = rows
          .filter((r) => r.created_at >= d.starts_at && r.created_at <= d.ends_at)
          .reduce((s, r) => s + (r.duration_seconds ?? 0), 0);
        activeDrive = {
          name: d.name,
          nameKn: d.name_kn,
          endsAt: d.ends_at,
          targetHours: Number(d.target_hours),
          driveHours: Math.round((driveSeconds / 3600) * 10) / 10,
        };
      }
    }

    const byDialect: Record<string, number> = {};
    for (const r of rows) {
      byDialect[r.dialect] = (byDialect[r.dialect] ?? 0) + (r.duration_seconds ?? 0);
    }

    // Recent ticker items — first name + place only (speakers are credited,
    // never exposed: no phone/email/full identity).
    const recent = rows.slice(0, 14).map((r) => ({
      name: (r.name || "").trim().split(/\s+/)[0] || "A speaker",
      place: r.place,
      contentType: r.content_type,
      seconds: r.duration_seconds ?? 0,
      at: r.created_at,
    }));

    return NextResponse.json(
      {
        contributors,
        recordings: rows.length,
        seconds,
        hours: Math.round((seconds / 3600) * 10) / 10,
        validatedSeconds,
        validatedHours: Math.round((validatedSeconds / 3600) * 10) / 10,
        validationVotes,
        activeDrive,
        byDialect,
        recent,
      },
      {
        headers: {
          "cache-control": "public, s-maxage=30, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    console.error("stats failed:", err);
    return NextResponse.json(
      { contributors: 0, recordings: 0, seconds: 0, hours: 0, byDialect: {}, recent: [] },
      { status: 200 }
    );
  }
}
