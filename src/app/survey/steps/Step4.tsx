import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Users, User, Heart, UsersRound, Home, CheckCircle, Circle, AlertCircle, XCircle } from "lucide-react";

type Step4Props = {
  groupType?: string;
  groupAlignment?: string;
  onUpdateGroupType: (value: string) => void;
  onUpdateGroupAlignment: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step4({
  groupType,
  groupAlignment,
  onUpdateGroupType,
  onUpdateGroupAlignment,
  onNext,
  onBack,
}: Step4Props) {
  const secondQuestionRef = useRef<HTMLDivElement>(null);
  const showSecondQuestion = !!groupType;

  useEffect(() => {
    if (showSecondQuestion && secondQuestionRef.current) {
      setTimeout(() => {
        secondQuestionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
    }
  }, [showSecondQuestion]);
  const groupOptions = [
    { value: "solo", label: "Just me", icon: User },
    { value: "couple", label: "Couple", icon: Heart },
    { value: "friends", label: "Friends", icon: UsersRound },
    { value: "family", label: "Family", icon: Home },
    { value: "mixed", label: "Mixed group", icon: Users },
  ];

  const alignmentOptions = [
    {
      value: "same_page",
      label: "We're all on the same page",
      icon: CheckCircle,
    },
    {
      value: "mostly_aligned",
      label: "Mostly aligned, small differences",
      icon: Circle,
    },
    {
      value: "different_priorities",
      label: "A few people want different things",
      icon: AlertCircle,
    },
    {
      value: "chaos",
      label: "Total chaos — please help us",
      icon: XCircle,
    },
  ];

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Users className="w-12 h-12 text-purple-500 mx-auto" />}
        title="Who are we planning around?"
        description="Be honest — this is how we catch problems before they happen."
      />

      <div className="mb-8">
        <p className="text-stone-600 mb-4 font-medium">Who is coming?</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {groupOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = groupType === option.value;
            return (
              <Card
                key={option.value}
                selected={isSelected}
                onClick={() => onUpdateGroupType(option.value)}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-primary'}`} />
                  <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {option.label}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {showSecondQuestion && (
        <div 
          ref={secondQuestionRef}
          className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <p className="text-stone-600 mb-4 font-medium">How aligned is everyone?</p>
          <div className="grid gap-3">
            {alignmentOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = groupAlignment === option.value;
              return (
                <Card
                  key={option.value}
                  selected={isSelected}
                  onClick={() => onUpdateGroupAlignment(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    <p className={`text-base font-medium ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {option.label}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <SurveyFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!groupType || !groupAlignment}
        nextLabel="Continue"
      />
    </div>
  );
}
