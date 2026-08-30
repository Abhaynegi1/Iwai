import React from "react";
import { PhotoPrint } from "./PhotoPrint";
import {
  DoodleCamera,
  DoodleArrow,
  DoodleHeart,
  DoodleStar,
} from "./Doodles";

export function HeroScrapbook() {
  return (
    <div className="relative w-full max-w-[580px] mx-auto min-h-[540px] sm:min-h-[600px] select-none">
      
      {/* ── Top Arrow & Annotation: "real moments" ── */}
      <div className="absolute top-2 left-12 sm:left-24 z-20 flex items-center gap-1.5 pointer-events-none">
        <span className="font-handwriting text-xl sm:text-2xl font-bold text-forest -rotate-6">
          real moments
        </span>
        <DoodleArrow direction="curved-down" className="w-12 h-6 text-forest rotate-12" />
      </div>

      {/* ── Photo 1: Top-Left Dinner Table ── */}
      <div className="absolute top-10 left-0 w-[54%] sm:w-[52%] z-10">
        <PhotoPrint
          src="/scrapbook/dinner.jpg"
          alt="Friends having outdoor dinner under fairy lights"
          rotation={-2.5}
          tape="top"
          priority
        />
      </div>

      {/* ── Photo 2: Top-Right Sunset Silhouettes ── */}
      <div className="absolute top-6 right-2 w-[44%] sm:w-[42%] z-10">
        <PhotoPrint
          src="/scrapbook/sunset.jpg"
          alt="Sunset beach silhouettes"
          rotation={3.5}
          priority
        />
      </div>

      {/* ── Photo 3: Center-Right Laughing Friends ── */}
      <div className="absolute top-[175px] sm:top-[190px] right-6 w-[40%] sm:w-[38%] z-15">
        <PhotoPrint
          src="/scrapbook/friends.jpg"
          alt="Three friends laughing together outdoors"
          rotation={-1.5}
          aspectRatio="3/4"
          priority
        />
      </div>

      {/* ── Photo 4: Center-Left Sparkler Night ── */}
      <div className="absolute top-[200px] sm:top-[220px] left-6 w-[42%] sm:w-[40%] z-20">
        <PhotoPrint
          src="/scrapbook/sparkler.jpg"
          alt="Girl holding a sparkler at night celebration"
          rotation={2}
          aspectRatio="4/3"
          priority
        />
      </div>

      {/* ── Photo 5: Bottom-Right Scenic View ── */}
      <div className="absolute top-[320px] sm:top-[350px] right-2 w-[46%] sm:w-[44%] z-10">
        <PhotoPrint
          src="/scrapbook/scenic.jpg"
          alt="Scenic mountain valley lake"
          rotation={-3}
          tape="top"
        />
      </div>

      {/* ── Bottom-Left Doodled Details & Arrow: "taken by everyone" ── */}
      <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-14 z-30 flex items-center gap-2 pointer-events-none">
        <span className="font-handwriting text-xl sm:text-2xl font-bold text-forest -rotate-3">
          taken by everyone
        </span>
        <DoodleArrow direction="curved-up" className="w-14 h-7 text-forest -rotate-6" />
      </div>

      {/* ── Bottom-Right Camera Doodle ── */}
      <div className="absolute -bottom-2 -right-1 sm:right-2 z-20 pointer-events-none">
        <DoodleCamera className="w-14 h-14 text-forest drop-shadow-sm rotate-6" />
      </div>

      {/* ── Floating Heart and Star Accents ── */}
      <div className="absolute top-28 right-0 text-forest/70 pointer-events-none">
        <DoodleHeart className="w-5 h-5 -rotate-12 text-forest/70" />
      </div>
      <div className="absolute top-[160px] left-1/2 -translate-x-1/2 text-forest/50 pointer-events-none">
        <DoodleStar className="w-4 h-4 text-emerald/60 rotate-45" />
      </div>
      <div className="absolute bottom-16 right-[48%] text-forest/60 pointer-events-none">
        <DoodleStar className="w-3.5 h-3.5 text-forest/40" />
      </div>

    </div>
  );
}
