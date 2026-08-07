import { NextResponse } from "next/server";
import { serviceClient, str } from "../../lib/server";

// Listen-and-verify: record one vote. One vote per ballot per clip
// (the unique constraint makes replays harmless).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIALECTS = new Set(["mendele", "kiggat", "unsure"]);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = typeof body.contributionId === "string" ? body.contributionId : "";
  const ballot = (str(body.ballotId, 80) || "").replace(/[^a-zA-Z0-9-]/g, "");
  if (!/^[0-9a-f-]{36}$/.test(id) || ballot.length < 8)
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  if (typeof body.audible !== "boolean" || typeof body.isThakk !== "boolean")
    return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const dialectGuess = DIALECTS.has(String(body.dialectGuess))
    ? String(body.dialectGuess)
    : null;
  const qRaw = Number(body.quality);
  const quality = Number.isInteger(qRaw) && qRaw >= 1 && qRaw <= 5 ? qRaw : null;

  try {
    const supabase = serviceClient();
    const { error } = await supabase.from("thakk_validations").insert({
      contribution_id: id,
      ballot_id: ballot,
      audible: body.audible,
      is_thakk: body.isThakk,
      dialect_guess: dialectGuess,
      quality,
    });
    if (error && !/duplicate|unique/i.test(error.message)) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("validate vote failed:", err);
    return NextResponse.json({ error: "Could not save the vote." }, { status: 500 });
  }
}
