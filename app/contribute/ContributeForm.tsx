"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  AGE_BANDS,
  CONTENT_TYPES,
  DIALECTS,
  FLUENCY,
  MAX_UPLOAD_BYTES,
  PROMPTS,
} from "../lib/site";

type Phase = "idle" | "recording" | "recorded" | "submitting" | "done" | "error";

function fmt(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Best-effort duration for an uploaded file (MediaRecorder webm blobs often
// report Infinity — the seek-to-the-end trick resolves it).
function readDuration(file: Blob): Promise<number | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    const cleanup = (v: number | null) => {
      URL.revokeObjectURL(url);
      resolve(v);
    };
    audio.onloadedmetadata = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        cleanup(audio.duration);
      } else {
        audio.currentTime = 1e10;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          cleanup(isFinite(audio.duration) && audio.duration > 0 ? audio.duration : null);
        };
        setTimeout(() => cleanup(null), 4000);
      }
    };
    audio.onerror = () => cleanup(null);
    audio.src = url;
  });
}

export default function ContributeForm() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [err, setErr] = useState("");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [blobUrl, setBlobUrl] = useState("");
  const [fileName, setFileName] = useState("recording.webm");
  const [duration, setDuration] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [micDenied, setMicDenied] = useState(false);

  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  // Form fields
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [okka, setOkka] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ageBand, setAgeBand] = useState("");
  const [dialect, setDialect] = useState("unsure");
  const [fluency, setFluency] = useState("");
  const [contentType, setContentType] = useState("story");
  const [promptLabel, setPromptLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [consentResearch, setConsentResearch] = useState(true);
  const [consentTraining, setConsentTraining] = useState(true);
  const [consentPublic, setConsentPublic] = useState(false);
  const [consentArchive, setConsentArchive] = useState(false);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [blobUrl]);

  async function startRecording() {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const type = rec.mimeType || "audio/webm";
        const b = new Blob(chunksRef.current, { type });
        const secs = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
        setBlob(b);
        setDuration(secs);
        setFileName(type.includes("mp4") ? "recording.m4a" : "recording.webm");
        setBlobUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return URL.createObjectURL(b);
        });
        setPhase("recorded");
      };
      startedAtRef.current = Date.now();
      setElapsed(0);
      timerRef.current = setInterval(
        () => setElapsed(Math.round((Date.now() - startedAtRef.current) / 1000)),
        500
      );
      rec.start();
      recRef.current = rec;
      setPhase("recording");
    } catch {
      setMicDenied(true);
      setErr("Microphone access was blocked. You can still upload an audio file below.");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    recRef.current?.stop();
  }

  async function onFilePicked(f: File) {
    setErr("");
    if (f.size > MAX_UPLOAD_BYTES) {
      setErr("That file is over 50 MB. Please trim it or upload a shorter clip.");
      return;
    }
    const d = await readDuration(f);
    setBlob(f);
    setDuration(d ? Math.round(d) : 0);
    setFileName(f.name);
    setBlobUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(f);
    });
    setPhase("recorded");
  }

  async function submit() {
    setErr("");
    if (!blob) {
      setErr("Record or choose an audio file first.");
      return;
    }
    if (!name.trim() || !place.trim()) {
      setErr("Please tell us your name and your village or town.");
      return;
    }
    if (!consentArchive) {
      setErr("The archive consent box is required — it is what lets us keep your recording.");
      return;
    }
    const durationSeconds = duration || Math.max(1, Math.round(blob.size / 16000));
    setPhase("submitting");
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          place,
          okka,
          phone,
          email,
          ageBand,
          dialect,
          fluency,
          contentType,
          promptLabel: contentType === "prompt" ? promptLabel : null,
          notes,
          durationSeconds,
          fileName,
          mimeType: blob.type || "audio/webm",
          sizeBytes: blob.size,
          consent: {
            archive: consentArchive,
            research: consentResearch,
            training: consentTraining,
            public: consentPublic,
          },
        }),
      });
      const start = await res.json();
      if (!res.ok || !start.ok) throw new Error(start.error || "Could not start the upload.");

      const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supaUrl || !anonKey) throw new Error("Upload is not configured yet.");
      const supabase = createClient(supaUrl, anonKey);
      const { error: upErr } = await supabase.storage
        .from("thakk-voice")
        .uploadToSignedUrl(start.path, start.token, blob, {
          contentType: blob.type || "audio/webm",
        });
      if (upErr) throw new Error("The audio upload failed. Please try again.");

      const fin = await fetch("/api/contribute/complete", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: start.id }),
      });
      const finBody = await fin.json();
      if (!fin.ok || !finBody.ok) throw new Error(finBody.error || "Could not confirm the upload.");

      setPhase("done");
    } catch (e) {
      setPhase("error");
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (phase === "done") {
    return (
      <div className="notice-ok" role="status">
        <h3 style={{ marginTop: 0 }}>Your voice is in the archive. Thank you.</h3>
        <p style={{ marginBottom: 8 }}>
          {name.trim().split(/\s+/)[0]}, your recording has been received and now
          counts on the corpus dial. Every clip teaches the language back to the
          next generation — and to the machines that will help them speak it.
        </p>
        <p style={{ marginBottom: 0 }}>
          <a href="/contribute" style={{ fontWeight: 600 }}>
            Record another
          </a>{" "}
          · <a href="/tracker">See the tracker</a>
        </p>
      </div>
    );
  }

  const busy = phase === "submitting";

  return (
    <div>
      {/* Step 1 — the recording */}
      <h3>1 · Record, or upload a file</h3>
      <div className="recorder">
        {phase === "recording" ? (
          <>
            <div className="rec-time rec-live">● {fmt(elapsed)}</div>
            <p className="hint" style={{ color: "var(--mist)", marginBottom: 16 }}>
              Speak naturally, in Thakk. Thirty seconds is already a gift; three
              minutes is a treasure.
            </p>
            <button type="button" className="btn btn-primary" onClick={stopRecording}>
              Stop recording
            </button>
          </>
        ) : (
          <>
            {blob && blobUrl ? (
              <>
                <p style={{ marginBottom: 4, fontWeight: 600, color: "var(--ink)" }}>
                  Recorded {duration ? fmt(duration) : "clip"} — listen back:
                </p>
                <audio controls src={blobUrl} />
                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
                  {!micDenied && (
                    <button type="button" className="btn btn-outline" onClick={startRecording} disabled={busy}>
                      Re-record
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 16 }}>
                  Press record and speak in Kodava Takk — a story, a song, a
                  proverb, a blessing, or one of the prompts below.
                </p>
                {!micDenied && (
                  <button type="button" className="btn btn-primary" onClick={startRecording} disabled={busy}>
                    ● Start recording
                  </button>
                )}
              </>
            )}
            <p style={{ margin: "16px 0 0", fontSize: "0.88rem", color: "var(--mist)" }}>
              or{" "}
              <label style={{ color: "var(--kaveri)", cursor: "pointer", textDecoration: "underline" }}>
                upload an audio file
                <input
                  type="file"
                  accept="audio/*,.m4a,.webm"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFilePicked(f);
                  }}
                />
              </label>{" "}
              (webm, mp3, m4a, wav · up to 50 MB)
            </p>
          </>
        )}
      </div>

      {/* Prompts */}
      <details style={{ margin: "18px 0 30px" }}>
        <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--kaveri)" }}>
          Need something to say? Open the prompts
        </summary>
        <ul style={{ marginTop: 12 }}>
          {PROMPTS.map((p) => (
            <li key={p} style={{ marginBottom: 6 }}>
              {p}
            </li>
          ))}
        </ul>
      </details>

      {/* Step 2 — who is speaking */}
      <h3>2 · Who is speaking</h3>
      <div className="grid grid-2" style={{ marginBottom: 6 }}>
        <div className="field">
          <label htmlFor="c-name">Name *</label>
          <input id="c-name" type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c-place">Village / town *</label>
          <input id="c-place" type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Kakkabe, Virajpet, Bengaluru" />
        </div>
        <div className="field">
          <label htmlFor="c-okka">Okka (family name)</label>
          <input id="c-okka" type="text" value={okka} onChange={(e) => setOkka(e.target.value)} />
          <span className="hint">Optional — clans and villages are credited in the archive.</span>
        </div>
        <div className="field">
          <label htmlFor="c-phone">Phone / WhatsApp</label>
          <input id="c-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          <span className="hint">Optional — only so the team can follow up. Never published.</span>
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="c-age">Age band</label>
          <select id="c-age" value={ageBand} onChange={(e) => setAgeBand(e.target.value)}>
            <option value="">Prefer not to say</option>
            {AGE_BANDS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Dialect</label>
        <div className="choice-row" role="radiogroup" aria-label="Dialect">
          {DIALECTS.map((d) => (
            <label key={d.key} className={`choice ${dialect === d.key ? "selected" : ""}`}>
              <input type="radio" name="dialect" value={d.key} checked={dialect === d.key} onChange={() => setDialect(d.key)} />
              {d.label}
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>How is your Thakk?</label>
        <div className="choice-row" role="radiogroup" aria-label="Fluency">
          {FLUENCY.map((f) => (
            <label key={f.key} className={`choice ${fluency === f.key ? "selected" : ""}`}>
              <input type="radio" name="fluency" value={f.key} checked={fluency === f.key} onChange={() => setFluency(f.key)} />
              {f.label}
            </label>
          ))}
        </div>
        <span className="hint">Learners are welcome — learner speech helps the models help learners.</span>
      </div>

      {/* Step 3 — what it is */}
      <h3 style={{ marginTop: 30 }}>3 · What did you record?</h3>
      <div className="field">
        <div className="choice-row" role="radiogroup" aria-label="Content type">
          {CONTENT_TYPES.map((c) => (
            <label key={c.key} className={`choice ${contentType === c.key ? "selected" : ""}`}>
              <input type="radio" name="ctype" value={c.key} checked={contentType === c.key} onChange={() => setContentType(c.key)} />
              {c.label}
            </label>
          ))}
        </div>
      </div>
      {contentType === "prompt" && (
        <div className="field">
          <label htmlFor="c-prompt">Which prompt?</label>
          <select id="c-prompt" value={promptLabel} onChange={(e) => setPromptLabel(e.target.value)}>
            <option value="">Choose the prompt you answered</option>
            {PROMPTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="field">
        <label htmlFor="c-notes">Anything we should know?</label>
        <textarea id="c-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. This is the story my grandfather told at Puthari; the song is from our village temple festival…" />
      </div>

      {/* Step 4 — consent */}
      <h3 style={{ marginTop: 30 }}>4 · Your consent</h3>
      <p className="hint" style={{ color: "var(--mist)", marginBottom: 10 }}>
        Your recording stays under community guardianship — it is never sold,
        and commercial use needs the language council&apos;s approval. Choose
        what you allow:
      </p>
      <div className="consent-box" style={{ marginBottom: 22 }}>
        <label>
          <input type="checkbox" checked={consentArchive} onChange={(e) => setConsentArchive(e.target.checked)} />
          <span>
            <strong>Keep my recording in the community archive</strong> (required)
          </span>
        </label>
        <label>
          <input type="checkbox" checked={consentResearch} onChange={(e) => setConsentResearch(e.target.checked)} />
          <span>Allow language researchers to study it</span>
        </label>
        <label>
          <input type="checkbox" checked={consentTraining} onChange={(e) => setConsentTraining(e.target.checked)} />
          <span>
            Allow it to teach the Kodava speech models — the app learns from
            your voice
          </span>
        </label>
        <label>
          <input type="checkbox" checked={consentPublic} onChange={(e) => setConsentPublic(e.target.checked)} />
          <span>Allow it to be played publicly in the Thakk Archive, credited to me</span>
        </label>
      </div>

      {err && (
        <p className="notice-err" role="alert">
          {err}
        </p>
      )}

      <button type="button" className="btn btn-primary" style={{ fontSize: "1.05rem", padding: "15px 34px" }} onClick={submit} disabled={busy || !blob}>
        {busy ? "Uploading your voice…" : "Add my voice to the corpus"}
      </button>
    </div>
  );
}
