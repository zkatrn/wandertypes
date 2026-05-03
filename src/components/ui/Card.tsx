import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
};

export function Card({ children, className = "", onClick, selected }: CardProps) {
  const baseStyles = "rounded-xl shadow-sm p-4 transition-all duration-200 min-h-[60px]";
  const interactiveStyles = onClick ? "cursor-pointer hover:shadow-md hover:scale-[1.02]" : "";
  const selectedStyles = selected 
    ? "bg-primary text-white shadow-md" 
    : "bg-white";

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
