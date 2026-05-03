import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
  children: ReactNode;
};

export function Button({
  variant = "primary",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed",
    secondary: "bg-secondary text-mountain-brown hover:bg-secondary-dark disabled:bg-gray-300 disabled:cursor-not-allowed",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
