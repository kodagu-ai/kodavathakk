"use client";

import { useEffect, useState } from "react";
import { PHASE_TARGETS } from "../lib/site";

type Stats = {
  contributors: number;
  recordings: number;
  seconds: number;
  hours: number;
  byDialect: Record<string, number>;
};

const DIALECT_LABEL: Record<string, string> = {
  mendele: "Mendele (north & central)",
  kiggat: "Kiggat (south)",
  diaspora: "Diaspora",
  unsure: "Not yet classified",
};

function Bar({ label, value, target }: { label: string; value: number; target: number }) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <strong style={{ color: "var(--maroon)" }}>{label}</strong>
        <span style={{ color: "var(--mist)", fontVariantNumeric: "tabular-nums" }}>
          {value.toFixed(1)}h / {target}h
        </span>
      </div>
      <div className="progress">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function TrackerDetail() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const hours = stats?.hours ?? 0;
  const byDialect = stats?.byDialect ?? {};
  const dialectTotal = Object.values(byDialect).reduce((a, b) => a + b, 0) || 1;

  return (
    <section>
      <div className="container">
        <h2>Milestone progress</h2>
        <hr className="gold-rule" />
        <div className="grid grid-2">
          <div>
            <Bar label="Phase 0 · Foundation & pilot" value={hours} target={PHASE_TARGETS.level0} />
            <Bar label="Phase 1 · Corpus at scale" value={hours} target={PHASE_TARGETS.phase1} />
            <Bar label="Phase 2 · Models v1" value={hours} target={PHASE_TARGETS.phase2} />
            <Bar label="Phase 3 · The speaking companion" value={hours} target={PHASE_TARGETS.phase3} />
            <p style={{ fontSize: "0.88rem", color: "var(--mist)" }}>
              Targets are hours of raw described audio per the roadmap. Transcribed-hour
              milestones are published with each corpus release.
            </p>
          </div>
          <div className="card">
            <p className="kicker">Dialect balance</p>
            {Object.keys(byDialect).length === 0 ? (
              <p style={{ marginBottom: 0, color: "var(--mist)" }}>
                The balance chart appears once the first recordings arrive.
              </p>
            ) : (
              Object.entries(byDialect)
                .sort((a, b) => b[1] - a[1])
                .map(([k, secs]) => (
                  <div key={k} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span>{DIALECT_LABEL[k] ?? k}</span>
                      <span style={{ color: "var(--mist)", fontVariantNumeric: "tabular-nums" }}>
                        {(secs / 3600).toFixed(1)}h · {Math.round((secs / dialectTotal) * 100)}%
                      </span>
                    </div>
                    <div className="progress">
                      <span style={{ width: `${(secs / dialectTotal) * 100}%` }} />
                    </div>
                  </div>
                ))
            )}
            <p style={{ margin: "10px 0 0", fontSize: "0.88rem", color: "var(--mist)" }}>
              Both dialects are collected by design — quotas keep the models honest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
