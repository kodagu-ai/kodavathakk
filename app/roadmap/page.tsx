import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap & Milestones",
  description:
    "The Kodava Thakk rollout: a 36-month roadmap in four phases, from the first 100 recorded hours to a speech-to-speech Kodava companion — with the 90-day kickoff plan.",
};

const PHASES = [
  {
    name: "Phase 0",
    window: "Months 0–3",
    focus: "Foundation & pilot — LIVE NOW",
    results: [
      "Guardianship licence and consent tiers drafted; language council seated",
      "Recording kit and metadata standard finalized; orthography convention v1 with Academy and university partners",
      "Pilot: 25 elders and 200 crowd contributors recorded; Project Vaani's Kodagu audio audited",
      "This site: Level 0 voice collection open, live corpus tracker running",
    ],
    milestones: "100 hours raw audio · 10 hours transcribed · first Whisper fine-tune demo",
  },
  {
    name: "Phase 1",
    window: "Months 3–9",
    focus: "Corpus at scale",
    results: [
      "Field teams covering both dialects (Mendele & Kiggat)",
      "Crowd app public, with festival and Padayatra recording drives",
      "Paid transcription team of 8–10 trained and working",
      "Legacy media digitization running; first ELAR / Indian archive deposits",
    ],
    milestones: "400 hours raw · 50 hours transcribed · ASR v1 in the correction loop · TTS voice donors recorded",
  },
  {
    name: "Phase 2",
    window: "Months 9–18",
    focus: "Models v1 & first products",
    results: [
      "Thakk Archive listening site live; talking dictionary launched",
      "ASR v2 usable for search and subtitling; TTS v1 speaks",
      "Parallel corpus of 100k sentence pairs",
      "First Kodava–Kannada–English translation model",
    ],
    milestones: "700 hours raw · 100 hours transcribed · ASR word error rate under 25% and falling",
  },
  {
    name: "Phase 3",
    window: "Months 18–36",
    focus: "The speaking companion",
    results: [
      "Ainmane speech-to-speech companion in beta, then public",
      "WhatsApp bot for the diaspora; classroom pack in schools",
      "Annual corpus releases; sustainability plan (grants, CSR, diaspora endowment) operating",
    ],
    milestones: "1,000+ hours raw · 150+ hours transcribed · conversational LLM adapted to Kodava",
  },
];

const NINETY = [
  {
    days: "Days 1–15",
    action:
      "Meet the founding circle with the Karnataka Kodava Sahitya Academy, Akhila Kodava Samaja, the different Kodava Samajas, linguists, diaspora technologists, and elder representatives. Draft the guardianship licence and the consent forms, and open conversations with AI4Bharat, Vaani/ARTPARK, and Karya.",
    outcome: "Governance skeleton and partner intent in writing",
  },
  {
    days: "Days 16–30",
    action:
      "Audit existing material — Vaani Kodagu audio, Academy recordings, radio archives, family tapes. Define the metadata standard and Kannada-script orthography convention v1. Buy 3 field recording kits.",
    outcome: "Data inventory · recording standard · kits ready",
  },
  {
    days: "Days 31–60",
    action:
      "Pilot elder sessions: 25 elders across both dialects, 60+ hours recorded. Stand up storage and the transcription workflow; transcribe the first 5 hours. This website's 'Record 30 seconds of Thakk' drive pushed through the Nada Kodagu network.",
    outcome: "First real corpus — the community sees and hears the project",
  },
  {
    days: "Days 61–90",
    action:
      "Fine-tune the first Whisper checkpoint on pilot data and demo live transcription of an elder's story at a public event. Publish the manifesto and 3-year roadmap. Submit the first grant applications (ELDP, Bhashini, CSR).",
    outcome: "Working AI demo · public launch · funding pipeline",
  },
];

const RISKS = [
  ["Orthography disputes stall transcription", "A pragmatic Kannada-script convention v1 as project standard; audio stays primary so any future script can be layered on later"],
  ["Elder speakers pass before capture", "Phase 0 prioritizes the oldest 100 voices; depth sessions start in month 2, before any technology is built"],
  ["Volunteer energy fades", "Paid Karya-style work for the grind; festivals and leaderboards for the fun; visible annual releases"],
  ["Data extraction by outside actors", "Guardianship licence, consent tiers, trust custody, gated commercial access from day one"],
  ["Dialect imbalance skews models", "Dialect quotas in collection targets and in every evaluation set"],
  ["Funding gaps", "Diversified pipeline: ELDP, Bhashini/SPPEL, Karnataka cultural funds, CSR, diaspora crowdfunding"],
];

export default function RoadmapPage() {
  return (
    <>
      <section>
        <div className="container">
          <p className="eyebrow">Rollout</p>
          <h1>36 months, four phases</h1>
          <hr className="gold-rule" />
          <p style={{ maxWidth: 720 }}>
            The program moves from a 90-day pilot to a full stack of Kodava
            language AI in daily community use. Every phase has public
            milestones — you can watch them move on the{" "}
            <Link href="/tracker">corpus tracker</Link>.
          </p>

          <div className="grid grid-2" style={{ marginTop: 28 }}>
            {PHASES.map((p) => (
              <div className="card" key={p.name}>
                <p className="kicker">
                  {p.name} · {p.window}
                </p>
                <h3>{p.focus}</h3>
                <ul style={{ paddingLeft: "1.1em", marginBottom: 14 }}>
                  {p.results.map((r) => (
                    <li key={r} style={{ marginBottom: 6 }}>
                      {r}
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    margin: 0,
                    paddingTop: 12,
                    borderTop: "1px solid var(--line)",
                    fontSize: "0.9rem",
                    color: "var(--maroon)",
                    fontWeight: 600,
                  }}
                >
                  {p.milestones}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-warm">
        <div className="container">
          <p className="eyebrow">Kickoff</p>
          <h2>The first 90 days</h2>
          <hr className="gold-rule" />
          <div className="table-wrap">
            <table className="plan">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>Days</th>
                  <th>Action</th>
                  <th style={{ width: 260 }}>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {NINETY.map((r) => (
                  <tr key={r.days}>
                    <td>
                      <strong>{r.days}</strong>
                    </td>
                    <td>{r.action}</td>
                    <td>{r.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 18, maxWidth: 720 }}>
            <strong>A note on momentum:</strong> the Kaveri-to-Igguthappa
            Padayatra in late August is a ready-made corpus event — a
            &ldquo;voices of the walk&rdquo; drive where every walker records a
            story, a song, or a blessing in Thakk along the route.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <p className="eyebrow">Eyes open</p>
          <h2>Risks &amp; how we manage them</h2>
          <hr className="gold-rule" />
          <div className="table-wrap">
            <table className="plan">
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Mitigation</th>
                </tr>
              </thead>
              <tbody>
                {RISKS.map(([risk, mit]) => (
                  <tr key={risk}>
                    <td>
                      <strong style={{ whiteSpace: "normal" }}>{risk}</strong>
                    </td>
                    <td>{mit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 26 }}>
            <Link href="/contribute" className="btn btn-primary">
              Help move the dial — record now
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
