import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Route, ThumbsUp, Check, Meh, X, Waves, Car, Home, MapPin, Compass, Utensils, Smile } from "lucide-react";

type Step6Props = {
  frictionTolerance?: string;
  dealbreakers: string[];
  onUpdateFrictionTolerance: (value: string) => void;
  onUpdateDealbreakers: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step6({
  frictionTolerance,
  dealbreakers,
  onUpdateFrictionTolerance,
  onUpdateDealbreakers,
  onNext,
  onBack,
}: Step6Props) {
  const secondQuestionRef = useRef<HTMLDivElement>(null);
  const showSecondQuestion = !!frictionTolerance;

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
  const frictionOptions = [
    {
      value: "worth_it",
      label: "Worth it if the payoff is real",
      sublabel: "I'll drive an hour for a waterfall",
      icon: ThumbsUp,
    },
    {
      value: "some_is_fine",
      label: "Some friction is fine, not too much",
      sublabel: "One or two longer days is okay",
      icon: Check,
    },
    {
      value: "low_friction",
      label: "I'd rather keep things close and easy",
      sublabel: "The trip should feel relaxed, not logistical",
      icon: Meh,
    },
    {
      value: "avoid",
      label: "Minimize it completely",
      sublabel: "Long drives and hotel changes stress me out",
      icon: X,
    },
  ];

  const dealbreakerOptions = [
    { value: "swimmable_beach", label: "Must have a swimmable beach", icon: Waves },
    { value: "no_long_drives", label: "No long drives from the house to activities", icon: Car },
    { value: "stunning_property", label: "The house or property has to be special", icon: Home },
    { value: "beach_access", label: "Beach should be walkable from where we stay", icon: MapPin },
    { value: "adventure_density", label: "Lots of activities nearby — we want variety", icon: Compass },
    { value: "food_nightlife", label: "Good restaurants or nightlife within reach", icon: Utensils },
    { value: "none", label: "No hard requirements — we're flexible", icon: Smile },
  ];

  const toggleDealbreaker = (value: string) => {
    if (value === "none") {
      if (dealbreakers.includes("none")) {
        onUpdateDealbreakers([]);
      } else {
        onUpdateDealbreakers(["none"]);
      }
    } else {
      const filtered = dealbreakers.filter((d) => d !== "none");
      if (filtered.includes(value)) {
        onUpdateDealbreakers(filtered.filter((d) => d !== value));
      } else {
        onUpdateDealbreakers([...filtered, value]);
      }
    }
  };

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Route className="w-12 h-12 text-red-500 mx-auto" />}
        title="How do you feel about travel friction?"
        description="Some of the best destinations require a little effort to reach. Some people love that — others would rather just arrive."
      />

      <div className="mb-8">
        <div className="grid gap-3">
          {frictionOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = frictionTolerance === option.value;
            return (
              <Card
                key={option.value}
                selected={isSelected}
                onClick={() => onUpdateFrictionTolerance(option.value)}
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
      </div>

      {showSecondQuestion && (
        <div 
          ref={secondQuestionRef}
          className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500"
        >
          <p className="text-stone-900 mb-2 font-semibold text-base">Is there anything on this list that would make or break the trip?</p>
          <p className="text-stone-600 mb-4 text-sm">Select anything that's a hard requirement for at least one person in your group.</p>
          <div className="grid gap-2">
            {dealbreakerOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = dealbreakers.includes(option.value);
              return (
                <Card
                  key={option.value}
                  selected={isSelected}
                  onClick={() => toggleDealbreaker(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-primary'}`} />
                    <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-stone-900'}`}>
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
        nextDisabled={!frictionTolerance}
        nextLabel="Continue"
      />
    </div>
  );
}
