import { cn } from "@/lib/cn";

/** Shared action styles — use `Button` for `<button>`, this for `<Link>` / raw elements. */
export type ButtonStyleVariant =
  | "primary"
  | "outline"
  | "outlineDark"
  | "outlineNavy"
  | "ctaWarm"
  | "ghost";

export type ButtonStyleSize = "sm" | "md" | "lg";

const sizeClasses: Record<ButtonStyleSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg min-h-[2.5rem]",
  md: "px-6 py-3 text-base rounded-lg min-h-[2.75rem]",
  lg: "px-10 py-3 text-base rounded-lg min-h-[3rem]",
};

const variantClasses: Record<ButtonStyleVariant, string> = {
  primary:
    "border-2 border-transparent bg-primary text-white shadow-sm hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  outline:
    "border-2 border-primary/40 bg-white/90 text-primary backdrop-blur-sm hover:border-primary hover:bg-primary/5",
  outlineDark:
    "border-2 border-white/30 bg-transparent text-stone-100 hover:border-white/45 hover:bg-white/10",
  outlineNavy:
    "border-2 border-primary-light/50 bg-primary/10 text-stone-100 hover:border-primary-light/70 hover:bg-primary/20",
  ctaWarm:
    "border-2 border-transparent bg-gradient-to-br from-amber-300 via-amber-200 to-orange-300 text-stone-900 shadow-[0_6px_24px_rgba(255,179,71,0.38)] hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400",
  ghost:
    "border-2 border-transparent text-primary hover:bg-primary/8",
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed";

export function buttonClassName(
  variant: ButtonStyleVariant = "primary",
  size: ButtonStyleSize = "md",
  className?: string,
) {
  return cn(base, sizeClasses[size], variantClasses[variant], className);
}
