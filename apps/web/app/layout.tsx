import type { Metadata } from "next";
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
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
