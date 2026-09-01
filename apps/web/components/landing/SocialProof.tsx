import React from "react";
import { DoodleHeart } from "../ui/Doodles";

export function SocialProof() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-warm-300/80 bg-surface px-6 py-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Avatar stack + counter */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5 overflow-hidden">
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-surface bg-[#123C35] text-surface text-xs font-bold flex items-center justify-center">
                M
              </div>
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-surface bg-[#1E7A67] text-surface text-xs font-bold flex items-center justify-center">
                S
              </div>
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-surface bg-[#FFB86C] text-ink text-xs font-bold flex items-center justify-center">
                L
              </div>
              <div className="inline-block h-9 w-9 rounded-full ring-2 ring-surface bg-[#43D399] text-ink text-xs font-bold flex items-center justify-center">
                K
              </div>
            </div>
            <span className="rounded-full bg-warm-200 px-2.5 py-0.5 text-xs font-bold text-ink-secondary">
              +128
            </span>
          </div>

          {/* Social Proof Statement */}
          <div className="text-center sm:text-left">
            <span className="font-handwriting text-xl xs:text-2xl sm:text-3xl font-bold text-forest relative inline-block">
              Loved by 1,200+ hosts and their guests
              {/* Subtle underline */}
              <svg
                className="absolute -bottom-1 left-0 w-full text-forest/40"
                height="6"
                viewBox="0 0 260 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 4C60 2 150 1.5 258 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          {/* Doodle Heart */}
          <div className="text-forest hidden sm:block">
            <DoodleHeart className="w-6 h-6 rotate-12" />
          </div>

        </div>
      </div>
    </section>
  );
}
