import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Noto_Serif_Kannada,
  Noto_Sans_Kannada,
} from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { site } from "./lib/site";

// Brand type system (Guidelines v2.0 §05): a heritage serif for the voice of
// wisdom, a modern grotesque for the voice of technology, and first-class
// Kannada companions with equal dignity.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});
const notoSerifKn = Noto_Serif_Kannada({
  subsets: ["kannada"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-kn",
  display: "swap",
});
const notoSansKn = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "600"],
  variable: "--font-noto-sans-kn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Voice of the Hills`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Voice of the Hills`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: "/brand/kodava-thakk-logo-primary-1024.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary",
    title: `${site.name} — Voice of the Hills`,
    description: site.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#6E1E2A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} ${notoSerifKn.variable} ${notoSansKn.variable}`}
    >
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
