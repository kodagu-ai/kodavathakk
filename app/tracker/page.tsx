import type { Metadata } from "next";
import Link from "next/link";
import StatsBand from "../components/StatsBand";
import TrackerDetail from "./TrackerDetail";

export const metadata: Metadata = {
  title: "Corpus Tracker",
  description:
    "The public tracker of the Kodava Thakk corpus: voices contributed, hours recorded, dialect balance, and progress toward each roadmap milestone.",
};

export default function TrackerPage() {
  return (
    <>
      <section className="section-maroon" style={{ padding: "56px 0 0" }}>
        <div className="container">
          <p className="eyebrow">Public accounting</p>
          <h1>The corpus tracker</h1>
          <p style={{ maxWidth: 640 }}>
            The corpus is the community&apos;s asset, so its growth is public.
            Every number below updates as recordings arrive. Personal details
            stay private — the tracker shows only what a contributor has
            consented to share.
          </p>
        </div>
        <div style={{ marginTop: 28 }}>
          <StatsBand />
        </div>
      </section>
      <TrackerDetail />
      <section className="section-warm" style={{ padding: "44px 0" }}>
        <div className="container">
          <h3>How the backend tracker works</h3>
          <p style={{ maxWidth: 760 }}>
            Every clip lands in the community database with its metadata —
            speaker, village, okka, dialect, age band, content type, consent
            tier, and duration — ready for the AI layer: automatic
            pre-transcription, quality scoring, and dialect analysis feed a
            human review queue, so people only correct, never start from
            scratch. Recordings with archive-only consent never leave the
            vault.
          </p>
          <p style={{ margin: 0 }}>
            <Link href="/contribute" className="btn btn-primary">
              Add your voice to these numbers
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
