import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "forest" | "emerald" | "mint" | "apricot" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "brand",
  size = "sm",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    brand: "bg-forest/10 text-forest border-forest/20",
    forest: "bg-forest text-surface border-transparent font-semibold",
    emerald: "bg-emerald/10 text-emerald border-emerald/25",
    mint: "bg-mint/15 text-emerald-hover border-mint/30",
    apricot: "bg-apricot/20 text-[#B86B14] border-apricot/30",
    warning: "bg-apricot/20 text-[#B86B14] border-apricot/30",
    danger: "bg-coral/10 text-coral border-coral/25",
    neutral: "bg-warm-200 text-ink-secondary border-warm-300",
  };

  const sizeStyles = {
    sm: "text-[11px] font-semibold tracking-wide px-2.5 py-0.5",
    md: "text-xs font-semibold tracking-wide px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border select-none",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
