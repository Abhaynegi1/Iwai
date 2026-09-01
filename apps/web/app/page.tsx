import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, QrCode, Lock } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Logo } from "../components/ui/Logo";
import { HeroScrapbook } from "../components/ui/HeroScrapbook";
import { DoodleUnderline } from "../components/ui/Doodles";
import { HowItWorks } from "../components/landing/HowItWorks";
import { SocialProof } from "../components/landing/SocialProof";
import { MomentsGallery } from "../components/landing/MomentsGallery";
import { PricingSection } from "../components/landing/PricingSection";
import { QRJoinSection } from "../components/landing/QRJoinSection";
import { FinalCTA } from "../components/landing/FinalCTA";

export const metadata: Metadata = {
  title: "IWAI — Everyone's version of the moment",
  description:
    "Collect and share photos from the moments that matter. No app, no sign up. Just scan, shoot and share.",
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-[#F7F7F5] text-[#0F1720] selection:bg-[#123C35] selection:text-[#FFFDF8]">
      <Navbar />

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-6 pb-14 sm:pt-14 sm:pb-20 overflow-x-clip">
        {/* Soft warm paper ambient background */}
        <div className="absolute top-0 left-1/3 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-gradient-to-b from-[#123C35]/5 via-[#E5E7E2]/30 to-transparent blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Column: Emotion-First Headline & CTAs */}
            <div className="lg:col-span-6 xl:col-span-5 space-y-6 sm:space-y-7 text-left">
              
              {/* Heading: "Everyone's version of the moment." */}
              <div className="space-y-1">
                <h1 className="font-handwriting text-4xl xs:text-5xl sm:text-7xl lg:text-8xl font-bold text-forest leading-[1.08] sm:leading-[1.04] tracking-tight break-words">
                  Everyone&apos;s
                  <span className="block">version of</span>
                  <span className="block relative mt-1">
                    the moment.
                    {/* Organic hand-drawn scribble brush underline */}
                    <DoodleUnderline className="absolute -bottom-2 sm:-bottom-3 left-0 w-full max-w-[240px] sm:max-w-[340px] text-forest/70" />
                  </span>
                </h1>
              </div>

              {/* Supporting Copy */}
              <p className="text-sm xs:text-base sm:text-lg text-ink-secondary leading-relaxed font-sans max-w-md">
                Collect and share photos from the moments that matter. No app, no sign up. Just scan, shoot and share.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 pt-1">
                <Link href="/register" className="w-full xs:w-auto">
                  <button className="w-full xs:w-auto rounded-2xl px-7 py-3.5 bg-forest hover:bg-forest-hover text-surface font-medium text-sm shadow-[0_4px_16px_rgba(18,60,53,0.18)] transition-all text-center">
                    Create Event
                  </button>
                </Link>
                <Link href="#how-it-works" className="w-full xs:w-auto">
                  <button className="w-full xs:w-auto rounded-2xl px-7 py-3.5 bg-surface/90 border border-warm-400/90 hover:bg-warm-200 text-ink font-medium text-sm transition-all text-center">
                    How It Works
                  </button>
                </Link>
              </div>

              {/* Small Benefits Row */}
              <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-ink-secondary">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald" />
                  No app required
                </span>
                <span className="flex items-center gap-1.5">
                  <QrCode className="h-4 w-4 text-emerald" />
                  Instant QR join
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-emerald" />
                  Private &amp; secure
                </span>
              </div>

            </div>

            {/* Right Column: Physical Scrapbook Collage */}
            <div className="lg:col-span-6 xl:col-span-7 overflow-hidden sm:overflow-visible">
              <HeroScrapbook />
            </div>

          </div>
        </div>
      </section>

      {/* ─── Social Proof Strip ──────────────────────────────────── */}
      <SocialProof />

      {/* ─── How It Works (3 Steps with Doodles) ─────────────────── */}
      <HowItWorks />

      {/* ─── Real Moments Gallery (Candid Physical Prints) ───────── */}
      <MomentsGallery />

      {/* ─── Simple, Transparent Pricing ─────────────────────────── */}
      <PricingSection />

      {/* ─── QR Join Section (Quick Scan Interaction) ────────────── */}
      <QRJoinSection />

      {/* ─── Final Emotional CTA ─────────────────────────────────── */}
      <FinalCTA />

      {/* ─── Minimalist Editorial Footer ─────────────────────────── */}
      <footer className="border-t border-warm-300 bg-surface py-10 sm:py-12 text-ink-secondary text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Brand & Copyright */}
          <div className="flex items-center gap-4">
            <Logo className="h-7 w-auto text-forest" />
            <span className="text-warm-400">|</span>
            <p>© {new Date().getFullYear()} Iwai. All rights reserved.</p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="#how-it-works" className="hover:text-ink transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="hover:text-ink transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-ink transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-ink transition-colors">
              Create Event
            </Link>
          </div>

        </div>
      </footer>
    </div>
  );
}
