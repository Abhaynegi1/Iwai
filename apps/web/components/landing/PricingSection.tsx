"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { DoodleStar, DoodleUnderline } from "../ui/Doodles";

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  popular?: boolean;
  badge?: string;
  features: string[];
  cta: string;
  href: string;
}

const TIERS: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for intimate dinner parties, game nights, and trying out IWAI.",
    features: [
      "1 active event",
      "Up to 50 guests",
      "250 high-res candid photos",
      "Instant QR join (no app or signup)",
      "30-day shared gallery access",
      "Standard web photo download",
    ],
    cta: "Start Free",
    href: "/register",
  },
  {
    name: "Celebration Pass",
    price: "$19",
    period: "one-time per event",
    popular: true,
    badge: "Most Loved for Weddings & Parties",
    description: "Everything you need for your wedding, birthday, or once-in-a-lifetime milestone.",
    features: [
      "Unlimited guests",
      "Unlimited full-resolution photos & video clips",
      "1-year archival gallery access",
      "1-click full-res ZIP album download",
      "Custom branded QR flyer & printable template",
      "Live slideshow mode for TVs & projectors",
      "Host moderation & guest hide controls",
    ],
    cta: "Get Celebration Pass",
    href: "/register",
  },
  {
    name: "Studio / Planner",
    price: "$49",
    period: "per month",
    description: "Designed for wedding photographers, party planners, venues, and recurring hosts.",
    features: [
      "Unlimited concurrent events",
      "Multiple host & coordinator accounts",
      "Direct Google Drive / cloud storage sync",
      "Custom cover branding & white-label view",
      "Priority host concierge support",
      "Export raw metadata & guest stats",
    ],
    cta: "Contact Studio",
    href: "/register",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 sm:py-24 border-t border-warm-300/80 relative overflow-hidden">
      {/* Warm ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-forest-light blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/8 text-forest text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Honest &amp; Transparent</span>
          </div>

          <h2 className="font-handwriting text-4xl sm:text-5xl lg:text-6xl font-bold text-forest tracking-tight leading-tight">
            Simple pricing for{" "}
            <span className="relative inline-block">
              every celebration
              <DoodleUnderline className="absolute -bottom-2 left-0 w-full text-forest/60" />
            </span>
          </h2>

          <p className="text-sm sm:text-base text-ink-secondary font-sans leading-relaxed pt-2">
            No sneaky subscription traps. Create your event for free, or upgrade to a Celebration Pass when you want unlimited photos and high-res archives.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                tier.popular
                  ? "bg-surface border-2 border-forest shadow-[0_12px_35px_rgba(18,60,53,0.12)] lg:-translate-y-2"
                  : "bg-surface/80 border border-warm-300/90 shadow-sm hover:shadow-md hover:bg-surface"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-forest text-surface text-xs font-semibold px-4 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <DoodleStar className="w-3.5 h-3.5 text-mint" />
                  <span>{tier.badge}</span>
                </div>
              )}

              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-2xl font-bold text-ink">
                    {tier.name}
                  </h3>
                </div>

                <p className="mt-2 text-xs sm:text-sm text-ink-secondary leading-relaxed min-h-[40px]">
                  {tier.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 pb-6 border-b border-warm-300/80 flex items-baseline gap-1.5">
                  <span className="font-serif text-4xl sm:text-5xl font-bold text-ink">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-xs sm:text-sm text-ink-secondary font-medium">
                      / {tier.period}
                    </span>
                  )}
                </div>

                {/* Features List */}
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    What&apos;s included
                  </p>
                  <ul className="space-y-2.5">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink">
                        <div className="mt-0.5 rounded-full p-0.5 bg-emerald/10 text-emerald shrink-0">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Link href={tier.href} className="block w-full">
                  <button
                    className={`w-full rounded-2xl py-3.5 px-5 font-medium text-sm transition-all duration-200 ${
                      tier.popular
                        ? "bg-forest hover:bg-forest-hover text-surface shadow-[0_4px_16px_rgba(18,60,53,0.18)]"
                        : "bg-surface border border-warm-400 hover:bg-warm-200 text-ink"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Guarantee / FAQ Note */}
        <div className="mt-12 text-center text-xs text-ink-secondary max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald" />
            No credit card needed to get started
          </span>
          <span className="hidden sm:inline text-warm-400">•</span>
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald" />
            Full money-back satisfaction guarantee
          </span>
        </div>

      </div>
    </section>
  );
}
