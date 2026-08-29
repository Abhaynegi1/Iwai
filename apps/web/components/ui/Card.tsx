import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({
  className,
  children,
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 text-slate-100 shadow-xl",
        hoverable &&
          "transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-brand-500/5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
