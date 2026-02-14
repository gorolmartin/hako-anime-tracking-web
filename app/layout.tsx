import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const overusedGrotesk = localFont({
  src: "./fonts/OverusedGrotesk-VF.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gethako.app"),
  title: "Hako - Track Your Anime | Never Lose Your Progress Again",
  description:
    "The anime tracker that actually works. Sync with AniList, track seasonal shows, and never ask \"which episode am I on?\" again. Built by anime fans, for anime fans.",
  keywords: [
    "anime tracker",
    "anime list",
    "anilist",
    "myanimelist",
    "track anime",
    "anime app",
    "seasonal anime",
    "anime organizer",
    "anime watchlist",
  ],
  authors: [{ name: "Hako" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gethako.app",
    siteName: "Hako",
    title: "Track Your Anime | Never Lose Your Progress Again",
    description:
      "The anime tracker that actually works. Sync with AniList, track seasonal shows, and organize your watchlist the right way. Join 1,247+ anime fans waiting for launch.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Anime tracking app interface showing a clean, organized watchlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@gethako",
    creator: "@gethako",
    title: "Track Your Anime | Never Lose Your Progress Again",
    description:
      "The anime tracker that actually works. Sync with AniList, track seasonal shows, and never lose your progress. Built by anime fans, for anime fans. 💜",
    images: ["/twitter-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://gethako.app/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7C3AED",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Hako",
    description:
      "The anime tracker that actually works. Sync with AniList, track seasonal shows, and never lose your progress again.",
    url: "https://gethako.app",
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    screenshot: "https://gethako.app/og-image.png",
    featureList: [
      "AniList synchronization",
      "Seasonal anime tracking",
      "Mood-based recommendations",
      "Progress tracking",
      "Watchlist organization",
    ],
  };

  return (
    <html lang="en" className={`${overusedGrotesk.variable} dark`}>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-bg-app focus:bg-bg-surface focus:text-text-primary"
        >
          Skip to main content
        </a>
        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
