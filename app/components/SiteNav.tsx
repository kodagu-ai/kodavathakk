"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Primary navigation. Desktop (>820px): the inline row. Mobile: a hamburger
// that opens a full-screen ivory panel with every link and the CTA — same
// pattern as the Kodagu.ai hub, in the Thakk brand.
export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Close on Escape, and whenever the viewport grows back to desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 821px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = (
    <>
      <Link href="/manifesto" onClick={close}>Manifesto</Link>
      <Link href="/roadmap" onClick={close}>Roadmap</Link>
      <Link href="/technology" onClick={close}>Technology</Link>
      <Link href="/tracker" onClick={close}>Tracker</Link>
      <Link href="/community" onClick={close}>Community</Link>
    </>
  );

  const cta = (
    <Link href="/contribute" className="nav-cta" onClick={close}>
      Give your voice
    </Link>
  );

  return (
    <>
      {/* Desktop inline nav */}
      <nav className="main-nav nav-desktop" aria-label="Main">
        {links}
        {cta}
      </nav>

      {/* Mobile hamburger */}
      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`nav-toggle-icon ${open ? "is-open" : ""}`} aria-hidden>
          <span />
          <span />
          <span />
        </span>
      </button>

      {/* Full-screen mobile panel */}
      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Main">
          {links}
          {cta}
          <p className="mobile-nav-foot">
            ಕೊಡವ ತಕ್ಕ್ · Voice of the Hills ·{" "}
            <a href="https://kodagu.ai" onClick={close}>
              a Kodagu.ai project
            </a>
          </p>
        </nav>
      )}
    </>
  );
}
