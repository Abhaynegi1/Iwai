import React from "react";
import Link from "next/link";
import { DoodleUnderline, DoodleHeart, DoodleCamera } from "../ui/Doodles";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 border-t border-warm-300/80 relative overflow-hidden">
      {/* Warm ambient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[750px] rounded-full bg-forest-light blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Camera Doodle on top */}
        <div className="flex justify-center">
          <DoodleCamera className="w-12 h-12 text-forest/70" />
        </div>

        {/* Emotional Heading */}
        <div className="space-y-2">
          <h2 className="font-handwriting text-5xl sm:text-6xl lg:text-7xl font-bold text-forest leading-[1.05] tracking-tight">
            Make memories worth{" "}
            <span className="relative inline-block">
              coming back to.
              <DoodleUnderline className="absolute -bottom-2 sm:-bottom-3 left-0 w-full text-forest/60" />
            </span>
          </h2>
        </div>

        {/* Subtext */}
        <p className="text-base sm:text-lg text-ink-secondary font-sans max-w-lg mx-auto leading-relaxed">
          Create an event in seconds and let everyone at the party bring their perspective into one shared memory.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/register">
            <button className="rounded-2xl px-8 py-3.5 bg-forest hover:bg-forest-hover text-surface font-medium text-sm shadow-[0_4px_16px_rgba(18,60,53,0.18)] transition-all">
              Create Event
            </button>
          </Link>
          <Link href="/login">
            <button className="rounded-2xl px-8 py-3.5 bg-surface/90 border border-warm-400/90 hover:bg-warm-200 text-ink font-medium text-sm transition-all">
              Join Event
            </button>
          </Link>
        </div>

        {/* Subtle Heart */}
        <div className="pt-2 flex justify-center text-forest/50">
          <DoodleHeart className="w-6 h-6 rotate-6" />
        </div>

      </div>
    </section>
  );
}
