import type { Metadata } from "next";
import Link from "next/link";
import {
  Camera,
  Sparkles,
  QrCode,
  Smartphone,
  ShieldCheck,
  Zap,
  Users,
  DownloadCloud,
  CheckCircle2,
  ArrowRight,
  Heart,
} from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Logo } from "../components/ui/Logo";

export const metadata: Metadata = {
  title: "IWAI — Event Memory & Shared Photo Gallery",
  description:
    "Every guest's perspective. One shared private gallery. Collect real, candid event memories from weddings, birthdays, and celebrations without app downloads.",
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-warm-100 text-ink selection:bg-forest selection:text-surface">
      <Navbar />

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Warm ambient background aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-brand-100/60 via-apricot-light to-transparent blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtitle Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-surface px-4 py-1.5 text-xs font-semibold text-forest shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald" />
            <span>The Shared Event Album — Zero App Download Required</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink max-w-4xl mx-auto leading-[1.12] font-serif">
            Every guest&apos;s perspective.{" "}
            <span className="italic font-normal text-forest">
              One shared album.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-ink-secondary max-w-2xl mx-auto leading-relaxed font-sans">
            Never chase photos after the party again. Guests scan a table QR code with their camera, snap photos instantly, and everyone relives the memories together.
          </p>

          {/* Hero CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-md">
                <Sparkles className="h-4 w-4" />
                Create Your Event Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Organizer Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-ink-secondary">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald" />
              No app store install required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald" />
              Instant printable table QR flyer
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald" />
              Full host moderation & privacy
            </span>
          </div>

          {/* Hero Interactive Showcase Card */}
          <div className="mt-14 mx-auto max-w-5xl rounded-3xl border border-warm-300 bg-surface p-4 sm:p-6 shadow-[0_12px_40px_rgba(18,60,53,0.06)]">
            <div className="rounded-2xl border border-warm-300/80 bg-warm-50 p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Step 1 */}
                <div className="flex flex-col p-5 rounded-2xl bg-surface border border-warm-300 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest mb-4">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <Badge variant="brand" className="w-fit mb-2">Step 1</Badge>
                  <h3 className="font-bold text-ink text-base">Display Table QR</h3>
                  <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                    Place printable cards on dining tables or display on the venue welcome screen.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col p-5 rounded-2xl bg-surface border border-warm-300 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald mb-4">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <Badge variant="emerald" className="w-fit mb-2">Step 2</Badge>
                  <h3 className="font-bold text-ink text-base">Guests Snap Moments</h3>
                  <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                    Guests point their phone camera, enter a nickname, and snap candid party shots.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col p-5 rounded-2xl bg-surface border border-warm-300 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-mint/20 flex items-center justify-center text-emerald-hover mb-4">
                    <Camera className="h-5 w-5" />
                  </div>
                  <Badge variant="mint" className="w-fit mb-2">Step 3</Badge>
                  <h3 className="font-bold text-ink text-base">Relive Together</h3>
                  <p className="text-xs text-ink-secondary mt-1.5 leading-relaxed">
                    Every perspective flows into one shared high-res gallery everyone can browse.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 border-t border-warm-300 bg-surface-warm/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand">DESIGNED FOR REAL CELEBRATIONS</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink font-serif">
              Simple, Private, and Effortless
            </h2>
            <p className="text-sm text-ink-secondary">
              IWAI was crafted specifically so your non-tech guests can participate in seconds.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable className="relative overflow-hidden bg-surface">
              <div className="font-serif text-6xl font-bold text-warm-300/80 absolute -right-1 -top-1 select-none">
                01
              </div>
              <div className="h-12 w-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Instant Event Setup</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Create your celebration in under 2 minutes. Customize guest upload limits, set event dates, and download a ready-to-print venue flyer with your custom QR code.
              </p>
            </Card>

            <Card hoverable className="relative overflow-hidden bg-surface">
              <div className="font-serif text-6xl font-bold text-warm-300/80 absolute -right-1 -top-1 select-none">
                02
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Zero-App Friction</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                No App Store or Play Store downloads. Guests simply point their iPhone or Android camera at the QR card, type their nickname, and start uploading photos directly.
              </p>
            </Card>

            <Card hoverable className="relative overflow-hidden bg-surface">
              <div className="font-serif text-6xl font-bold text-warm-300/80 absolute -right-1 -top-1 select-none">
                03
              </div>
              <div className="h-12 w-12 rounded-2xl bg-apricot/20 text-[#B86B14] flex items-center justify-center mb-4">
                <DownloadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">Host Control & 1-Click Export</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Moderate photos in real-time from your organizer dashboard. Delete any accidental shot, assign co-hosts, and download the entire event album in full resolution.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────── */}
      <section id="features" className="py-24 border-t border-warm-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="emerald">AUTHENTIC MEMORIES</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink font-serif">
              Everything Needed for Unforgettable Events
            </h2>
            <p className="text-sm text-ink-secondary">
              The thoughtful features that make IWAI the premier photo platform for hosts.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-surface">
              <ShieldCheck className="h-7 w-7 text-forest mb-3" />
              <h3 className="font-bold text-ink text-base mb-1">Private & Code-Protected</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Only invited guests who scan your physical QR poster or enter your unique 6-character code can view or contribute.
              </p>
            </Card>

            <Card className="bg-surface">
              <Smartphone className="h-7 w-7 text-emerald mb-3" />
              <h3 className="font-bold text-ink text-base mb-1">Universal Compatibility</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Whether guests are on modern smartphones or older devices, the web and mobile experience runs lightning fast on all modern browsers.
              </p>
            </Card>

            <Card className="bg-surface">
              <Camera className="h-7 w-7 text-forest mb-3" />
              <h3 className="font-bold text-ink text-base mb-1">Full-Fidelity Resolution</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Say goodbye to compressed messaging app photos. Preserve wedding portraits and party memories in crystal-clear full detail.
              </p>
            </Card>

            <Card className="bg-surface">
              <Users className="h-7 w-7 text-emerald mb-3" />
              <h3 className="font-bold text-ink text-base mb-1">Guest Roster & Roles</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Keep track of who joined your party. Promote trusted friends or wedding party members to co-hosts to help moderate the feed.
              </p>
            </Card>

            <Card className="bg-surface">
              <DownloadCloud className="h-7 w-7 text-[#B86B14] mb-3" />
              <h3 className="font-bold text-ink text-base mb-1">Single-Click Archive Download</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                When the celebration wraps up, download all guest memories in a neat, organized bundle ready for albums or keepsake printing.
              </p>
            </Card>

            <Card className="bg-surface">
              <Heart className="h-7 w-7 text-coral mb-3" />
              <h3 className="font-bold text-ink text-base mb-1">Likes & Photo Captions</h3>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Guests can leave loving captions and like photos, turning your gallery into an interactive, heartfelt digital guestbook.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Pricing Tiers ───────────────────────────────────────── */}
      <section id="pricing" className="py-24 border-t border-warm-300 bg-surface-warm/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand">HONEST PRICING</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink font-serif">
              Simple Plans for Every Celebration
            </h2>
            <p className="text-sm text-ink-secondary">
              Host small gatherings completely free. Upgrade for weddings and milestone celebrations.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col justify-between bg-surface">
              <div>
                <Badge variant="neutral" className="mb-2">STARTER</Badge>
                <h3 className="text-xl font-bold text-ink font-serif">Free</h3>
                <p className="text-xs text-ink-secondary mt-1">For dinner parties & intimate celebrations.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold text-ink font-serif">$0</span>
                  <span className="text-xs text-ink-secondary ml-1">/ forever</span>
                </div>
                <ul className="space-y-2.5 text-xs text-ink-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    1 Active Event
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Up to 250 Photos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Printable Table QR Flyer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Shared Live Gallery
                  </li>
                </ul>
              </div>
              <Link href="/register" className="mt-8">
                <Button variant="secondary" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </Card>

            {/* Celebration (Recommended) */}
            <Card className="flex flex-col justify-between bg-forest text-surface border-forest-dark shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="mint" className="bg-mint text-forest-hover font-bold shadow-sm border-transparent">
                  POPULAR FOR WEDDINGS
                </Badge>
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-mint mb-2 block">
                  CELEBRATION PASS
                </span>
                <h3 className="text-xl font-bold text-surface font-serif">Event Pass</h3>
                <p className="text-xs text-warm-300 mt-1">For weddings, galas, and milestone birthdays.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold text-surface font-serif">$29</span>
                  <span className="text-xs text-warm-300 ml-1">/ single event</span>
                </div>
                <ul className="space-y-2.5 text-xs text-warm-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint" />
                    Up to 2,500 Full-Res Photos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint" />
                    Unlimited Guest Joins
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint" />
                    1-Click ZIP Archive Export
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint" />
                    1 Year Gallery Retention
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-mint" />
                    Printable Custom Table Card Kit
                  </li>
                </ul>
              </div>
              <Link href="/register" className="mt-8">
                <Button variant="secondary" className="w-full bg-surface text-forest hover:bg-surface-warm font-semibold border-transparent">
                  Get Celebration Pass
                </Button>
              </Link>
            </Card>

            {/* Pro / Planners */}
            <Card className="flex flex-col justify-between bg-surface">
              <div>
                <Badge variant="apricot" className="mb-2">PROFESSIONAL</Badge>
                <h3 className="text-xl font-bold text-ink font-serif">Event Planner</h3>
                <p className="text-xs text-ink-secondary mt-1">For photographers, DJs, and wedding venues.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-bold text-ink font-serif">$79</span>
                  <span className="text-xs text-ink-secondary ml-1">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-ink-secondary">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Unlimited Events & Albums
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Custom Branding & Logos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Client & Team Accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald" />
                    Priority Live Support
                  </li>
                </ul>
              </div>
              <Link href="/register" className="mt-8">
                <Button variant="secondary" className="w-full">
                  Start Planner Trial
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-warm-300">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <Badge variant="brand">ANSWERS</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-ink font-serif">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <Card className="bg-surface">
              <h4 className="font-bold text-ink text-base mb-1">
                Do guests need to install an app from the App Store?
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                No! Guests open their native phone camera app, point it at the QR flyer on their table, and tap the link. They can immediately begin taking and uploading photos from their browser.
              </p>
            </Card>

            <Card className="bg-surface">
              <h4 className="font-bold text-ink text-base mb-1">
                Can I remove inappropriate or duplicate photos?
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                Yes. As the event host, you have full moderation authority. You can delete any photo instantly with one click, or designate bridal party or family members as co-hosts to help monitor the feed.
              </p>
            </Card>

            <Card className="bg-surface">
              <h4 className="font-bold text-ink text-base mb-1">
                How do I download the pictures after the event?
              </h4>
              <p className="text-xs text-ink-secondary leading-relaxed">
                From your Organizer Workspace, you can view the entire gallery anytime and download photos individually or export the entire event archive as a ZIP file.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-warm-300 bg-surface py-12 text-ink-secondary text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-auto text-forest" />
            <span className="text-warm-500">|</span>
            <span>The Event Memory Platform</span>
          </div>
          <p>© {new Date().getFullYear()} IWAI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
