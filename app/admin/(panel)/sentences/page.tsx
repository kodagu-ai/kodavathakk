"use client";

import { useCallback, useEffect, useState } from "react";

// Sentence-bank manager. Add read-aloud sentences from Academy / Pattole
// Palame material; ACTIVATE only after the language council has reviewed
// them — active sentences appear on the public contribute page.

type Sentence = {
  id: string;
  text: string;
  translit: string | null;
  translation_en: string | null;
  source: string | null;
  active: boolean;
  created_at: string;
};

export default function SentencesAdmin() {
  const [rows, setRows] = useState<Sentence[]>([]);
  const [err, setErr] = useState("");
  const [text, setText] = useState("");
  const [translit, setTranslit] = useState("");
  const [translationEn, setTranslationEn] = useState("");
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sentences", { cache: "no-store" });
      const d = await res.json();
      setRows(d.sentences ?? []);
    } catch {
      setErr("Could not load sentences.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function post(body: Record<string, unknown>) {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/sentences", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save failed.");
      await load();
      return true;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 style={{ fontSize: "2rem", marginTop: 8 }}>Sentence bank</h1>
      <hr className="gold-rule" />
      <p style={{ color: "var(--mist)", maxWidth: 720 }}>
        Read-aloud sentences for the contribute page. Add them from reviewed
        material (Academy publications, Pattole Palame, the master lexicon) —
        then <strong>activate</strong>. Only active sentences are shown to
        contributors; read speech with a known transcript is the cheapest ASR
        training data there is.
      </p>

      <div className="card" style={{ marginBottom: 26, maxWidth: 720 }}>
        <p className="kicker">Add a sentence</p>
        <div className="field">
          <label htmlFor="s-text">Sentence (Kannada-script Kodava) *</label>
          <input id="s-text" type="text" value={text} onChange={(e) => setText(e.target.value)} className="kn" />
        </div>
        <div className="grid grid-2">
          <div className="field">
            <label htmlFor="s-translit">Romanization</label>
            <input id="s-translit" type="text" value={translit} onChange={(e) => setTranslit(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="s-en">English gloss</label>
            <input id="s-en" type="text" value={translationEn} onChange={(e) => setTranslationEn(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="s-src">Source</label>
          <input id="s-src" type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Pattole Palame p.214; Academy phrasebook 2019" />
        </div>
        {err && <p className="notice-err">{err}</p>}
        <button
          className="btn btn-primary"
          disabled={busy || !text.trim()}
          onClick={async () => {
            const ok = await post({ text, translit, translationEn, source });
            if (ok) {
              setText("");
              setTranslit("");
              setTranslationEn("");
              setSource("");
            }
          }}
        >
          Add (inactive)
        </button>
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sentence</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>
                  <span className="kn" style={{ fontSize: "1.05rem", color: "var(--maroon)" }}>{s.text}</span>
                  {s.translit && <><br /><span style={{ color: "var(--coffee)" }}>{s.translit}</span></>}
                  {s.translation_en && <><br /><span style={{ color: "var(--mist)", fontSize: "0.85rem" }}>&ldquo;{s.translation_en}&rdquo;</span></>}
                </td>
                <td style={{ fontSize: "0.85rem" }}>{s.source || "—"}</td>
                <td>
                  <span className={`badge ${s.active ? "badge-reviewed" : "badge-uploading"}`}>
                    {s.active ? "active" : "inactive"}
                  </span>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="choice" disabled={busy} onClick={() => post({ id: s.id, active: !s.active })}>
                    {s.active ? "Deactivate" : "✓ Activate"}
                  </button>{" "}
                  <button className="choice" disabled={busy} onClick={() => post({ id: s.id, delete: true })}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: "var(--mist)", padding: 20 }}>
                  No sentences yet — add the first reviewed batch above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
