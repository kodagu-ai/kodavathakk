import { NextResponse } from "next/server";
import { serviceClient } from "../../lib/server";
import { badgeFor } from "../../lib/site";

// Public contributor leaderboard for the community page. Aggregates received/
// reviewed clips per contributor. Privacy: shows first name + okka + place
// only — the same credit line the ticker uses; never contact details.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = serviceClient();
    const { data, error } = await supabase
      .from("thakk_contributions")
      .select("name, okka, place, duration_seconds, contributor_key, content_type, created_at")
      .in("status", ["received", "reviewed"])
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw error;

    type Agg = {
      display: string;
      okka: string | null;
      place: string;
      clips: number;
      seconds: number;
      since: string;
      latest: string;
    };
    const byKey = new Map<string, Agg>();
    for (const r of data ?? []) {
      const firstName = (r.name || "").trim().split(/\s+/)[0] || "A speaker";
      const cur = byKey.get(r.contributor_key);
      if (cur) {
        cur.clips += 1;
        cur.seconds += r.duration_seconds ?? 0;
        if (r.created_at < cur.since) cur.since = r.created_at;
        if (r.created_at > cur.latest) cur.latest = r.created_at;
      } else {
        byKey.set(r.contributor_key, {
          display: firstName,
          okka: r.okka ?? null,
          place: r.place,
          clips: 1,
          seconds: r.duration_seconds ?? 0,
          since: r.created_at,
          latest: r.created_at,
        });
      }
    }

    const top = Array.from(byKey.values())
      .sort((a, b) => b.seconds - a.seconds || b.clips - a.clips)
      .slice(0, 24)
      .map((c) => ({ ...c, badge: badgeFor(c.clips, c.seconds).key }));

    const feed = (data ?? []).slice(0, 12).map((r) => ({
      name: (r.name || "").trim().split(/\s+/)[0] || "A speaker",
      okka: r.okka ?? null,
      place: r.place,
      contentType: r.content_type,
      seconds: r.duration_seconds ?? 0,
      at: r.created_at,
    }));

    return NextResponse.json(
      { top, feed },
      { headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  } catch (err) {
    console.error("leaderboard failed:", err);
    return NextResponse.json({ top: [], feed: [] }, { status: 200 });
  }
}
