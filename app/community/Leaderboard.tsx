"use client";

import { useEffect, useState } from "react";
import { BADGES } from "../lib/site";

// "Voices of the corpus" — top contributors with monogram avatars and the
// Kodava-motif badge ladder, beside a live feed of recent recordings.
// Speakers, okkas, and villages are credited; contact details never shown.

type Top = {
  display: string;
  okka: string | null;
  place: string;
  clips: number;
  seconds: number;
  since: string;
  badge: string;
};
type Feed = {
  name: string;
  okka: string | null;
  place: string;
  contentType: string;
  seconds: number;
  at: string;
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

const badgeByKey = Object.fromEntries(BADGES.map((b) => [b.key, b]));

function minutes(s: number) {
  const m = Math.round(s / 60);
  return m < 1 ? "under a minute" : `${m} min`;
}

function ago(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Avatar({ name, color }: { name: string; color: string }) {
  const initial = (name.trim()[0] || "?").toUpperCase();
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "var(--ivory-warm)",
        border: `2px solid ${color}`,
        color: "var(--maroon)",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "1.5rem",
        flexShrink: 0,
      }}
    >
      {initial}
    </span>
  );
}

function BadgeChip({ badgeKey }: { badgeKey: string }) {
  const b = badgeByKey[badgeKey] ?? badgeByKey.first_voice;
  return (
    <span
      title={b.meaning}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        padding: "3px 12px",
        fontSize: "0.76rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        color: "#fff",
        background: b.color,
      }}
    >
      <span aria-hidden>{b.motif}</span> {b.label}
    </span>
  );
}

export default function Leaderboard() {
  const [top, setTop] = useState<Top[]>([]);
  const [feed, setFeed] = useState<Feed[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then((d) => {
        setTop(d.top ?? []);
        setFeed(d.feed ?? []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <section className="section-warm">
      <div className="container">
        <p className="eyebrow">Voices of the corpus</p>
        <h2>Top contributors</h2>
        <hr className="gold-rule" />

        {/* Badge ladder legend */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 26 }}>
          {[...BADGES].reverse().map((b) => (
            <span
              key={b.key}
              title={b.meaning}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--line)",
                background: "#fffdf8",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: "0.85rem",
              }}
            >
              <span aria-hidden>{b.motif}</span>
              <strong style={{ color: b.color }}>{b.label}</strong>
              <span style={{ color: "var(--mist)" }}>· {b.meaning.split("— ")[1]}</span>
            </span>
          ))}
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Leaderboard */}
          <div>
            {top.length === 0 ? (
              <div className="card">
                <p style={{ marginBottom: 6, fontWeight: 600, color: "var(--maroon)" }}>
                  {loaded ? "The honour roll is waiting for its first name." : "Loading the honour roll…"}
                </p>
                {loaded && (
                  <p style={{ marginBottom: 0 }}>
                    Record one clip and the first Paddy Sheaf badge is yours —
                    credited here with your name, okka, and village.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-2">
                {top.map((c, i) => {
                  const b = badgeByKey[c.badge] ?? badgeByKey.first_voice;
                  return (
                    <div
                      className="card"
                      key={`${c.display}-${c.place}-${i}`}
                      style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: 18 }}
                    >
                      <Avatar name={c.display} color={b.color} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: "0 0 2px", fontWeight: 700, color: "var(--ink)" }}>
                          {i < 3 ? <span aria-hidden>{["🥇", "🥈", "🥉"][i]} </span> : null}
                          {c.display}
                          {c.okka ? ` · ${c.okka}` : ""}
                        </p>
                        <p style={{ margin: "0 0 8px", fontSize: "0.88rem", color: "var(--mist)" }}>
                          {c.place} · {c.clips} clip{c.clips === 1 ? "" : "s"} · {minutes(c.seconds)}
                        </p>
                        <BadgeChip badgeKey={c.badge} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent feed */}
          <div className="card" style={{ padding: 20 }}>
            <p className="kicker">Fresh from the hills</p>
            {feed.length === 0 ? (
              <p style={{ margin: 0, color: "var(--mist)" }}>
                New recordings appear here the moment they arrive.
              </p>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {feed.map((f, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "10px 0",
                      borderBottom: i === feed.length - 1 ? "none" : "1px solid var(--line)",
                      fontSize: "0.92rem",
                    }}
                  >
                    <strong style={{ color: "var(--maroon)" }}>
                      {f.name}
                      {f.okka ? ` · ${f.okka}` : ""}
                    </strong>{" "}
                    of {f.place} gave {CONTENT_LABEL[f.contentType] ?? "a recording"}
                    <span style={{ color: "var(--mist)" }}> · {minutes(f.seconds)} · {ago(f.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p style={{ marginTop: 22, fontSize: "0.88rem", color: "var(--mist)" }}>
          Ranked by time given to the corpus. Names appear as first name, okka,
          and village — exactly what each contributor consented to share.
        </p>
      </div>
    </section>
  );
}
