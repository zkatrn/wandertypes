import { ReactNode } from "react";

type SurveyStepHeaderProps = {
  icon: ReactNode;
  title: string;
  description: string;
  showIcon?: boolean;
};

export function SurveyStepHeader({ icon, title, description, showIcon = false }: SurveyStepHeaderProps) {
  return (
    <div className="text-center mb-8">
      {showIcon && <div className="mb-6">{icon}</div>} 
      <h2 className="text-3xl font-serif font-bold text-primary mb-3">{title}</h2>
      <p className="text-stone-600">{description}</p>
    </div>
  );
}
