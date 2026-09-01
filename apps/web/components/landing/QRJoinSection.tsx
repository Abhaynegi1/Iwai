"use client";

import React from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { DoodleCamera, DoodleArrow } from "../ui/Doodles";

export function QRJoinSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-warm-300/90 bg-surface p-6 sm:p-10 shadow-[0_8px_30px_rgba(18,60,53,0.05)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: QR Code + Curved Arrow */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <DoodleArrow direction="curved-down" className="w-14 h-8 text-forest/70 -rotate-12" />
              </div>
              
              <div className="p-3 bg-warm-50 rounded-2xl border border-warm-300/80 shadow-sm flex items-center justify-center">
                <QRCodeSVG
                  value="https://iwai.app/events/demo"
                  size={92}
                  bgColor="#F7F7F5"
                  fgColor="#123C35"
                  level="M"
                />
              </div>
            </div>

            {/* Center: Copy */}
            <div className="text-center lg:text-left max-w-lg space-y-2">
              <h3 className="font-handwriting text-3xl xs:text-4xl font-bold text-forest leading-tight">
                Guests join in seconds
              </h3>
              <p className="text-xs sm:text-base text-ink-secondary font-sans leading-relaxed">
                Generate a custom QR code for your event. Guests simply scan with their camera to upload photos directly to your drive.
              </p>
            </div>

            {/* Right: CTA Button + Camera Doodle */}
            <div className="flex items-center gap-5 w-full sm:w-auto justify-center">
              <Link href="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto rounded-2xl px-8 py-3.5 bg-forest hover:bg-forest-hover text-surface font-medium text-sm shadow-[0_4px_16px_rgba(18,60,53,0.18)] transition-all text-center">
                  Create Event
                </button>
              </Link>

              <div className="hidden sm:block">
                <DoodleCamera className="w-14 h-14 text-forest -rotate-6" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
