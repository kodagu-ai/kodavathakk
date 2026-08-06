import { NextResponse } from "next/server";
import { isAdmin, serviceClient, VOICE_BUCKET } from "../../../lib/server";

// Admin tracker API (bearer ADMIN_KEY).
//   GET  → latest rows (all statuses) with 1-hour signed playback URLs.
//   POST → { id, status } review action, or { id, analysis } to attach notes.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID = new Set(["received", "reviewed", "rejected"]);

export async function GET(req: Request) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  try {
    const supabase = serviceClient();
    const { data, error } = await supabase
      .from("thakk_contributions")
      .select(
        "id, name, phone, email, place, okka, age_band, dialect, fluency, content_type, prompt_label, notes, consent, duration_seconds, file_name, storage_path, mime_type, size_bytes, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw error;

    const rows = data ?? [];
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
    return NextResponse.json({ rows: withAudio });
  } catch (err) {
    console.error("admin list failed:", err);
    return NextResponse.json({ error: "Load failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAdmin(req))
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";
  if (!/^[0-9a-f-]{36}$/.test(id) || !VALID.has(status))
    return NextResponse.json({ error: "Bad id or status." }, { status: 400 });

  try {
    const { error } = await serviceClient()
      .from("thakk_contributions")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true, status });
  } catch (err) {
    console.error("admin update failed:", err);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
