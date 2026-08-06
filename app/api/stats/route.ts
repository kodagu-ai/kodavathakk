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
