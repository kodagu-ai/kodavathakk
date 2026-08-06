import { NextResponse } from "next/server";
import { serviceClient, VOICE_BUCKET } from "../../../lib/server";

// Level 0 intake, step 2 of 2. After the browser uploads the audio to the
// signed URL, this verifies the object actually exists in storage and flips
// the row from 'uploading' to 'received' — only then does it count in the
// public stats.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (!/^[0-9a-f-]{36}$/.test(id))
    return NextResponse.json({ error: "Bad id." }, { status: 400 });

  try {
    const supabase = serviceClient();
    const { data: row, error } = await supabase
      .from("thakk_contributions")
      .select("id, status, storage_path")
      .eq("id", id)
      .single();
    if (error || !row) throw error || new Error("not found");
    if (row.status !== "uploading")
      return NextResponse.json({ ok: true, status: row.status });

    const { data: objects, error: listErr } = await supabase.storage
      .from(VOICE_BUCKET)
      .list(id, { limit: 5 });
    if (listErr) throw listErr;
    const obj = (objects ?? []).find((o) => `${id}/${o.name}` === row.storage_path);
    if (!obj)
      return NextResponse.json(
        { error: "The audio has not arrived yet. Please retry." },
        { status: 409 }
      );

    const actualSize =
      (obj.metadata as { size?: number } | null)?.size ?? undefined;
    const { error: updErr } = await supabase
      .from("thakk_contributions")
      .update({
        status: "received",
        ...(actualSize ? { size_bytes: actualSize } : {}),
      })
      .eq("id", id);
    if (updErr) throw updErr;

    return NextResponse.json({ ok: true, status: "received" });
  } catch (err) {
    console.error("complete failed:", err);
    return NextResponse.json(
      { error: "Could not confirm the upload." },
      { status: 500 }
    );
  }
}
