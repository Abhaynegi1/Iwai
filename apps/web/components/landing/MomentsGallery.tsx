import React from "react";
import { PhotoPrint } from "../ui/PhotoPrint";
import { DoodleHeart, DoodleStar } from "../ui/Doodles";

export function MomentsGallery() {
  return (
    <section className="py-16 sm:py-24 border-t border-warm-300/80 overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="mb-10 sm:mb-16 text-center sm:text-left">
          <h2 className="font-handwriting text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold text-forest tracking-tight">
            Real moments. Real people.
          </h2>
        </div>

        {/* Candid Photo Prints Row / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-6 items-center">
          
          {/* Photo 1: Cheers */}
          <div className="col-span-1">
            <PhotoPrint
              src="/scrapbook/cheers.jpg"
              alt="Friends toasting at outdoor celebration"
              rotation={-2}
              aspectRatio="4/3"
            />
          </div>

          {/* Photo 2: Banquet Dinner */}
          <div className="col-span-1">
            <PhotoPrint
              src="/scrapbook/dinner.jpg"
              alt="Dinner gathering under fairy lights"
              rotation={1.8}
              tape="top"
              aspectRatio="4/3"
            />
          </div>

          {/* Photo 3: Smiling Friends */}
          <div className="col-span-1">
            <PhotoPrint
              src="/scrapbook/friends.jpg"
              alt="Three friends laughing together outdoors"
              rotation={-1.5}
              aspectRatio="4/3"
            />
          </div>

          {/* Photo 4: Dancing Party Crowd */}
          <div className="col-span-1">
            <PhotoPrint
              src="/scrapbook/party.jpg"
              alt="Party crowd with hands in the air"
              rotation={2.5}
              aspectRatio="4/3"
            />
          </div>

          {/* Photo 5: Sparkler Night */}
          <div className="col-span-2 sm:col-span-1">
            <PhotoPrint
              src="/scrapbook/sparkler.jpg"
              alt="Golden sparkler celebration"
              rotation={-2}
              tape="top"
              aspectRatio="4/3"
            />
          </div>

        </div>

        {/* Bottom Annotation */}
        <div className="mt-10 sm:mt-14 flex items-center justify-center sm:justify-end gap-3 text-forest pr-0 sm:pr-6">
          <span className="font-handwriting text-xl sm:text-2xl sm:text-3xl font-bold text-forest tracking-tight">
            candid. unfiltered. beautiful.
          </span>
          <div className="flex items-center gap-1 text-forest">
            <DoodleStar className="w-4 h-4 text-emerald" />
            <DoodleHeart className="w-5 h-5 -rotate-6" />
          </div>
        </div>

      </div>
    </section>
  );
}
