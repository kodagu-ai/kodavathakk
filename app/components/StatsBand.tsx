"use client";

import { useEffect, useState } from "react";
import { PHASE_TARGETS } from "../lib/site";

type Stats = {
  contributors: number;
  recordings: number;
  seconds: number;
  hours: number;
  validatedHours?: number;
  activeDrive?: {
    name: string;
    nameKn: string | null;
    endsAt: string;
    targetHours: number;
    driveHours: number;
  } | null;
  byDialect: Record<string, number>;
  recent: {
    name: string;
    place: string;
    contentType: string;
    seconds: number;
    at: string;
  }[];
};

const EMPTY: Stats = {
  contributors: 0,
  recordings: 0,
  seconds: 0,
  hours: 0,
  byDialect: {},
  recent: [],
};

function fmtClock(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function ago(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const CONTENT_LABEL: Record<string, string> = {
  story: "a story",
  song: "a song",
  proverb: "a proverb",
  conversation: "a conversation",
  prompt: "a spoken prompt",
  blessing: "a blessing",
  other: "a recording",
};

// The Speaking Flame dial: a gauge of recorded hours against the Level 0
// target (the first 100 hours), ringed by waveform arcs — the brand's
// "the waveform is our script" motif, alive with real community data.
function Dial({ hours }: { hours: number }) {
  const target = PHASE_TARGETS.level0;
  const frac = Math.max(0, Math.min(1, hours / target));
  // Semicircle gauge: radius 100, centred at (125, 125).
  const r = 100;
  const circumference = Math.PI * r;
  const dash = frac * circumference;
  return (
    <div className="dial-figure" role="img" aria-label={`${hours} hours recorded of the first ${target}-hour goal`}>
      <svg viewBox="0 0 250 145">
        {/* outer decorative waveform arcs */}
        <path d="M 45 125 A 80 80 0 0 1 205 125" fill="none" stroke="#c9a227" strokeOpacity="0.25" strokeWidth="2" />
        <path d="M 60 125 A 65 65 0 0 1 190 125" fill="none" stroke="#c9a227" strokeOpacity="0.18" strokeWidth="2" />
        {/* track */}
        <path
          d="M 25 125 A 100 100 0 0 1 225 125"
          fill="none"
          stroke="rgba(247,241,229,0.18)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* progress */}
        <path
          d="M 25 125 A 100 100 0 0 1 225 125"
          fill="none"
          stroke="#c9a227"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="dial-readout">
        <span className="big">{fmtClock(Math.round(hours * 3600))}</span>
        <span className="small">of the first {target} hours</span>
      </div>
    </div>
  );
}

export default function StatsBand() {
  const [stats, setStats] = useState<Stats>(EMPTY);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch("/api/stats")
        .then((r) => r.json())
        .then((d) => {
          if (alive && d && typeof d.seconds === "number") setStats(d);
        })
        .catch(() => {});
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const items =
    stats.recent.length > 0
      ? stats.recent.map(
          (r) =>
            `${r.name} of ${r.place} gave ${CONTENT_LABEL[r.contentType] ?? "a recording"} · ${Math.round(
              r.seconds / 60
            ) || 1} min · ${ago(r.at)}`
        )
      : [
          "The corpus is open — be among the first voices.",
          "Every recording is an heirloom: one elder, one story, one blessing at a time.",
        ];
  // Duplicate the list so the marquee loops seamlessly.
  const track = [...items, ...items];

  const drive = stats.activeDrive;

  return (
    <>
      {drive && (
        <div style={{ background: "var(--gold)", color: "#241b16", padding: "10px 0" }}>
          <div
            className="container"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "space-between", fontWeight: 700, fontSize: "0.95rem" }}
          >
            <span>
              🥁 {drive.name}
              {drive.nameKn ? <span className="kn"> · {drive.nameKn}</span> : null} — recording drive live now
            </span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>
              {drive.driveHours}h of the {drive.targetHours}h goal · ends{" "}
              {new Date(drive.endsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        </div>
      )}
      <div className="dial-band">
        <div className="container dial-wrap">
          <Dial hours={stats.hours} />
          <div className="stat-cards">
            <div className="stat-card">
              <div className="value">{stats.contributors.toLocaleString()}</div>
              <div className="label">Voices contributed</div>
            </div>
            <div className="stat-card">
              <div className="value">{fmtClock(stats.seconds)}</div>
              <div className="label">Thakk recorded</div>
            </div>
            <div className="stat-card">
              <div className="value">{stats.recordings.toLocaleString()}</div>
              <div className="label">Recordings in the archive</div>
            </div>
          </div>
        </div>
      </div>
      <div className="ticker" aria-label="Recent contributions">
        <div className="ticker-track">
          {track.map((t, i) => (
            <span className="ticker-item" key={i}>
              <span className="dot">●</span>
              <strong>{t.split(" gave ")[0]}</strong>
              {t.includes(" gave ") ? ` gave ${t.split(" gave ")[1]}` : ""}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
