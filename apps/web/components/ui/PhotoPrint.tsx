import React from "react";
import Image from "next/image";
import { DoodleTape } from "./Doodles";

export interface PhotoPrintProps {
  src: string;
  alt: string;
  rotation?: number;
  annotation?: string;
  annotationPosition?: "bottom" | "top" | "bottom-right" | "bottom-left";
  tape?: "top" | "top-left" | "top-right" | "none";
  aspectRatio?: "4/3" | "3/4" | "1/1" | "16/9";
  className?: string;
  priority?: boolean;
}

export function PhotoPrint({
  src,
  alt,
  rotation = 0,
  annotation,
  annotationPosition = "bottom",
  tape = "none",
  aspectRatio = "4/3",
  className = "",
  priority = false,
}: PhotoPrintProps) {
  const dimensions =
    aspectRatio === "3/4"
      ? { width: 300, height: 400 }
      : aspectRatio === "1/1"
      ? { width: 400, height: 400 }
      : aspectRatio === "16/9"
      ? { width: 480, height: 270 }
      : { width: 400, height: 300 };

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`group relative block w-full transition-transform duration-300 hover:rotate-0 hover:scale-[1.02] hover:z-20 ${className}`}
    >
      {/* Tape decoration */}
      {tape === "top" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <DoodleTape className="w-16 h-5" rotation={-1.5} />
        </div>
      )}
      {tape === "top-left" && (
        <div className="absolute -top-3 -left-3 z-10">
          <DoodleTape className="w-14 h-5" rotation={-35} />
        </div>
      )}
      {tape === "top-right" && (
        <div className="absolute -top-3 -right-3 z-10">
          <DoodleTape className="w-14 h-5" rotation={35} />
        </div>
      )}

      {/* Physical Photo Frame with Warm Ivory Paper border */}
      <div className="bg-surface p-2.5 sm:p-3 rounded-md border border-warm-300/80 shadow-[0_10px_25px_rgba(18,60,53,0.08),0_2px_6px_rgba(0,0,0,0.04)]">
        <div className="relative w-full overflow-hidden rounded-[2px] bg-warm-200">
          <Image
            src={src}
            alt={alt}
            width={dimensions.width}
            height={dimensions.height}
            sizes="(max-width: 768px) 100vw, 400px"
            priority={priority}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          {/* Subtle warm analog film overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Optional handwritten annotation on the photo frame */}
        {annotation && annotationPosition === "bottom" && (
          <div className="pt-2 pb-0.5 text-center">
            <span className="font-handwriting text-base sm:text-lg font-bold text-forest block leading-none">
              {annotation}
            </span>
          </div>
        )}
      </div>

      {/* Optional annotation floating outside */}
      {annotation && annotationPosition !== "bottom" && (
        <div
          className={`absolute pointer-events-none ${
            annotationPosition === "bottom-right"
              ? "-bottom-5 -right-6"
              : annotationPosition === "bottom-left"
              ? "-bottom-5 -left-6"
              : "-top-6 left-2"
          }`}
        >
          <span className="font-handwriting text-lg font-bold text-forest whitespace-nowrap drop-shadow-sm">
            {annotation}
          </span>
        </div>
      )}
    </div>
  );
}
