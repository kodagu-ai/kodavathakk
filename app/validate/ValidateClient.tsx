"use client";

import { useCallback, useEffect, useState } from "react";

type Clip = {
  id: string;
  speaker: string;
  place: string;
  contentType: string;
  durationSeconds: number | null;
  audioUrl: string;
};

const CONTENT_LABEL: Record<string, string> = {
  story: "a story",
  song: "a song",
  proverb: "a proverb",
  conversation: "a conversation",
  prompt: "a spoken prompt",
  blessing: "a blessing",
  other: "a recording",
};

function getBallot(): string {
  let b = window.localStorage.getItem("thakk_ballot");
  if (!b) {
    b = crypto.randomUUID();
    window.localStorage.setItem("thakk_ballot", b);
  }
  return b;
}

export default function ValidateClient() {
  const [clip, setClip] = useState<Clip | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(0);
  // votes
  const [audible, setAudible] = useState<boolean | null>(null);
  const [isThakk, setIsThakk] = useState<boolean | null>(null);
  const [dialect, setDialect] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setAudible(null);
    setIsThakk(null);
    setDialect("");
    try {
      const res = await fetch(`/api/validate/next?ballot=${getBallot()}`, { cache: "no-store" });
      const d = await res.json();
      setClip(d.clip ?? null);
      setRemaining(d.remaining ?? 0);
    } catch {
      setClip(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setDone(Number(window.localStorage.getItem("thakk_validated") || 0));
    load();
  }, [load]);

  async function submit() {
    if (!clip || audible === null || (audible && isThakk === null)) return;
    setBusy(true);
    try {
      await fetch("/api/validate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contributionId: clip.id,
          ballotId: getBallot(),
          audible,
          isThakk: audible ? isThakk : false,
          dialectGuess: audible && isThakk && dialect ? dialect : null,
        }),
      });
      const n = done + 1;
      setDone(n);
      window.localStorage.setItem("thakk_validated", String(n));
    } finally {
      setBusy(false);
      load();
    }
  }

  if (loading) return <p style={{ color: "var(--mist)" }}>Finding a clip for your ears…</p>;

  if (!clip)
    return (
      <div className="notice-ok">
        <p style={{ margin: 0 }}>
          <strong>The queue is clear — every eligible clip has enough ears for
          now.</strong>{" "}
          New recordings arrive all the time; come back soon, or{" "}
          <a href="/contribute">give your own voice</a> in the meantime.
          {done > 0 && <> You have verified {done} clip{done === 1 ? "" : "s"} — thank you.</>}
        </p>
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
        <p style={{ color: "var(--mist)", margin: 0 }}>
          {remaining} clip{remaining === 1 ? "" : "s"} waiting · you have verified {done}
        </p>
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <p className="kicker">Now playing</p>
        <p style={{ margin: "0 0 10px", fontWeight: 700, color: "var(--ink)" }}>
          {clip.speaker} of {clip.place} — {CONTENT_LABEL[clip.contentType] ?? "a recording"}
          {clip.durationSeconds ? ` (${Math.floor(clip.durationSeconds / 60)}:${String(clip.durationSeconds % 60).padStart(2, "0")})` : ""}
        </p>
        <audio controls autoPlay src={clip.audioUrl} style={{ marginTop: 0 }} />

        <div className="field" style={{ marginTop: 22 }}>
          <label>1 · Can you hear the speaker clearly?</label>
          <div className="choice-row">
            <button className={`choice ${audible === true ? "selected" : ""}`} onClick={() => setAudible(true)}>Yes, clear</button>
            <button className={`choice ${audible === false ? "selected" : ""}`} onClick={() => setAudible(false)}>No — too noisy / silent</button>
          </div>
        </div>

        {audible && (
          <div className="field">
            <label>2 · Is it Kodava Takk?</label>
            <div className="choice-row">
              <button className={`choice ${isThakk === true ? "selected" : ""}`} onClick={() => setIsThakk(true)}>Yes, Thakk</button>
              <button className={`choice ${isThakk === false ? "selected" : ""}`} onClick={() => setIsThakk(false)}>No — another language</button>
            </div>
          </div>
        )}

        {audible && isThakk && (
          <div className="field">
            <label>3 · Which dialect do you hear? (optional)</label>
            <div className="choice-row">
              {[
                ["mendele", "Mendele"],
                ["kiggat", "Kiggat"],
                ["unsure", "Not sure"],
              ].map(([k, label]) => (
                <button key={k} className={`choice ${dialect === k ? "selected" : ""}`} onClick={() => setDialect(k)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary"
            onClick={submit}
            disabled={busy || audible === null || (audible === true && isThakk === null)}
          >
            {busy ? "Saving…" : "Save & next clip"}
          </button>
          <button className="btn btn-outline" onClick={load} disabled={busy}>
            Skip
          </button>
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: "0.88rem", color: "var(--mist)" }}>
        A clip is marked validated once two or more listeners agree it is clear
        Thakk. Your votes are anonymous.
      </p>
    </div>
  );
}
