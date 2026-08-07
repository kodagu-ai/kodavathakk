import { NextResponse } from "next/server";
import { serviceClient } from "../../lib/server";

// The active read-aloud sentence bank (admin-curated; empty until the
// language council has reviewed a batch).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await serviceClient()
      .from("thakk_sentences")
      .select("id, text, translit, translation_en")
      .eq("active", true)
      .limit(200);
    if (error) throw error;
    return NextResponse.json(
      { sentences: data ?? [] },
      { headers: { "cache-control": "public, s-maxage=120, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ sentences: [] });
  }
}
