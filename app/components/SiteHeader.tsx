import Link from "next/link";
import SiteNav from "./SiteNav";

// Horizontal lockup per Brand Guidelines v2.0 §02: seal left; KODAVA THAKK in
// Cormorant Garamond Bold letter-spaced 14% in Kupya Maroon; ಕೊಡವ ತಕ್ಕ್ beneath
// in Noto Serif Kannada in Mandethira Gold. Nav collapses to a hamburger on
// mobile (see SiteNav).
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container">
        <Link href="/" className="lockup" aria-label="Kodava Thakk home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/kodava-thakk-logo-transparent.svg" alt="The Speaking Flame — Kodava Thakk seal" />
          <span className="words">
            <span className="latin">KODAVA THAKK</span>
            <span className="kannada">ಕೊಡವ ತಕ್ಕ್</span>
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
