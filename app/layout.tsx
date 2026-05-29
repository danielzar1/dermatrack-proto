import type { Metadata, Viewport } from "next";
import { Newsreader, Spline_Sans } from "next/font/google";
import "./globals.css";
import { GuidedTour } from "@/components/GuidedTour";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const splineSans = Spline_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-spline",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DermaTrack",
  description: "POPIA-aware dermatology tracking — patient and clinician.",
  manifest: "/manifest.webmanifest",
  // Not a public marketing site; keep it out of indexes for now.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#213a5c",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${splineSans.variable}`}>
      <body>
        {children}
        <GuidedTour />
      </body>
    </html>
  );
}
