import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "The Kodava Thakk manifesto: why an oral language must be preserved as sound, how the community owns its corpus, and how AI becomes the bridge between elders and learners.",
};

// The project manifesto, adapted from the Kodava Thakk Blueprint (Aug 2026).
export default function ManifestoPage() {
  return (
    <section>
      <div className="container prose">
        <p className="eyebrow">The manifesto</p>
        <h1>Languages do not die of old age.</h1>
        <hr className="gold-rule" />

        <blockquote>
          They die of silence — one unrecorded elder and one skipped generation
          at a time.
        </blockquote>

        <p>
          Kodava Takk is a Dravidian language spoken in Kodagu. It has no
          native script in daily use; it is written, when written at all, in
          Kannada script. It lives primarily in the voice — in conversation, in
          the Palame folk songs, in ritual speech at weddings and festivals.
          UNESCO classifies it as <strong>definitely endangered</strong>. The
          2011 census counted about 114,000 mother-tongue speakers. Families
          urbanize, schooling happens in Kannada and English, and every year
          fewer children answer their grandmothers in Thakk.
        </p>
        <p>
          Kodava Thakk — this project — is a decision to preserve the language
          the way it actually exists: <strong>as sound</strong>. We do not
          treat the absence of a script as a weakness. We make audio the
          primary artifact and build everything else on top of it.
        </p>

        <h2>The recording is the text</h2>
        <p>
          For an oral language, every hour of well-recorded, well-described
          speech is the fundamental unit of preservation. Transcription in
          Kannada script is a layer we add on top. A standardized romanization
          is another layer. Any future script — and our community has attempted
          at least seven since 1889 — can be layered on later. The urgent work,
          the work that cannot wait, is capture: the eldest fluent voices, the
          Palame singers, the ritual specialists, recorded in depth, while they
          are with us.
        </p>

        <h2>We are not the first — and that is our advantage</h2>
        <p>
          The Māori of New Zealand proved a small community can build better
          language AI for itself than any tech giant will. Te Hiku Media
          digitized decades of native-speaker radio, ran community recording
          campaigns, and trained speech recognition that outperformed what big
          tech offered — releasing everything under a guardianship licence:
          the data serves the Māori people, and it is never sold.
        </p>
        <p>
          Mozilla Common Voice turned contribution into a simple public ritual
          — read a sentence, validate a clip — across 100+ languages. In
          India, AI4Bharat at IIT Madras and Project Vaani at IISc have built
          the open models, the district playbooks, and the recording
          methodology; Karya showed that data work can be dignified, paid work
          for our own people. We stand on all of it. Nothing here needs to be
          invented — it needs to be <em>done</em>, by us, for us.
        </p>

        <h2>Our principles</h2>
        <ul>
          <li>
            <strong>Audio first, script neutral.</strong> Record now;
            transcribe in Kannada script by convention; keep the script debate
            decoupled from the work of capture.
          </li>
          <li>
            <strong>The community owns the data.</strong> A Kodava data
            guardianship licence and a community trust decide who may use the
            corpus and for what. Contributors keep moral ownership. The corpus
            is never sold. Commercial use requires council approval and
            benefit-sharing.
          </li>
          <li>
            <strong>Elders are the priority queue.</strong> The oldest fluent
            speakers, the Palame singers, and ritual specialists are recorded
            first, in depth, on video where possible.
          </li>
          <li>
            <strong>Contribution is effortless and visible.</strong>{" "}
            Thirty-second phone clips. A public dial that moves with every
            voice. Festivals, the Padayatra, and school competitions as
            recording drives.
          </li>
          <li>
            <strong>Pay for the hard parts.</strong> Volunteers for breadth;
            paid, Karya-style work for transcription, validation, and elder
            sessions. Payment buys the consistency volunteerism cannot
            sustain.
          </li>
          <li>
            <strong>Ride transfer learning.</strong> Never train from scratch.
            Kannada, Tulu, and Malayalam are our language&apos;s neighbours;
            fine-tuned open models mean fifty hours of Thakk goes a very long
            way.
          </li>
          <li>
            <strong>Preservation must loop back to transmission.</strong>{" "}
            Every model ships inside something that helps someone speak Thakk
            today. Archives alone do not revive languages — speakers do.
          </li>
        </ul>

        <h2>What we will build</h2>
        <p>
          Four layers, each useful on its own, each feeding the next: a
          governance and data-trust layer that keeps the corpus owned by the
          community; a corpus engine that captures elder speech, folk
          literature, and everyday conversation at scale — 1,000 hours in 36
          months; a model layer that fine-tunes speech recognition, speech
          synthesis, and translation on that corpus; and a product layer that
          puts the language in people&apos;s pockets — a public listening
          archive, a talking dictionary, classroom packs, and{" "}
          <strong>Ainmane</strong>, an AI conversation partner that recreates
          the thing an endangered language loses first: someone patient to
          talk to.
        </p>

        <h2>What remains is the decision to start recording</h2>
        <p>
          Kodava Takk still has everything it needs to thrive: fluent elders, a
          proud and organized community at home and abroad, strong cultural
          institutions — and, for the first time in history, AI that can learn
          a language from a few hundred hours of loving recordings.
        </p>
        <blockquote>
          Our voices, our data, our language. Kodava Thakk is that decision,
          made systematically.
        </blockquote>

        <p style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/contribute" className="btn btn-primary">
            Give your voice
          </Link>
          <Link href="/roadmap" className="btn btn-outline">
            The roadmap
          </Link>
        </p>
      </div>
    </section>
  );
}
