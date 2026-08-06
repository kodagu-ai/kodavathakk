import Link from "next/link";

export default function NotFound() {
  return (
    <section>
      <div className="container" style={{ textAlign: "center", padding: "80px 24px" }}>
        <h1>Page not found</h1>
        <p style={{ maxWidth: 480, margin: "0 auto 24px" }}>
          This path has gone quiet. The language should not — add your voice
          while you are here.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to the home page
        </Link>
      </div>
    </section>
  );
}
