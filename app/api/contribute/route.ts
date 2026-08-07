import { NextResponse } from "next/server";
import { serviceClient, str, VOICE_BUCKET } from "../../lib/server";
import {
  ALLOWED_AUDIO_MIME,
  MAX_DURATION_SECONDS,
  MAX_UPLOAD_BYTES,
} from "../../lib/site";

// Level 0 intake, step 1 of 2. Takes the contribution METADATA (no audio),
// creates a row in 'uploading' state, and mints a short-lived signed upload
// URL so the browser sends the audio straight to storage — the clip never
// passes through this function. Step 2 (/api/contribute/complete) verifies
// the object landed and flips the row to 'received'.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIALECTS = new Set(["mendele", "kiggat", "diaspora", "unsure"]);
const AGE_BANDS = new Set(["<18", "18-30", "31-50", "51-70", "70+"]);
const FLUENCY = new Set(["native", "fluent", "learning"]);
const CONTENT = new Set([
  "story",
  "song",
  "proverb",
  "conversation",
  "prompt",
  "blessing",
  "other",
]);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = str(body.name, 160);
  const place = str(body.place, 160);
  if (!name || !place)
    return NextResponse.json(
      { error: "Your name and your village or town are required." },
      { status: 400 }
    );

  const consent =
    body.consent && typeof body.consent === "object"
      ? (body.consent as Record<string, unknown>)
      : {};
  if (consent.archive !== true)
    return NextResponse.json(
      { error: "Archive consent is required to contribute." },
      { status: 400 }
    );

  const duration = Number(body.durationSeconds);
  if (!Number.isFinite(duration) || duration < 1 || duration > MAX_DURATION_SECONDS)
    return NextResponse.json(
      { error: "Could not read the recording length." },
      { status: 400 }
    );

  const sizeBytes = Number(body.sizeBytes) || 0;
  if (sizeBytes <= 0 || sizeBytes > MAX_UPLOAD_BYTES)
    return NextResponse.json(
      { error: "The audio file must be under 50 MB." },
      { status: 400 }
    );

  const mime = str(body.mimeType, 80) || "";
  const baseMime = mime.split(";")[0].trim().toLowerCase();
  if (!ALLOWED_AUDIO_MIME.includes(baseMime))
    return NextResponse.json(
      { error: "Please upload an audio file (webm, mp3, m4a, wav, ogg or flac)." },
      { status: 400 }
    );

  const dialect = DIALECTS.has(String(body.dialect)) ? String(body.dialect) : "unsure";
  const ageBand = AGE_BANDS.has(String(body.ageBand)) ? String(body.ageBand) : null;
  const fluency = FLUENCY.has(String(body.fluency)) ? String(body.fluency) : null;
  const contentType = CONTENT.has(String(body.contentType))
    ? String(body.contentType)
    : "other";

  const phone = str(body.phone, 60);
  const email = str(body.email, 200);
  const contributorKey = (phone || email || `${name}|${place}`).toLowerCase();

  // AI-at-intake: client-computed audio metrics + content hash.
  const sha256Raw = str(body.sha256, 70);
  const sha256 = sha256Raw && /^[0-9a-f]{64}$/.test(sha256Raw) ? sha256Raw : null;
  let clientAnalysis: Record<string, number> | null = null;
  if (body.analysis && typeof body.analysis === "object") {
    const a = body.analysis as Record<string, unknown>;
    const num = (v: unknown) => (typeof v === "number" && isFinite(v) ? v : null);
    clientAnalysis = {};
    for (const k of ["rmsDb", "silenceRatio", "clipRatio", "decodedSeconds"]) {
      const v = num(a[k]);
      if (v !== null) clientAnalysis[k] = v;
    }
    if (Object.keys(clientAnalysis).length === 0) clientAnalysis = null;
  }
  const flags: Record<string, boolean> = {};
  if (clientAnalysis) {
    if ((clientAnalysis.rmsDb ?? 0) < -38) flags.veryQuiet = true;
    if ((clientAnalysis.silenceRatio ?? 0) > 0.9) flags.mostlySilent = true;
    if ((clientAnalysis.clipRatio ?? 0) > 0.05) flags.clipping = true;
  }

  const rawFileName = str(body.fileName, 200) || "recording.webm";
  const safeName = rawFileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);

  const row = {
    name,
    phone,
    email,
    place,
    okka: str(body.okka, 160),
    age_band: ageBand,
    dialect,
    fluency,
    content_type: contentType,
    prompt_label: str(body.promptLabel, 300),
    notes: str(body.notes, 2000),
    consent: {
      archive: true,
      research: consent.research === true,
      training: consent.training === true,
      public: consent.public === true,
    },
    duration_seconds: Math.round(duration),
    file_name: safeName,
    mime_type: baseMime,
    size_bytes: sizeBytes,
    status: "uploading",
    contributor_key: contributorKey,
    sha256,
    analysis:
      clientAnalysis || Object.keys(flags).length
        ? { client: clientAnalysis, flags }
        : null,
  };

  try {
    const supabase = serviceClient();

    // Duplicate detection: the exact same audio bytes already in the corpus.
    if (sha256) {
      const { data: dup } = await supabase
        .from("thakk_contributions")
        .select("id")
        .eq("sha256", sha256)
        .in("status", ["uploading", "received", "reviewed"])
        .limit(1);
      if (dup && dup.length > 0)
        return NextResponse.json(
          { error: "This exact recording is already in the corpus — thank you! Record something new instead." },
          { status: 409 }
        );
    }

    const { data: inserted, error } = await supabase
      .from("thakk_contributions")
      .insert(row)
      .select("id")
      .single();
    if (error) throw error;

    const path = `${inserted.id}/${safeName}`;
    const { data: signed, error: signErr } = await supabase.storage
      .from(VOICE_BUCKET)
      .createSignedUploadUrl(path);
    if (signErr) throw signErr;

    await supabase
      .from("thakk_contributions")
      .update({ storage_path: path })
      .eq("id", inserted.id);

    return NextResponse.json({
      ok: true,
      id: inserted.id,
      path,
      token: signed.token,
    });
  } catch (err) {
    console.error("contribute failed:", err);
    return NextResponse.json(
      { error: "Could not start the upload. Please try again." },
      { status: 500 }
    );
  }
}
