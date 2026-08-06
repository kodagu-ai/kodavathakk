import type { Metadata } from "next";
import Link from "next/link";
import { site } from "../lib/site";

export const metadata: Metadata = {
  title: "Community & Contribution",
  description:
    "How to take part in Kodava Thakk: give your voice, record elders, transcribe, translate, build — all through the Kodagu.ai community.",
};

const ROLES = [
  {
    title: "Every speaker",
    body: "Record 30 seconds of Thakk on this site. Do it at the dinner table, at the ainmane, at the Kodava Samaja. Then get three relatives to do the same.",
    cta: { label: "Give your voice", href: "/contribute" },
  },
  {
    title: "Elder-session facilitators",
    body: "The most urgent seat. Sit with the oldest fluent speakers of your okka and village — life histories, Palame, proverbs, place-name lore — and record the long versions. The team provides kits, training, and honoraria for elders.",
  },
  {
    title: "Transcribers & validators",
    body: "Paid, Karya-style work from home: listen to clips, write them in Kannada script per the project convention, or check others' transcriptions. Fluent listeners of every age are welcome.",
  },
  {
    title: "Singers & tradition-bearers",
    body: "Palame singers, wedding-speech specialists, dudikotpat drummers: your genres are the crown jewels of the corpus and are recorded with archival care, on video where you allow it.",
  },
  {
    title: "Developers & ML engineers",
    body: "The whole stack is open source — this site, the pipeline, and the coming ASR/TTS fine-tunes. Speech-model experience is gold; web and mobile hands are always needed.",
  },
  {
    title: "Linguists & teachers",
    body: "Own the orthography convention, design the evaluation sets, and shape the classroom pack with the Mangalore University MA program and the Kodava Sahitya Academy.",
  },
  {
    title: "Diaspora organizers",
    body: "Run recording drives at Kodava Samajas from Bengaluru to New Jersey; the contributor app works anywhere, and diaspora speech is a corpus stream of its own.",
  },
  {
    title: "Funders & partners",
    body: "Grants, CSR from companies with Kodagu ties, and diaspora endowment gifts fund kits, honoraria, and the paid transcription team. The corpus itself is the asset that keeps attracting support.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <section className="section-maroon" style={{ padding: "56px 0 40px" }}>
        <div className="container">
          <p className="eyebrow">Take part</p>
          <h1>Our voices, our data, our language</h1>
          <p style={{ maxWidth: 660, marginBottom: 0 }}>
            Kodava Thakk is run through the {""}
            <a href={site.parent.url}>Kodagu.ai</a> community — one open
            network, many projects. Join once, and take a seat in the language
            work below.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>How to communicate &amp; contribute</h2>
          <hr className="gold-rule" />
          <div className="grid grid-3" style={{ marginBottom: 12 }}>
            <div className="card">
              <p className="kicker">Step 1</p>
              <h3>Join the community</h3>
              <p>
                Sign up on the Kodagu.ai community page — one form covers every
                project, and puts you in the member directory.
              </p>
              <a className="btn btn-primary" href={site.parent.joinUrl}>
                Join Kodagu.ai
              </a>
            </div>
            <div className="card">
              <p className="kicker">Step 2</p>
              <h3>Say what you can do</h3>
              <p>
                List yourself in the community directory with your role —
                recordist, transcriber, singer, developer — so the coordination
                team can reach you.
              </p>
              <a className="btn btn-outline" href={`${site.parent.communityUrl}/submit`}>
                Add yourself to the directory
              </a>
            </div>
            <div className="card">
              <p className="kicker">Step 3</p>
              <h3>Start contributing</h3>
              <p>
                Record your first clip today; everything else — sessions,
                transcription work, code — is coordinated by email and the
                community channels.
              </p>
              <Link className="btn btn-outline" href="/contribute">
                Record now
              </Link>
            </div>
          </div>
          <p>
            Questions, partnerships, press:{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> ·
            Source code and issues: <a href={site.githubUrl}>GitHub</a> · The
            project listing on the hub:{" "}
            <a href={site.parent.projectUrl}>kodagu.ai/projects/kodava-thakk</a>
          </p>
        </div>
      </section>

      <section className="section-warm">
        <div className="container">
          <h2>Seats at the table</h2>
          <hr className="gold-rule" />
          <div className="grid grid-2">
            {ROLES.map((r) => (
              <div className="card" key={r.title}>
                <h3>{r.title}</h3>
                <p style={{ marginBottom: r.cta ? 14 : 0 }}>{r.body}</p>
                {r.cta && (
                  <Link href={r.cta.href} className="btn btn-primary">
                    {r.cta.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container prose">
          <h2>The rules we all play by</h2>
          <hr className="gold-rule" />
          <ul>
            <li>
              <strong>Guardianship:</strong> the corpus is held in trust for
              the community. It is never sold; commercial use needs council
              approval and benefit-sharing.
            </li>
            <li>
              <strong>Consent is tiered and respected:</strong> archive-only,
              research, model training, public listening — every recording
              carries its speaker&apos;s choice, enforced in the pipeline.
            </li>
            <li>
              <strong>Credit, always:</strong> speakers, okkas, and villages
              are named wherever their voices are used (unless they prefer
              otherwise). Elders&apos; voices are never cloned without family
              and council consent.
            </li>
            <li>
              <strong>Both dialects, equal dignity:</strong> Mendele and
              Kiggat are collected and evaluated on equal footing, and Kannada
              script and English travel together on everything public.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
