import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Sparkles, Heart, Eye, Utensils, Mountain, HeartHandshake, Shuffle } from "lucide-react";

type Step1Props = {
  selected?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack?: () => void;
};

export function Step1({ selected, onSelect, onNext, onBack }: Step1Props) {
  const options = [
    {
      value: "reset",
      label: "Rest and reset",
      sublabel: "I need to decompress, not perform",
      icon: Heart,
    },
    {
      value: "unforgettable",
      label: "See something unforgettable",
      sublabel: "I want a moment I'll talk about for years",
      icon: Eye,
    },
    {
      value: "explore",
      label: "Eat, wander, and soak it in",
      sublabel: "Local food, slow walks, happy surprises",
      icon: Utensils,
    },
    {
      value: "comfortable_adventure",
      label: "Adventure with a soft landing",
      sublabel: "Active days, comfortable nights",
      icon: Mountain,
    },
    {
      value: "romantic",
      label: "Romantic and beautiful",
      sublabel: "Beauty, intimacy, and slow moments",
      icon: HeartHandshake,
    },
    {
      value: "surprise",
      label: "Surprise me",
      sublabel: "I trust the process — just make it good",
      icon: Shuffle,
    },
  ];

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Sparkles className="w-12 h-12 text-amber-500 mx-auto" />}
        title="What kind of escape are you craving?"
        description=""
        // description="There are no wrong answers. Pick what feels true right now."
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
        onNext={onNext}
        onBack={onBack}
        nextDisabled={!selected}
        showBack={true}
      />
    </div>
  );
}
