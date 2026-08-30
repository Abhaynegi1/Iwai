import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader, Caveat } from "next/font/google";
import { AuthProvider } from "../lib/auth-context";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  display: "swap",
});

const handwriting = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | IWAI",
    default: "IWAI — Event Memory & Shared Photo Gallery",
  },
  description:
    "IWAI brings everyone's perspectives together in one shared private gallery. Guests scan a QR code and contribute — no app required.",
  keywords: ["event photos", "wedding gallery", "photo sharing", "photo album", "guest upload"],
  openGraph: {
    title: "IWAI — Event Memory & Shared Photo Gallery",
    description: "The easiest way to collect candid memories from every guest at your event.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${handwriting.variable}`}>
      <body className="min-h-screen bg-warm-100 font-sans text-ink antialiased selection:bg-forest selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
