import type { Metadata } from "next";
import ContributeForm from "./ContributeForm";

export const metadata: Metadata = {
  title: "Give Your Voice",
  description:
    "Level 0 of the Kodava Thakk corpus: record 30 seconds (or an hour) of Kodava Takk in your browser, choose your consent, and your voice joins the community archive.",
};

export default function ContributePage() {
  return (
    <>
      <section className="section-maroon" style={{ padding: "56px 0 40px" }}>
        <div className="container">
          <p className="eyebrow">Level 0 · Voice collection</p>
          <h1>Give your voice</h1>
          <p style={{ maxWidth: 640, marginBottom: 0 }}>
            Speak in Kodava Takk — a story, a song, a proverb, a blessing, or
            an answer to a simple prompt. Your recording is described, stored
            under community guardianship, and counted on the public dial the
            moment it arrives. Speakers, okkas, and villages are credited,
            never anonymous &ldquo;users&rdquo;.
          </p>
        </div>
      </section>
      <section>
        <div className="container" style={{ maxWidth: 860 }}>
          <ContributeForm />
        </div>
      </section>
      <section className="section-warm" style={{ padding: "40px 0" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <h3>Recording well, in one breath</h3>
          <ul style={{ paddingLeft: "1.2em", margin: 0 }}>
            <li>Find a quiet room; hold the phone about a hand&apos;s width away.</li>
            <li>Speak the way you speak at home — natural Thakk beats careful Thakk.</li>
            <li>Recording an elder? Sit close, let them finish, and capture the long version. That is the treasure.</li>
            <li>One clip, one thing: a single story, a single song. Upload as many clips as you like.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
