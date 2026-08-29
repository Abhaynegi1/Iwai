import React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "emerald";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl";

    const variantStyles = {
      // Primary: Deep Forest
      primary:
        "bg-forest hover:bg-forest-hover text-surface shadow-sm hover:shadow focus:ring-forest focus:ring-offset-warm-100 active:scale-[0.98]",
      // Emerald
      emerald:
        "bg-emerald hover:bg-emerald-hover text-white shadow-sm hover:shadow focus:ring-emerald focus:ring-offset-warm-100 active:scale-[0.98]",
      // Secondary: Ivory card button
      secondary:
        "bg-surface hover:bg-surface-warm text-ink border border-warm-300 shadow-sm focus:ring-forest focus:ring-offset-warm-100 active:scale-[0.98]",
      outline:
        "border border-warm-300 hover:border-warm-400 bg-transparent text-ink hover:bg-warm-200 focus:ring-forest focus:ring-offset-warm-100",
      ghost:
        "bg-transparent text-ink-secondary hover:text-ink hover:bg-warm-200/80 focus:ring-forest focus:ring-offset-warm-100",
      danger:
        "bg-coral hover:bg-rose-700 text-white shadow-sm focus:ring-coral focus:ring-offset-warm-100 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 rounded-lg",
      md: "text-sm px-4 py-2.5 gap-2 rounded-xl",
      lg: "text-base px-6 py-3 gap-2.5 rounded-xl font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
