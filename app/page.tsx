import Link from "next/link";
import StatsBand from "./components/StatsBand";
import { site } from "./lib/site";

export default function HomePage() {
  return (
    <>
      {/* Hero — reversed seal on Kupya Maroon (Guidelines §02) */}
      <div className="hero">
        <div className="container hero-grid">
          <div>
            <p className="kannada-display kn">ಕೊಡವ ತಕ್ಕ್ · ನುಡಿಯೇ ಬರಹ</p>
            <h1>The recording is the text.</h1>
            <p className="lede">
              Kodava Takk has no script of its own — it lives in the voice. We
              are building a community-owned archive of that voice, and
              teaching AI to listen, speak, and pass it on. UNESCO calls our
              language definitely endangered. We call it ours to keep.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 26 }}>
              <Link href="/contribute" className="btn btn-ivory">
                ● Give your voice — 30 seconds counts
              </Link>
              <Link href="/manifesto" className="btn btn-outline-ivory">
                Read the manifesto
              </Link>
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="hero-seal"
              src="/brand/kodava-thakk-logo-reversed.svg"
              alt="The Speaking Flame — the thook bolcha lamp radiating waveform arcs over the hills of Kodagu"
            />
          </div>
        </div>
      </div>

      {/* Live corpus dial + ticker */}
      <StatsBand />

      {/* Level 0 — what is live right now */}
      <section>
        <div className="container">
          <p className="eyebrow">Now open · Level 0</p>
          <h2>The first hundred hours</h2>
          <hr className="gold-rule" />
          <div className="grid grid-2">
            <div>
              <p>
                Every language AI begins the same way: with recordings. Level 0
                is the founding drive of the Kodava Thakk corpus — voices from
                every village, every okka, both dialects, home and diaspora.
                The dial above moves with every clip received.
              </p>
              <p>
                Record a story, a song, a proverb, a blessing, or just answer a
                prompt about your morning coffee. Thirty seconds from a phone
                is a real contribution; an hour with an elder is an heirloom.
              </p>
              <Link href="/contribute" className="btn btn-primary" style={{ marginTop: 8 }}>
                Start recording
              </Link>
            </div>
            <div className="card">
              <p className="kicker">How it works</p>
              <ol style={{ margin: 0, paddingLeft: "1.2em", lineHeight: 1.9 }}>
                <li>Record in the browser, or upload a file — no app needed.</li>
                <li>Tell us who is speaking: village, okka, dialect, age.</li>
                <li>Choose your consent — archive, research, model training, public listening.</li>
                <li>Your clip lands in the community tracker, described and safe.</li>
                <li>AI pre-sorts and pre-transcribes; people verify. The corpus grows.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* The four layers */}
      <section className="section-warm">
        <div className="container">
          <p className="eyebrow">The plan</p>
          <h2>Four layers, one purpose</h2>
          <hr className="gold-rule" />
          <div className="grid grid-2">
            <div className="card">
              <p className="kicker">Layer 0 · Guardianship</p>
              <h3>The community owns the data</h3>
              <p style={{ marginBottom: 0 }}>
                A Kodava data guardianship licence, modelled on the Māori
                Kaitiakitanga licence: contributors keep moral ownership, a
                community trust is custodian, and the corpus can never be sold.
                A council of elders, teachers, and technologists stewards every
                decision.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Layer 1 · The corpus</p>
              <h3>1,000 hours of living Thakk</h3>
              <p style={{ marginBottom: 0 }}>
                Elder and Palame sessions recorded in depth; crowd voice drives
                for breadth; radio and family archives digitized; the Pattole
                Palame and dictionaries brought online. Both dialects, Mendele
                and Kiggat, by design.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Layer 2 · The models</p>
              <h3>AI that hears and speaks Thakk</h3>
              <p style={{ marginBottom: 0 }}>
                Speech recognition first, fine-tuned from open Dravidian
                models. Then text-to-speech from consenting voice donors, then
                translation between Thakk, Kannada, and English. The app learns
                from your voice.
              </p>
            </div>
            <div className="card">
              <p className="kicker">Layer 3 · The products</p>
              <h3>Someone patient to talk to</h3>
              <p style={{ marginBottom: 0 }}>
                A public listening archive, a talking dictionary, classroom
                packs — and Ainmane, the speech-to-speech companion that lets a
                learner speak imperfect Thakk and be answered, gently, in
                Thakk.
              </p>
            </div>
          </div>
          <p style={{ marginTop: 24 }}>
            <Link href="/roadmap" style={{ fontWeight: 600 }}>
              See the full 36-month roadmap and milestones →
            </Link>
          </p>
        </div>
      </section>

      {/* Community */}
      <section className="section-maroon">
        <div className="container">
          <p className="eyebrow">Join in</p>
          <h2>This is done by us, together</h2>
          <p style={{ maxWidth: 640 }}>
            Kodava Thakk runs on the {""}
            <a href={site.parent.url}>Kodagu.ai</a> community — the same open
            network behind Aane Alert, Nela, and Manabala. Recordists,
            transcribers, singers, linguists, developers, and every fluent
            grandparent: there is a seat for you.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
            <Link href="/community" className="btn btn-ivory">
              Ways to contribute
            </Link>
            <a href={site.parent.joinUrl} className="btn btn-outline-ivory">
              Join the Kodagu.ai community
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
