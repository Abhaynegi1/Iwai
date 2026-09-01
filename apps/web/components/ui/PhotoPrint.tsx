"use client";

import React, { useState, useRef, useCallback } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  positionRef.current = position;
  isDraggingRef.current = isDragging;

  const dimensions =
    aspectRatio === "3/4"
      ? { width: 300, height: 400 }
      : aspectRatio === "1/1"
      ? { width: 400, height: 400 }
      : aspectRatio === "16/9"
      ? { width: 480, height: 270 }
      : { width: 400, height: 300 };

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!draggable) return;

      // Bring this photo and its parent wrapper above everything else
      globalZIndex += 1;
      if (containerRef.current) {
        containerRef.current.style.zIndex = String(globalZIndex);
        if (containerRef.current.parentElement) {
          containerRef.current.parentElement.style.zIndex = String(globalZIndex);
        }
      }

      setIsDragging(true);
      const startX = clientX;
      const startY = clientY;
      const originX = positionRef.current.x;
      const originY = positionRef.current.y;

      const onMove = (moveEvent: MouseEvent | PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        setPosition({
          x: originX + deltaX,
          y: originY + deltaY,
        });
      };

      const onEnd = () => {
        setIsDragging(false);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onEnd);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseup", onEnd);
    },
    [draggable],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary left mouse button
    if (e.button !== 0) return;
    // On small mobile touch devices, don't drag so normal touch scroll works
    if (typeof window !== "undefined" && window.innerWidth < 640 && e.pointerType === "touch") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (typeof window !== "undefined" && window.innerWidth < 640) return;
    if (isDraggingRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  // Double-click to smoothly snap back to origin
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        touchAction: draggable ? "none" : "auto",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onDragStart={(e) => e.preventDefault()}
      title="Click and hold to move • Double-click to reset"
      className={`group relative block w-full select-none ${
        isDragging
          ? "cursor-grabbing z-50"
          : "cursor-grab hover:rotate-0 hover:scale-[1.02] hover:z-30"
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
        className={`bg-surface p-2.5 sm:p-3 rounded-md border border-warm-300/80 transition-shadow duration-200 pointer-events-auto ${
          isDragging
            ? "shadow-[0_25px_50px_-10px_rgba(18,60,53,0.32),0_12px_24px_-8px_rgba(0,0,0,0.18)] border-forest/30 ring-2 ring-forest/10"
            : "shadow-[0_10px_25px_rgba(18,60,53,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
        }`}
      >
        <div className="relative w-full overflow-hidden rounded-[2px] bg-warm-200 pointer-events-none select-none">
          <Image
            src={src}
            alt={alt}
            width={dimensions.width}
            height={dimensions.height}
            sizes="(max-width: 768px) 100vw, 400px"
            priority={priority}
            draggable={false}
            className="w-full h-auto object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-[1.02]"
          />
          {/* Subtle warm analog film overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Optional handwritten annotation on the photo frame */}
        {annotation && annotationPosition === "bottom" && (
          <div className="pt-2 pb-0.5 text-center pointer-events-none select-none">
            <span className="font-handwriting text-base sm:text-lg font-bold text-forest block leading-none">
              {annotation}
            </span>
          </div>
        )}
      </div>

      {/* Optional annotation floating outside */}
      {annotation && annotationPosition !== "bottom" && (
        <div
          className={`absolute pointer-events-none select-none ${
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
