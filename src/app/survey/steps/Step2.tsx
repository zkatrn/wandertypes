import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Clock, Coffee, Sun, Scale, Zap, Calendar } from "lucide-react";

type Step2Props = {
  selected?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step2({ selected, onSelect, onNext, onBack }: Step2Props) {
  const options = [
    {
      value: "slow",
      label: "Slow mornings, loose plans",
      sublabel: "Coffee first. Always.",
      icon: Coffee,
    },
    {
      value: "one_per_day",
      label: "One great thing per day",
      sublabel: "Intentional, not rushed",
      icon: Sun,
    },
    {
      value: "balanced",
      label: "A balanced mix",
      sublabel: "Active some days, lazy others",
      icon: Scale,
    },
    {
      value: "packed",
      label: "Pack it in",
      sublabel: "I'll sleep when I'm home",
      icon: Zap,
    },
    {
      value: "depends",
      label: "Depends on the day",
      sublabel: "I like to decide in the moment",
      icon: Calendar,
    },
  ];

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Clock className="w-12 h-12 text-blue-500 mx-auto" />}
        title="What pace feels right for this trip?"
        description=""
        // description="This helps us avoid giving you a trip that looks great but feels exhausting."
      />

      <div className="grid gap-3 mb-8">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selected === option.value;
          return (
            <Card
              key={option.value}
              selected={isSelected}
              onClick={() => onSelect(option.value)}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                <div className="text-left">
                  <p className={`text-base font-medium ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {option.label}
                  </p>
                  <p className={`text-sm mt-0.5 ${isSelected ? 'text-white/80' : 'text-stone-600'}`}>
                    {option.sublabel}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <SurveyFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!selected}
      />
    </div>
  );
}
