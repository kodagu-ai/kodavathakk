import Link from "next/link";
import { site } from "../lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ maxWidth: 420 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/kodava-thakk-logo-reversed.svg"
              alt=""
              style={{ width: 72, marginBottom: 14 }}
            />
            <p style={{ marginBottom: 6 }}>
              <strong>Kodava Thakk</strong> · <span className="kn">ಕೊಡವ ತಕ್ಕ್</span>
            </p>
            <p style={{ color: "rgba(247,241,229,0.75)" }}>
              A community-owned AI language preservation initiative for Kodava
            Takk. Our voices, our data, our language.
            </p>
            <p className="tagline">Voice of the Hills</p>
          </div>
          <nav style={{ display: "grid", gap: 8 }} aria-label="Footer">
            <Link href="/manifesto">Manifesto</Link>
            <Link href="/roadmap">Roadmap &amp; milestones</Link>
            <Link href="/technology">Technology</Link>
            <Link href="/contribute">Contribute your voice</Link>
            <Link href="/tracker">Corpus tracker</Link>
            <Link href="/community">Community</Link>
          </nav>
          <div style={{ display: "grid", gap: 8 }}>
            <a href={site.parent.url}>Kodagu.ai — the community hub</a>
            <a href={site.parent.projectUrl}>Kodava Thakk on Kodagu.ai</a>
            <a href={site.githubUrl}>GitHub — open source</a>
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          </div>
        </div>
        <p
          style={{
            marginTop: 36,
            paddingTop: 18,
            borderTop: "1px solid rgba(247,241,229,0.18)",
            fontSize: "0.8rem",
            color: "rgba(247,241,229,0.6)",
          }}
        >
          A Nada Kodagu initiative · a {""}
          <a href={site.parent.url}>Kodagu.ai</a> community project · the corpus
          is community-owned under a Kodava data guardianship licence.
        </p>
      </div>
    </footer>
  );
}
