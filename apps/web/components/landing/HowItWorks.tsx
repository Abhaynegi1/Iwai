import React from "react";
import {
  DoodleCalendar,
  DoodlePhoneQR,
  DoodlePhotoStack,
  DoodleArrow,
} from "../ui/Doodles";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-warm-300/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 sm:mb-16 text-center sm:text-left">
          <h2 className="font-handwriting text-3xl xs:text-4xl sm:text-5xl font-bold text-forest tracking-tight">
            How it works
          </h2>
        </div>

        {/* 3 Step Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 relative">
          
          {/* Step 1 */}
          <div className="flex flex-col items-start text-left relative p-5 sm:p-0 rounded-2xl bg-surface/70 sm:bg-transparent border border-warm-300/70 sm:border-0 shadow-xs sm:shadow-none">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 rounded-full border border-forest/40 flex items-center justify-center font-handwriting text-lg font-bold text-forest bg-surface">
                1
              </div>
              <DoodleCalendar className="w-10 h-10 text-forest" />
            </div>

            <h3 className="font-serif text-lg sm:text-2xl font-bold text-ink mb-1.5 sm:mb-2">
              Create your event
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans max-w-xs">
              Set up your event in seconds and we&apos;ll generate a QR code just for you.
            </p>

            {/* Connecting Arrow (visible on desktop md+) */}
            <div className="hidden md:block absolute -right-6 top-8 z-10 pointer-events-none">
              <DoodleArrow className="w-14 h-6 text-forest/70" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-start text-left relative p-5 sm:p-0 rounded-2xl bg-surface/70 sm:bg-transparent border border-warm-300/70 sm:border-0 shadow-xs sm:shadow-none">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 rounded-full border border-forest/40 flex items-center justify-center font-handwriting text-lg font-bold text-forest bg-surface">
                2
              </div>
              <DoodlePhoneQR className="w-10 h-10 text-forest" />
            </div>

            <h3 className="font-serif text-lg sm:text-2xl font-bold text-ink mb-1.5 sm:mb-2">
              Share the QR
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans max-w-xs">
              Put the QR on tables, flyers or anywhere at your event. Guests scan to join instantly.
            </p>

            {/* Connecting Arrow (visible on desktop md+) */}
            <div className="hidden md:block absolute -right-6 top-8 z-10 pointer-events-none">
              <DoodleArrow className="w-14 h-6 text-forest/70" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-start text-left p-5 sm:p-0 rounded-2xl bg-surface/70 sm:bg-transparent border border-warm-300/70 sm:border-0 shadow-xs sm:shadow-none">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 rounded-full border border-forest/40 flex items-center justify-center font-handwriting text-lg font-bold text-forest bg-surface">
                3
              </div>
              <DoodlePhotoStack className="w-10 h-10 text-forest" />
            </div>

            <h3 className="font-serif text-lg sm:text-2xl font-bold text-ink mb-1.5 sm:mb-2">
              Collect &amp; relive moments
            </h3>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans max-w-xs">
              Everyone adds their photos to one shared album. Relive the event from every perspective.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
