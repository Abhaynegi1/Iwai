import React from "react";

export function DoodleCamera({ className = "w-10 h-10 text-forest" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Flash rays */}
      <path d="M48 10L52 6M56 14L61 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Top button & flash */}
      <path d="M22 17C22 15 24 13 27 13H37C40 13 42 15 42 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M47 16H49" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Camera Body - slightly organic curved hand-drawn feel */}
      <path
        d="M12 21C9 21.5 7.5 24 7 28C6.5 33 6.8 45 7.2 49C7.6 53 10 55 14 55.2C22 55.5 42 55.3 50 55C54 54.8 56.5 52.5 56.8 48C57.2 43 57.5 32 57 28C56.5 24 54 21.8 50 21.5C44 21.2 18 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lens outer circle */}
      <ellipse
        cx="32"
        cy="38"
        rx="10"
        ry="10.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Lens inner circle */}
      <circle cx="32" cy="38" r="4.5" stroke="currentColor" strokeWidth="2" />
      {/* Small viewfinder */}
      <rect x="14" y="27" width="5" height="4" rx="1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function DoodleArrow({
  direction = "right",
  className = "w-16 h-6 text-forest",
}: {
  direction?: "right" | "top-right" | "bottom-right" | "curved-down" | "curved-up";
  className?: string;
}) {
  if (direction === "top-right") {
    return (
      <svg viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 34C16 28 28 18 42 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M32 6C38 6.5 42.5 7.5 42.5 8C42 12.5 40 18.5 39 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (direction === "curved-down") {
    return (
      <svg viewBox="0 0 70 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 14C24 4 48 8 62 20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M52 20C57 21 62 20.5 62 20C61.5 15.5 59 10 57 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (direction === "curved-up") {
    return (
      <svg viewBox="0 0 70 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 22C24 26 48 22 62 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M52 8C57 7.5 62 9.5 62 10C61 14.5 59 20 57 23" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 60 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 8C20 7.5 38 8 54 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M46 3C49 5.5 53 7.5 55 8C53 8.5 49 10.5 46 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DoodleUnderline({ className = "w-full text-forest" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M3 10C45 4.5 120 3 185 5C230 6.5 270 9 297 8"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoodleHeart({ className = "w-5 h-5 text-forest" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M16 27C14 24 5 17 5 10.5C5 6.5 8 3.5 12 3.5C14.5 3.5 15.5 4.8 16 6C16.5 4.8 17.5 3.5 20 3.5C24 3.5 27 6.5 27 10.5C27 17 18 24 16 27Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleStar({ className = "w-4 h-4 text-forest" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2C12.5 7 14 10 19 12C14 14 12.5 17 12 22C11.5 17 10 14 5 12C10 10 11.5 7 12 2Z" />
    </svg>
  );
}

export function DoodleTape({
  className = "w-16 h-6",
  rotation = -2,
}: {
  className?: string;
  rotation?: number;
}) {
  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`bg-[#E8E4D5]/80 backdrop-blur-[1px] border-y border-[#DDD7C4]/60 shadow-[0_1px_3px_rgba(0,0,0,0.05)] pointer-events-none ${className}`}
    />
  );
}

export function DoodleCalendar({ className = "w-12 h-12 text-forest" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rings */}
      <path d="M14 6V12M34 6V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Outline */}
      <rect x="8" y="10" width="32" height="30" rx="6" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Header bar */}
      <path d="M8 18H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Little Heart in calendar */}
      <path
        d="M24 33C22.5 31 18 27.5 18 24.5C18 22.5 19.5 21 21.5 21C22.8 21 23.6 21.8 24 22.5C24.4 21.8 25.2 21 26.5 21C28.5 21 30 22.5 30 24.5C30 27.5 25.5 31 24 33Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodlePhoneQR({ className = "w-12 h-12 text-forest" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Phone outline */}
      <rect x="14" y="6" width="20" height="36" rx="5" stroke="currentColor" strokeWidth="2.5" />
      <path d="M22 10H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Mini QR inside */}
      <rect x="19" y="18" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <rect x="22" y="21" width="4" height="4" fill="currentColor" />
      <path d="M24 38H24.02" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function DoodlePhotoStack({ className = "w-12 h-12 text-forest" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Back photo tilted */}
      <rect x="16" y="8" width="24" height="28" rx="2" transform="rotate(10 16 8)" stroke="currentColor" strokeWidth="2.2" />
      {/* Front photo */}
      <rect x="8" y="12" width="24" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" fill="#FFFDF8" />
      <rect x="11" y="15" width="18" height="16" stroke="currentColor" strokeWidth="1.8" />
      {/* Little mountain/sun in photo */}
      <circle cx="16" cy="20" r="1.5" fill="currentColor" />
      <path d="M12 28L18 22L24 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sparkles */}
      <path d="M38 14L41 12M42 16L45 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
