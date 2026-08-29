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

export const metadata: Metadata = {
  title: "IWAI — Event Memory & Photo Sharing Platform",
  description:
    "Every guest's perspective. One shared private gallery. Collect real, candid event memories from weddings, birthdays, and celebrations without app downloads.",
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-brand-500 selection:text-white">
      <Navbar />

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 overflow-hidden">
        {/* Glow ambient background lights */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-gradient-to-tr from-brand-600/20 via-indigo-600/15 to-purple-600/10 blur-[140px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur-md mb-8">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>IWAI 2.0 — Zero-Friction Event Galleries</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1]">
            Every guest&apos;s perspective.{" "}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              One shared gallery.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop chasing photos across messaging apps. Guests simply scan a QR code at your wedding or celebration and snap away. No app install required.
          </p>

          {/* CTA Row */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-xl shadow-brand-500/25">
                <Sparkles className="h-5 w-5" />
                Create Your Event Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              No app store install
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Instant QR flyer kit
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Full host moderation
            </span>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-16 sm:mt-20 mx-auto max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/60 p-3 sm:p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Step 1 Preview */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 mb-3">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">1. Display Venue QR</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Print custom table cards or project on venue screens.
                  </p>
                </div>

                {/* Step 2 Preview */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">2. Guests Capture & Share</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Guests snap unfiltered candid moments directly from their phones.
                  </p>
                </div>

                {/* Step 3 Preview */}
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-3">
                    <Camera className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">3. Relive the Memories</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    All perspectives gathered in one private high-resolution gallery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 border-t border-slate-900 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand">EFFORTLESS EXPERIENCE</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              How IWAI Works
            </h2>
            <p className="text-sm text-slate-400">
              Designed from the ground up for zero friction at real-world events.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="relative overflow-hidden group">
              <div className="text-6xl font-black text-slate-800/40 absolute -right-2 -top-2 select-none">
                01
              </div>
              <div className="h-12 w-12 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Create & Generate QR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set up your event in 60 seconds. Set photo quotas, guest upload rules, and instantly download a printable invitation flyer for tables.
              </p>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="text-6xl font-black text-slate-800/40 absolute -right-2 -top-2 select-none">
                02
              </div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Zero-App Guest Joining</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Guests scan the QR code with their native phone camera. They pick a nickname and are immediately ready to capture photos.
              </p>
            </Card>

            <Card className="relative overflow-hidden group">
              <div className="text-6xl font-black text-slate-800/40 absolute -right-2 -top-2 select-none">
                03
              </div>
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
                <DownloadCloud className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Live Gallery & Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch memories stream in live during the party. Moderate or delete inappropriate photos, project a live slideshow, or download the full archive.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────────── */}
      <section id="features" className="py-24 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand">POWERFUL TOOLS</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Built for Weddings, Parties & Life Milestones
            </h2>
            <p className="text-sm text-slate-400">
              Everything an organizer needs to curate the perfect album without the chaos.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <ShieldCheck className="h-8 w-8 text-brand-400 mb-3" />
              <h3 className="font-bold text-white text-base mb-1">Private & Secure</h3>
              <p className="text-xs text-slate-400">
                Only guests who possess your private 6-character event code or QR invite can enter and view photos.
              </p>
            </Card>

            <Card>
              <Smartphone className="h-8 w-8 text-indigo-400 mb-3" />
              <h3 className="font-bold text-white text-base mb-1">Works on Any Device</h3>
              <p className="text-xs text-slate-400">
                iOS or Android, mobile browser or native app — everyone participates seamlessly with no barrier to entry.
              </p>
            </Card>

            <Card>
              <Camera className="h-8 w-8 text-purple-400 mb-3" />
              <h3 className="font-bold text-white text-base mb-1">Full-Res Quality</h3>
              <p className="text-xs text-slate-400">
                Never suffer through crushed WhatsApp or SMS image compression. Store memories in true fidelity.
              </p>
            </Card>

            <Card>
              <Users className="h-8 w-8 text-emerald-400 mb-3" />
              <h3 className="font-bold text-white text-base mb-1">Guest Roster & Roles</h3>
              <p className="text-xs text-slate-400">
                See who joined your celebration. Promote trusted friends or wedding party members to co-hosts.
              </p>
            </Card>

            <Card>
              <DownloadCloud className="h-8 w-8 text-amber-400 mb-3" />
              <h3 className="font-bold text-white text-base mb-1">Batch Export</h3>
              <p className="text-xs text-slate-400">
                Download your complete event album in high resolution with a single click once the party concludes.
              </p>
            </Card>

            <Card>
              <Heart className="h-8 w-8 text-rose-400 mb-3" />
              <h3 className="font-bold text-white text-base mb-1">Likes & Captions</h3>
              <p className="text-xs text-slate-400">
                Guests can leave fun captions and like their favorite candid shots right from the shared feed.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Pricing Tiers ───────────────────────────────────────── */}
      <section id="pricing" className="py-24 border-t border-slate-900 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand">SIMPLE PRICING</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Pick the Perfect Plan for Your Celebration
            </h2>
            <p className="text-sm text-slate-400">
              Start completely free. Upgrade whenever your event needs more capacity.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="flex flex-col justify-between">
              <div>
                <Badge variant="neutral" className="mb-2">STARTER</Badge>
                <h3 className="text-xl font-bold text-white">Free</h3>
                <p className="text-xs text-slate-400 mt-1">Perfect for dinner parties & small gatherings.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400 ml-1">/ forever</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    1 Active Event
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Up to 250 Total Photos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Printable QR Flyer
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    Standard Live Gallery
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
            <Card className="flex flex-col justify-between border-brand-500/50 bg-slate-900/90 shadow-brand-500/10 shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="brand" className="bg-brand-500 text-white border-transparent shadow-md">
                  MOST POPULAR
                </Badge>
              </div>
              <div>
                <Badge variant="brand" className="mb-2">CELEBRATION</Badge>
                <h3 className="text-xl font-bold text-white">Event Pass</h3>
                <p className="text-xs text-slate-400 mt-1">For weddings, galas, and milestone birthdays.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$29</span>
                  <span className="text-xs text-slate-400 ml-1">/ single event</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" />
                    Up to 2,500 High-Res Photos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" />
                    Unlimited Guest Joins
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" />
                    1-Click ZIP Archive Export
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" />
                    1 Year Gallery Retention
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-brand-400" />
                    Custom Venue Flyer Branding
                  </li>
                </ul>
              </div>
              <Link href="/register" className="mt-8">
                <Button variant="primary" className="w-full shadow-lg shadow-brand-500/25">
                  Choose Celebration
                </Button>
              </Link>
            </Card>

            {/* Pro / Planners */}
            <Card className="flex flex-col justify-between">
              <div>
                <Badge variant="warning" className="mb-2">PROFESSIONAL</Badge>
                <h3 className="text-xl font-bold text-white">Event Planner</h3>
                <p className="text-xs text-slate-400 mt-1">For photographers, DJs, and venue coordinators.</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$79</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    Unlimited Events & Photos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    White-Label Galleries
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    Multi-Organizer Accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400" />
                    Dedicated Priority Support
                  </li>
                </ul>
              </div>
              <Link href="/register" className="mt-8">
                <Button variant="secondary" className="w-full">
                  Contact Sales
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 border-t border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <Badge variant="neutral">COMMON QUESTIONS</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <Card>
              <h4 className="font-bold text-white text-base mb-1">
                Do guests need to download an app?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No! Guests simply open their phone&apos;s camera app, point it at your event QR code, and open the join link. They can upload photos directly from their browser or use the lightweight mobile web interface.
              </p>
            </Card>

            <Card>
              <h4 className="font-bold text-white text-base mb-1">
                Can I remove inappropriate or accidental photos?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yes. As the event organizer, you have full moderation control from your dashboard. You can delete any photo instantly with one click, or designate trusted friends as co-hosts to help moderate.
              </p>
            </Card>

            <Card>
              <h4 className="font-bold text-white text-base mb-1">
                How do I download all the photos afterwards?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                From your Event Workspace, you can access your gallery anytime and download high-resolution photos individually or export the entire event archive.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-xs">
              I
            </div>
            <span className="font-bold text-slate-300">IWAI</span>
            <span>— The Event Memory Platform</span>
          </div>
          <p>© {new Date().getFullYear()} IWAI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
