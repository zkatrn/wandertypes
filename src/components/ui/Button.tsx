import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import {
  buttonClassName,
  type ButtonStyleSize,
  type ButtonStyleVariant,
} from "./buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonStyleVariant;
  size?: ButtonStyleSize;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonClassName(variant, size), className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export type { ButtonStyleVariant, ButtonStyleSize };
