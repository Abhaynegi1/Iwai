"use client";

import React, { useState, useRef, useEffect } from "react";
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
  draggable?: boolean;
}

// Global z-index counter so whichever photo is clicked/dragged stays on top
let globalZIndex = 50;

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
  draggable = true,
}: PhotoPrintProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({
    startX: 0,
    startY: 0,
    origX: 0,
    origY: 0,
  });

  const dimensions =
    aspectRatio === "3/4"
      ? { width: 300, height: 400 }
      : aspectRatio === "1/1"
      ? { width: 400, height: 400 }
      : aspectRatio === "16/9"
      ? { width: 480, height: 270 }
      : { width: 400, height: 300 };

  // Detect PC environment (fine pointer like mouse / trackpad, no touch screen conflict)
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(pointer: fine)");
    const checkPC = () => {
      setIsPC(media.matches);
    };
    checkPC();
    media.addEventListener("change", checkPC);
    return () => {
      media.removeEventListener("change", checkPC);
    };
  }, []);

  const canDrag = draggable && isPC;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only allow drag on PC with primary mouse button
    if (!canDrag || e.button !== 0) return;

    // Bring this photo and its parent wrapper above everything else
    globalZIndex += 1;
    if (containerRef.current) {
      containerRef.current.style.zIndex = String(globalZIndex);
      if (containerRef.current.parentElement) {
        containerRef.current.parentElement.style.zIndex = String(globalZIndex);
      }
    }

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
    };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !canDrag) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    setPosition({
      x: dragStartRef.current.origX + deltaX,
      y: dragStartRef.current.origY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
  };

  // Double-click to smoothly snap back to origin
  const handleDoubleClick = () => {
    if (!canDrag) return;
    setPosition({ x: 0, y: 0 });
  };

  const transformStyle = `translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg) ${
    isDragging ? "scale(1.05)" : ""
  }`;

  return (
    <div
      ref={containerRef}
      style={{
        transform: transformStyle,
        transition: isDragging
          ? "none"
          : "transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease",
        touchAction: canDrag ? "none" : "auto",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onDragStart={(e) => e.preventDefault()}
      title={canDrag ? "Click and hold to move • Double-click to reset" : undefined}
      className={`group relative block w-full select-none ${
        canDrag
          ? isDragging
            ? "cursor-grabbing z-50"
            : "cursor-grab hover:rotate-0 hover:scale-[1.02] hover:z-30"
          : "hover:rotate-0 hover:scale-[1.02] hover:z-20"
      } ${className}`}
    >
      {/* Tape decoration */}
      {tape === "top" && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <DoodleTape className="w-16 h-5" rotation={-1.5} />
        </div>
      )}
      {tape === "top-left" && (
        <div className="absolute -top-3 -left-3 z-10 pointer-events-none">
          <DoodleTape className="w-14 h-5" rotation={-35} />
        </div>
      )}
      {tape === "top-right" && (
        <div className="absolute -top-3 -right-3 z-10 pointer-events-none">
          <DoodleTape className="w-14 h-5" rotation={35} />
        </div>
      )}

      {/* Physical Photo Frame with Warm Ivory Paper border */}
      <div
        className={`bg-surface p-2.5 sm:p-3 rounded-md border border-warm-300/80 transition-shadow duration-200 ${
          isDragging
            ? "shadow-[0_25px_50px_-10px_rgba(18,60,53,0.32),0_12px_24px_-8px_rgba(0,0,0,0.18)] border-forest/30 ring-2 ring-forest/10"
            : "shadow-[0_10px_25px_rgba(18,60,53,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
        }`}
      >
        <div className="relative w-full overflow-hidden rounded-[2px] bg-warm-200 pointer-events-none">
          <Image
            src={src}
            alt={alt}
            width={dimensions.width}
            height={dimensions.height}
            sizes="(max-width: 768px) 100vw, 400px"
            priority={priority}
            draggable={false}
            className="w-full h-auto object-cover pointer-events-none transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {/* Subtle warm analog film overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Optional handwritten annotation on the photo frame */}
        {annotation && annotationPosition === "bottom" && (
          <div className="pt-2 pb-0.5 text-center pointer-events-none">
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
