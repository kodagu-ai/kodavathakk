import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "How Kodava Thakk uses AI: the technology strategy, the platform architecture, the research the project stands on, and the product development roadmap.",
};

// ── The research shelf — verified initiatives the strategy stands on ─────────
const RESEARCH: {
  org: string;
  what: string;
  why: string;
  url: string;
}[] = [
  {
    org: "UNESCO · International Decade of Indigenous Languages (2022–2032)",
    what: "The UN system's global frame for indigenous language revitalization, including the Indigenous Language Data Commons Incubator (with The GovLab and Microsoft) for community-governed language data in the age of AI.",
    why: "Our guardianship model is designed to plug into this decade: community-led data commons, ethical AI norms, and international visibility for Kodava Takk.",
    url: "https://www.unesco.org/en/decades/indigenous-languages",
  },
  {
    org: "Te Hiku Media · Papa Reo (Aotearoa NZ)",
    what: "The Māori-led language platform that trained te reo Māori speech recognition to ~92% accuracy and pioneered the Kaitiakitanga (guardianship) data licence — data governed by the community, never sold.",
    why: "The single most important proof that a small community can out-build big tech for its own language. Our licence, consent tiers, and council model follow theirs.",
    url: "https://papareo.nz/",
  },
  {
    org: "Indigenous Protocol & AI Working Group",
    what: "An international collective of indigenous technologists and scholars publishing position papers on how AI should be designed from indigenous epistemologies.",
    why: "The ethical playbook for every design decision where technology touches culture — from elder voice cloning to what 'consent' must mean.",
    url: "https://www.indigenous-ai.net/",
  },
  {
    org: "Mila · First Languages AI Reality (FLAIR)",
    what: "The Québec AI institute's initiative building speech recognition for 200+ endangered North American indigenous languages, starting with the Wakashan family.",
    why: "State-of-the-art research on ASR when recordings are scarce — exactly our regime. A model for academic partnership done respectfully.",
    url: "https://mila.quebec/en/ai4humanity/applied-projects/first-languages-ai-reality",
  },
  {
    org: "Mozilla Common Voice",
    what: "The world's largest open crowdsourced voice platform: 100+ languages built from 30-second clips, community validation loops, and public progress dashboards.",
    why: "Our Level 0 mechanics — tiny contribution units, validation by the community, visible counters — are the Common Voice playbook applied to Thakk.",
    url: "https://commonvoice.mozilla.org/",
  },
  {
    org: "AI4Bharat · IIT Madras",
    what: "IndicVoices (7,300+ hours across 22 Indian languages, 400+ districts), IndicASR, Indic-TTS, IndicTrans2 — open models and a district-by-district collection methodology, funded by Bhashini.",
    why: "Our nearest technical ancestors. Kodava Takk's Dravidian neighbours (Kannada, Tulu, Malayalam) live in these checkpoints — our fine-tunes start from them.",
    url: "https://ai4bharat.iitm.ac.in/",
  },
  {
    org: "Project Vaani · IISc + ARTPARK + Google",
    what: "District-anchored open speech corpus for India — including recordings from Kodagu district — published openly on Hugging Face.",
    why: "Phase 0 of our roadmap audits Vaani's Kodagu audio for usable Kodava speech, and their field methodology informs our elder-session protocol.",
    url: "https://vaani.iisc.ac.in/",
  },
  {
    org: "Bhashini · Government of India",
    what: "MeitY's national language-AI mission funding open Indic datasets and models, with translation deployed at national scale.",
    why: "A funding and distribution channel: Kodava Thakk's corpus and models are designed to be Bhashini-compatible from day one.",
    url: "https://bhashini.gov.in/",
  },
  {
    org: "Karya",
    what: "The Microsoft Research India spin-out that pays rural Indians dignified wages (with royalties) for voice data and annotation work in their own languages.",
    why: "Our paid transcription and validation layer follows Karya's model: corpus building as a modest livelihood program for Kodagu, not extraction.",
    url: "https://www.karya.in/",
  },
  {
    org: "Meta AI · MMS & No Language Left Behind",
    what: "Massively Multilingual Speech (ASR/TTS for 1,100+ languages) and NLLB (translation for 200 languages) — the open checkpoints UNESCO itself uses for its indigenous-language translator.",
    why: "Base models in our transfer-learning stack, alongside Whisper — we adapt giants, we never train from zero.",
    url: "https://ai.meta.com/blog/multilingual-model-speech-recognition/",
  },
  {
    org: "OpenAI Whisper (+ whisper.cpp)",
    what: "The open speech-recognition family that fine-tunes remarkably well on small corpora, with on-device inference via whisper.cpp.",
    why: "Our Phase 0 ASR demo is a Whisper fine-tune; whisper.cpp keeps future tools working offline in Kodagu's patchy connectivity.",
    url: "https://github.com/openai/whisper",
  },
  {
    org: "ELDP & the Endangered Languages Archive (ELAR)",
    what: "Four decades of linguistic documentation standards: 48kHz WAV, time-aligned ELAN transcription, rich metadata, redundant archival deposit.",
    why: "AI models come and go; a properly archived corpus is forever. Everything we record is archived to these standards, mirrored beyond our own servers.",
    url: "https://www.elararchive.org/",
  },
  {
    org: "Google Arts & Culture · Woolaroo",
    what: "An open-source photo-translation tool for endangered languages using image recognition, live for languages from Māori to Yugambeh.",
    why: "A pattern for lightweight, joyful learning products our talking dictionary can borrow once the lexicon layer exists.",
    url: "https://blog.google/outreach-initiatives/arts-culture/woolaroo-a-new-tool-for-exploring-indigenous-languages/",
  },
];

const RELEASES: {
  version: string;
  name: string;
  when: string;
  status: "shipped" | "next" | "planned";
  items: string[];
  metric: string;
}[] = [
  {
    version: "v0.1",
    name: "Level 0 — Capture",
    when: "Shipped · Aug 2026",
    status: "shipped",
    items: [
      "Browser recording + file upload, direct-to-vault storage",
      "Speaker metadata: village, okka, dialect, age band, fluency",
      "Four-tier guardianship consent enforced at intake",
      "Live public dial, ticker, corpus tracker, contributor leaderboard with badges",
      "Admin review queue (receive → review → reject)",
    ],
    metric: "North-star: weekly consented minutes recorded",
  },
  {
    version: "v0.2",
    name: "The Validation Loop",
    when: "Next · Sep–Oct 2026",
    status: "next",
    items: [
      "Listen-and-verify: community members grade clips (audible? Thakk? which dialect?)",
      "Sentence-prompt mode: read-aloud drives fed from digitized Kodava text",
      "Okka and village leaderboards; festival drive mode for Puthari and the Padayatra",
      "WhatsApp voice-note intake for elders and the diaspora",
      "AI at intake: voice-activity detection, quality scoring, duplicate detection on every upload",
    ],
    metric: "Target: 500 contributors · 100 validated hours",
  },
  {
    version: "v0.3",
    name: "The Data Trust",
    when: "Q4 2026",
    status: "planned",
    items: [
      "Consent ledger and versioned corpus releases (release v1.0 of the corpus)",
      "Mirrored archival deposits: ELAR-standard packages + an Indian institutional mirror",
      "First Whisper fine-tune: public demo of live Thakk transcription at a community event",
      "Researcher access portal gated by the guardianship licence and council approval",
    ],
    metric: "Target: corpus release v1 · ASR demo word error rate < 40%",
  },
  {
    version: "v0.4",
    name: "Thakk Archive alpha",
    when: "Q1 2027",
    status: "planned",
    items: [
      "Public listening archive of consented recordings, credited to speaker, okka, and village",
      "ASR-powered search: find recordings by what is said in them",
      "ASR-in-the-loop transcription workbench — correctors, not typists (3–5× faster)",
      "Paid transcription team onboarded Karya-style",
    ],
    metric: "Target: 50 transcribed hours · 8–10 paid transcribers",
  },
  {
    version: "v1.0",
    name: "The Talking Dictionary",
    when: "2027",
    status: "planned",
    items: [
      "Master lexicon with real audio for every entry; offline-first PWA",
      "TTS v1 from consenting voice donors (10–20 studio hours, VITS/Indic-TTS fine-tune)",
      "ASR v2: word error rate under 25%, dialect-balanced evaluation",
      "Kodava–Kannada–English translation v1 (IndicTrans2/NLLB fine-tune)",
    ],
    metric: "Target: WER < 25% · 5,000 dictionary sessions/month",
  },
  {
    version: "v2.0",
    name: "Ainmane — the speaking companion",
    when: "2027–2028",
    status: "planned",
    items: [
      "Speech-to-speech loop: learner speaks imperfect Thakk → AI understands, replies in Thakk, gently corrects",
      "Daily lessons, songs, family challenges; WhatsApp bot for the diaspora",
      "Classroom pack with schools and the Mangalore University Kodava MA program",
      "On-device inference (whisper.cpp) for offline Kodagu use",
    ],
    metric: "Target: 1,000 weekly conversations in Thakk",
  },
];

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  shipped: { label: "Shipped", bg: "#edf3ec", color: "#1f3d2b" },
  next: { label: "In build", bg: "#f4ead0", color: "#7a6414" },
  planned: { label: "Planned", bg: "#efe6d4", color: "#8c8578" },
};

export default function TechnologyPage() {
  return (
    <>
      <section className="section-maroon" style={{ padding: "56px 0 40px" }}>
        <div className="container">
          <p className="eyebrow">Technology</p>
          <h1>How the machines learn Thakk</h1>
          <p style={{ maxWidth: 680, marginBottom: 0 }}>
            The strategy in one line: <strong>capture with AI in the loop,
            govern under guardianship, fine-tune open models — never train
            from scratch — and ship every model inside a product that helps
            someone speak Thakk today.</strong> Depth below; the plain-language
            version is always the <Link href="/manifesto">manifesto</Link>.
          </p>
        </div>
      </section>

      {/* Technology strategy */}
      <section>
        <div className="container">
          <p className="eyebrow">Part 1</p>
          <h2>The technology strategy</h2>
          <hr className="gold-rule" />
          <div className="grid grid-2">
            <div className="card">
              <p className="kicker">Capture · AI in the loop from clip one</p>
              <h3>The corpus engine</h3>
              <p>
                Every recording that enters the vault is worked by machines so
                humans only do what humans must: voice-activity detection trims
                silence, quality scoring flags unusable audio at upload time,
                speaker diarization separates voices in elder conversations,
                and duplicate detection keeps the corpus honest.
              </p>
              <p style={{ marginBottom: 0 }}>
                Once the first ASR exists, it pre-transcribes the entire
                backlog so the paid transcription team corrects drafts instead
                of typing from silence — the single biggest cost lever in
                low-resource language work (3–5× faster per hour of audio).
                Active learning then closes the loop: the models tell us which
                kinds of speech the corpus lacks, and the prompt engine asks
                contributors for exactly that.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Models · adapt giants, own the result</p>
              <h3>The transfer-learning stack</h3>
              <p>
                Kodava Takk's neighbours — Kannada, Tulu, Malayalam — are
                already inside today's open multilingual models. We fine-tune
                rather than pre-train, so tens of hours of Thakk go a very
                long way and costs stay in lakhs, not crores:
              </p>
              <ul style={{ paddingLeft: "1.1em", marginBottom: 0 }}>
                <li><strong>Hear</strong> — ASR: Whisper large-v3, Meta MMS / w2v-BERT, and AI4Bharat IndicASR checkpoints, LoRA-adapted on transcribed Thakk.</li>
                <li><strong>Speak</strong> — TTS: VITS / Indic-TTS fine-tuned on consenting voice donors only; elder voice cloning solely with family + council consent.</li>
                <li><strong>Translate</strong> — IndicTrans2 / NLLB for the Thakk–Kannada–English triangle, trained on sentence pairs produced during transcription.</li>
                <li><strong>Converse</strong> — an open Indic LLM adapted on the Thakk text corpus, chained ASR → LLM → TTS into the Ainmane companion.</li>
              </ul>
            </div>
            <div className="card">
              <p className="kicker">Evaluation · the community is the benchmark</p>
              <h3>Measured against our own ears</h3>
              <p style={{ marginBottom: 0 }}>
                Every model release is scored two ways: word error rate on a
                held-out test set balanced across dialect (Mendele / Kiggat),
                age group, and genre — and a standing panel of fluent
                listeners who grade naturalness and correctness. A model that
                impresses a benchmark but sounds wrong to a Kodava
                grandmother does not ship.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Data · sovereignty by design</p>
              <h3>The guardianship pipeline</h3>
              <p style={{ marginBottom: 0 }}>
                Consent tiers are enforced in code, not policy documents: an
                archive-only clip physically never enters a training run.
                Corpus releases are versioned like software, deposited to
                ELAR-standard archives and an Indian institutional mirror, and
                any model weights released publicly carry the Kodava data
                guardianship licence — usable for the community&apos;s benefit,
                never sellable. This is the Te Hiku Media doctrine, applied to
                Kodagu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform strategy */}
      <section className="section-warm">
        <div className="container">
          <p className="eyebrow">Part 2</p>
          <h2>The platform strategy</h2>
          <hr className="gold-rule" />
          <p style={{ maxWidth: 760 }}>
            One platform, four surfaces, each feeding the next. The rule that
            binds them: <strong>open models in, guardianship-licensed
            intelligence out.</strong>
          </p>
          <div className="table-wrap">
            <table className="plan">
              <thead>
                <tr>
                  <th>Surface</th>
                  <th>What it is</th>
                  <th>Stack today → tomorrow</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>1 · Capture</strong></td>
                  <td>This site's recorder, sentence-prompt drives, WhatsApp voice-note intake, field-recording kits for elder sessions</td>
                  <td>Next.js PWA + direct-to-vault uploads → offline-first capture app, WhatsApp Business API bot</td>
                </tr>
                <tr>
                  <td><strong>2 · Data trust</strong></td>
                  <td>The consent-aware corpus: metadata, tiered permissions, versioned releases, redundant archives</td>
                  <td>Supabase (Postgres + private object storage) → S3-compatible vault, ELAN/ELAR export, researcher portal</td>
                </tr>
                <tr>
                  <td><strong>3 · Model hub</strong></td>
                  <td>Fine-tuned Thakk models, evaluated by the community, released under the guardianship licence</td>
                  <td>Cloud GPU fine-tune runs (LoRA) → Hugging Face releases; on-device inference via whisper.cpp for offline Kodagu</td>
                </tr>
                <tr>
                  <td><strong>4 · Products</strong></td>
                  <td>Thakk Archive, talking dictionary, classroom pack, Ainmane the speaking companion</td>
                  <td>Web-first, offline-capable; WhatsApp for the diaspora; every product loops users back into contribution</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 18, marginBottom: 0, maxWidth: 760 }}>
            The flywheel: products create speakers → speakers contribute voice
            → the corpus improves the models → better models make better
            products. Preservation that loops back to transmission.
          </p>
        </div>
      </section>

      {/* Research */}
      <section>
        <div className="container">
          <p className="eyebrow">Part 3</p>
          <h2>Research we stand on</h2>
          <hr className="gold-rule" />
          <p style={{ maxWidth: 760 }}>
            Nothing here is invented from zero — Kodava Thakk deliberately
            follows the proven path of the world&apos;s indigenous-AI
            movement, and aims to contribute Kodagu&apos;s chapter back to it.
          </p>
          <div className="grid grid-2">
            {RESEARCH.map((r) => (
              <div className="card" key={r.org}>
                <h3 style={{ fontSize: "1.15rem" }}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.org} ↗
                  </a>
                </h3>
                <p style={{ marginBottom: 10 }}>{r.what}</p>
                <p style={{ marginBottom: 0, fontSize: "0.92rem", color: "var(--kaveri)" }}>
                  <strong>Why it matters to Thakk:</strong> {r.why}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product development strategy */}
      <section className="section-warm">
        <div className="container">
          <p className="eyebrow">Part 4</p>
          <h2>The product development strategy</h2>
          <hr className="gold-rule" />
          <div className="grid grid-3" style={{ marginBottom: 28 }}>
            <div className="card">
              <p className="kicker">North-star metric</p>
              <p style={{ marginBottom: 0 }}>
                <strong>Weekly consented minutes of Thakk recorded.</strong>{" "}
                Supporting: validated hours, transcribed hours, ASR word error
                rate, weekly Ainmane conversations. Vanity metrics (page
                views, followers) are never goals.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Who we build for</p>
              <p style={{ marginBottom: 0 }}>
                Four personas, in priority order: the <strong>elder</strong>{" "}
                (and their facilitator), the <strong>contributor</strong> at
                home or abroad, the <strong>transcriber</strong> earning from
                language work, and the <strong>learner</strong> the whole
                stack exists for.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Operating cadence</p>
              <p style={{ marginBottom: 0 }}>
                Ship product weekly. Release the corpus quarterly. Evaluate
                models each release with the listener panel. Review everything
                sensitive with the language council. Tie every big drive to a
                festival the community already loves.
              </p>
            </div>
          </div>

          <h3 style={{ marginBottom: 18 }}>Release train</h3>
          <div className="grid grid-2">
            {RELEASES.map((rel) => {
              const s = STATUS_STYLE[rel.status];
              return (
                <div className="card" key={rel.version}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                    <p className="kicker" style={{ marginBottom: 0 }}>
                      {rel.version} · {rel.when}
                    </p>
                    <span
                      style={{
                        borderRadius: 999,
                        padding: "2px 12px",
                        fontSize: "0.74rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        background: s.bg,
                        color: s.color,
                      }}
                    >
                      {s.label}
                    </span>
                  </div>
                  <h3 style={{ marginTop: 8 }}>{rel.name}</h3>
                  <ul style={{ paddingLeft: "1.1em", marginBottom: 12 }}>
                    {rel.items.map((i) => (
                      <li key={i} style={{ marginBottom: 5 }}>
                        {i}
                      </li>
                    ))}
                  </ul>
                  <p style={{ margin: 0, paddingTop: 10, borderTop: "1px solid var(--line)", fontSize: "0.9rem", fontWeight: 600, color: "var(--maroon)" }}>
                    {rel.metric}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="card" style={{ marginTop: 28 }}>
            <p className="kicker">Product guardrails</p>
            <ul style={{ paddingLeft: "1.1em", margin: 0 }}>
              <li>Consent is a feature, not a checkbox: enforced in the pipeline, auditable by the council, revocable by the contributor.</li>
              <li>Dialect quotas in every collection target and every evaluation set — Mendele and Kiggat on equal footing.</li>
              <li>Offline-first always: Kodagu&apos;s connectivity is a design constraint, not an afterthought.</li>
              <li>Open source by default; the entire stack (this site included) lives at <a href="https://github.com/kodagu-ai/kodavathakk">github.com/kodagu-ai/kodavathakk</a>.</li>
              <li>Elder time is the scarcest resource in the project — technology schedules around elders, never the reverse.</li>
              <li>Every product must loop its users back into contribution; a product that only consumes the corpus does not ship.</li>
            </ul>
          </div>

          <p style={{ marginTop: 28 }}>
            <Link href="/contribute" className="btn btn-primary">
              The strategy starts with your voice
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
