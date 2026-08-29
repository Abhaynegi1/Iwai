import React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-ink-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-xl bg-surface border border-warm-300 px-3.5 py-2.5 text-sm text-ink placeholder-ink-muted transition duration-150 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest disabled:opacity-50 disabled:bg-warm-200",
            error && "border-coral focus:border-coral focus:ring-coral",
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-coral font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-ink-muted">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
