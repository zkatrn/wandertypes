import { ReactNode } from "react";

type SurveyStepHeaderProps = {
  icon: ReactNode;
  title: string;
  description: string;
  showIcon?: boolean;
  /** Stronger contrast on busy photo backgrounds (e.g. home hero). */
  toneOnPhoto?: boolean;
};

export function SurveyStepHeader({
  icon,
  title,
  description,
  showIcon = false,
  toneOnPhoto = false,
}: SurveyStepHeaderProps) {
  return (
    <div className="text-center mb-8">
      {showIcon && <div className="mb-6">{icon}</div>}
      <h2
        className={`mb-3 font-serif text-3xl font-bold ${
          toneOnPhoto
            ? "text-white drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)]"
            : "text-primary"
        }`}
      >
        {title}
      </h2>
      <p
        className={
          toneOnPhoto
            ? "text-[15px] leading-relaxed text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
            : "text-stone-600"
        }
      >
        {description}
      </p>
    </div>
  );
}
