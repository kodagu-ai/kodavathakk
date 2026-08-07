import { NextResponse } from "next/server";
import { isAdmin, serviceClient, str } from "../../../lib/server";
import { getAdminUser } from "../../../lib/adminAuth";

// Admin festival-drive manager (create, activate/deactivate).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorized(req: Request) {
  return isAdmin(req) || !!(await getAdminUser());
}

export async function GET(req: Request) {
  if (!(await authorized(req)))
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  const { data, error } = await serviceClient()
    .from("thakk_drives")
    .select("*")
    .order("starts_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: "Load failed." }, { status: 500 });
  return NextResponse.json({ drives: data ?? [] });
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
    if (typeof body.id === "string" && /^[0-9a-f-]{36}$/.test(body.id)) {
      const { error } = await supabase
        .from("thakk_drives")
        .update({ active: body.active === true })
        .eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }
    const name = str(body.name, 160);
    const starts = str(body.startsAt, 40);
    const ends = str(body.endsAt, 40);
    const target = Number(body.targetHours);
    if (!name || !starts || !ends || !Number.isFinite(target) || target <= 0)
      return NextResponse.json(
        { error: "Name, start, end and target hours are required." },
        { status: 400 }
      );
    if (new Date(starts) >= new Date(ends))
      return NextResponse.json({ error: "End must be after start." }, { status: 400 });
    const { data, error } = await supabase
      .from("thakk_drives")
      .insert({
        name,
        name_kn: str(body.nameKn, 160),
        starts_at: new Date(starts).toISOString(),
        ends_at: new Date(ends).toISOString(),
        target_hours: target,
        active: body.active === true,
      })
      .select("id")
      .single();
    if (error) throw error;
    return NextResponse.json({ ok: true, id: data.id });
  } catch (err) {
    console.error("admin drives failed:", err);
    return NextResponse.json({ error: "Save failed." }, { status: 500 });
  }
}
