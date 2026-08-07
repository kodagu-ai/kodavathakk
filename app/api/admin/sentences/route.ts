import { NextResponse } from "next/server";
import { isAdmin, serviceClient, str } from "../../../lib/server";
import { getAdminUser } from "../../../lib/adminAuth";

// Admin sentence-bank manager. Sentences ship inactive; activate only after
// language-council review.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorized(req: Request) {
  return isAdmin(req) || !!(await getAdminUser());
}

export async function GET(req: Request) {
  if (!(await authorized(req)))
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { data, error } = await serviceClient()
    .from("thakk_sentences")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return NextResponse.json({ error: "Load failed." }, { status: 500 });
  return NextResponse.json({ sentences: data ?? [] });
}

export async function POST(req: Request) {
  if (!(await authorized(req)))
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const supabase = serviceClient();
  try {
    // Toggle / delete an existing sentence
    if (typeof body.id === "string" && /^[0-9a-f-]{36}$/.test(body.id)) {
      if (body.delete === true) {
        const { error } = await supabase.from("thakk_sentences").delete().eq("id", body.id);
        if (error) throw error;
        return NextResponse.json({ ok: true, deleted: true });
      }
      const { error } = await supabase
        .from("thakk_sentences")
        .update({ active: body.active === true })
        .eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    // Create
    const text = str(body.text, 300);
    if (!text) return NextResponse.json({ error: "Sentence text required." }, { status: 400 });
    const { data, error } = await supabase
      .from("thakk_sentences")
      .insert({
        text,
        translit: str(body.translit, 300),
        translation_en: str(body.translationEn, 300),
        source: str(body.source, 200),
        active: body.active === true,
      })
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error("admin sentences failed:", err);
    return NextResponse.json({ error: "Save failed." }, { status: 500 });
  }
}
