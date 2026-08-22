import { type ClassValue, clsx } from "clsx";

/**
 * Utility for merging Tailwind CSS class names.
 * Usage: cn("text-base", isActive && "text-blue-600", className)
 *
 * Install clsx: pnpm add clsx (already declared if using shadcn/ui)
 * Install tailwind-merge for conflict resolution: pnpm add tailwind-merge
 *
 * When setting up shadcn/ui, update this to:
 *   import { twMerge } from "tailwind-merge";
 *   export function cn(...inputs: ClassValue[]) {
 *     return twMerge(clsx(inputs));
 *   }
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
