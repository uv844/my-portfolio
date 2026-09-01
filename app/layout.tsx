import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

import { profile } from "@/content/profile";
import Backdrop from "@/components/fx/Backdrop";
import PointerProvider from "@/components/fx/PointerProvider";
import RevealRoot from "@/components/fx/RevealRoot";
import Telemetry from "@/components/fx/Telemetry";
import MotionRoot from "@/components/motion/MotionRoot";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

const title = `${profile.name} — ${profile.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description: profile.tagline,
  applicationName: `${profile.name} · Portfolio`,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  keywords: [
    "Yuvraj Singh",
    "full stack developer",
    "frontend developer",
    "backend developer",
    "Java developer",
    "web developer",
    "React",
    "TypeScript",
    "REST API",
    "Node.js",
    "MySQL",
    "B.Tech CSE AI ML",
    "portfolio",
    "software engineering intern",
  ],
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title,
    description: profile.tagline,
    siteName: `${profile.name} · Portfolio`,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** JSON-LD so search engines get the structured facts, not just prose. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  url: profile.siteUrl,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Modinagar",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Raj Kumar Goel Institute of Technology",
  },
  knowsAbout: [
    "Full-Stack Web Development",
    "React",
    "TypeScript",
    "Java",
    "Node.js",
    "REST APIs",
    "MySQL",
    "Data Structures",
  ],
  sameAs: [
    "https://github.com/uv844",
    "https://www.linkedin.com/in/yuvraj-singh-258649312/",
    "https://leetcode.com/u/yuvrajch1503/",
  ],
};

/**
 * Every scroll animation on the page starts from a hidden state, which is written into
 * the server HTML as an inline style. With JavaScript disabled nothing would ever flip
 * it back, so the content would be in the markup but invisible. These rules undo all of
 * it — `!important` beats the inline styles, which carry no priority.
 *
 * The scene planes are included because their pitch is written by JavaScript: with none
 * running, `--pitch` never gets set, and pinning the transform to `none` guarantees every
 * section resolves square rather than relying on the @property initial value.
 */
const noScriptCss = `
[data-reveal],[data-stair]{opacity:1!important;transform:none!important;clip-path:none!important}
.stair-word{overflow:visible!important}
.stair-word-in{transform:none!important}
.scene-plane{transform:none!important}
`;

/**
 * Applies the stored 3D preference before first paint.
 *
 * Without this, a visitor who has switched the scene off would still get one frame of
 * rotating planes on every load, which is precisely what they opted out of. Runs blocking
 * in <head> — it is two statements and touches only one attribute.
 */
const sceneBootScript = `try{if(localStorage.getItem('scene3d')==='off')document.documentElement.dataset.scene='off'}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: sceneBootScript }} />
      </head>
      <body className="relative antialiased" suppressHydrationWarning>
        <noscript>
          <style>{noScriptCss}</style>
        </noscript>

        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-bg"
        >
          Skip to content
        </a>

        {/* These four are `position: fixed`. They MUST stay outside every Scene3D — a
            3D-transformed ancestor becomes the containing block for fixed descendants,
            which would silently turn them into section-relative elements. */}
        <Backdrop />
        <PointerProvider />
        <RevealRoot />
        <Telemetry />

        <MotionRoot>
          <Nav />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
        </MotionRoot>
      </body>
    </html>
  );
}
