import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "../../lib/adminAuth";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

// Server-side gate for the whole admin panel. Middleware already blocks
// non-admins; re-checked here (defence in depth) so no page renders data
// without a verified admin session.
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <section style={{ paddingTop: 28 }}>
      <div className="container">
        <div className="admin-bar">
          <div className="admin-bar-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/kodava-thakk-logo-transparent.svg" alt="" style={{ width: 44 }} />
            <div>
              <strong style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", color: "var(--maroon)" }}>
                Thakk Admin
              </strong>
              <nav className="admin-tabs" aria-label="Admin">
                <Link href="/admin">Dashboard</Link>
                <Link href="/admin/contributions">Review queue</Link>
                <Link href="/admin/contributors">Contributors</Link>
                <Link href="/admin/sentences">Sentences</Link>
                <Link href="/admin/drives">Drives</Link>
              </nav>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--mist)" }}>{user.email}</span>
            <LogoutButton />
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
