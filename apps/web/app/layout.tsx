import type { Metadata } from "next";
import { AuthProvider } from "../lib/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | IWAI",
    default: "IWAI — Event Memory & Photo Sharing",
  },
  description:
    "IWAI brings everyone's photos together in one shared gallery. Guests scan a QR code and contribute — no app required.",
  keywords: ["event photos", "photo sharing", "event gallery", "photo album"],
  openGraph: {
    title: "IWAI — Event Memory & Photo Sharing",
    description: "The easiest way to collect memories from every guest at your event.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
