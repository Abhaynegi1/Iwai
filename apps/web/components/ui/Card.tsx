import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  variant?: "ivory" | "forest" | "warm";
}

export function Card({
  className,
  children,
  hoverable = false,
  variant = "ivory",
  ...props
}: CardProps) {
  const variantStyles = {
    ivory: "bg-surface border-warm-300 text-ink shadow-[0_2px_8px_rgba(15,23,32,0.04)]",
    forest: "bg-forest border-forest-dark text-surface shadow-[0_4px_16px_rgba(18,60,53,0.15)]",
    warm: "bg-surface-warm border-warm-300 text-ink",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition-all duration-200",
        variantStyles[variant],
        hoverable &&
          variant === "ivory" &&
          "hover:border-warm-400 hover:shadow-[0_6px_20px_rgba(15,23,32,0.07)] hover:-translate-y-0.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
