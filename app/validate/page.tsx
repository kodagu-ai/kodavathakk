import type { Metadata } from "next";
import ValidateClient from "./ValidateClient";

export const metadata: Metadata = {
  title: "Listen & Verify",
  description:
    "Help the Kodava Thakk corpus with your ears: listen to community recordings and confirm they are clear, real Thakk — and which dialect you hear.",
};

export default function ValidatePage() {
  return (
    <>
      <section className="section-maroon" style={{ padding: "56px 0 40px" }}>
        <div className="container">
          <p className="eyebrow">Level 0 · Validation</p>
          <h1>Listen &amp; verify</h1>
          <p style={{ maxWidth: 640, marginBottom: 0 }}>
            Not every contribution is a recording — the corpus also needs
            ears. Listen to a clip, answer three quick questions, and you have
            helped turn raw audio into data the models can learn from. Every
            clip here is shared with its speaker&apos;s public-listening
            consent.
          </p>
        </div>
      </section>
      <section>
        <div className="container" style={{ maxWidth: 720 }}>
          <ValidateClient />
        </div>
      </section>
    </>
  );
}
