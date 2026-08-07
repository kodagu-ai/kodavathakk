import { NextResponse } from "next/server";
import { serviceClient, VOICE_BUCKET } from "../../../lib/server";

// Listen-and-verify: hand the browser one clip that still needs votes.
// PRIVACY RULE: only clips whose speaker granted public-listening consent
// ever enter the open validation queue. Pass ?ballot=<id> so a validator is
// never served a clip twice; clips stop being served at 3 votes.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ballot = new URL(req.url).searchParams.get("ballot") || "";
  try {
    const supabase = serviceClient();
    const { data: clips, error } = await supabase
      .from("thakk_contributions")
      .select("id, name, okka, place, dialect, content_type, duration_seconds, storage_path, consent, created_at")
      .in("status", ["received", "reviewed"])
      .contains("consent", { public: true })
      .not("storage_path", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;

    const ids = (clips ?? []).map((c) => c.id);
    let votesByClip = new Map<string, { count: number; mine: boolean }>();
    if (ids.length) {
      const { data: votes } = await supabase
        .from("thakk_validations")
        .select("contribution_id, ballot_id")
        .in("contribution_id", ids);
      for (const v of votes ?? []) {
        const cur = votesByClip.get(v.contribution_id) ?? { count: 0, mine: false };
        cur.count += 1;
        if (ballot && v.ballot_id === ballot) cur.mine = true;
        votesByClip.set(v.contribution_id, cur);
      }
    }

    const candidates = (clips ?? []).filter((c) => {
      const v = votesByClip.get(c.id);
      return !v || (v.count < 3 && !v.mine);
    });
    if (candidates.length === 0)
      return NextResponse.json({ clip: null, remaining: 0 });

    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const { data: signed, error: signErr } = await supabase.storage
      .from(VOICE_BUCKET)
      .createSignedUrl(pick.storage_path as string, 600);
    if (signErr || !signed) throw signErr || new Error("sign failed");

    return NextResponse.json({
      clip: {
        id: pick.id,
        speaker: `${(pick.name || "").trim().split(/\s+/)[0]}${pick.okka ? ` · ${pick.okka}` : ""}`,
        place: pick.place,
        contentType: pick.content_type,
        durationSeconds: pick.duration_seconds,
        audioUrl: signed.signedUrl,
      },
      remaining: candidates.length,
    });
  } catch (err) {
    console.error("validate/next failed:", err);
    return NextResponse.json({ clip: null, remaining: 0 }, { status: 200 });
  }
}
