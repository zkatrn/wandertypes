import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Wallet, DollarSign, CircleDollarSign, Gem, Crown, Heart } from "lucide-react";

type Step7Props = {
  selected?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step7({ selected, onSelect, onNext, onBack }: Step7Props) {
  const options = [
    {
      value: "budget_conscious",
      label: "Budget-conscious but still beautiful",
      sublabel: "Value matters — but I still want it to feel good",
      icon: DollarSign,
    },
    {
      value: "comfortable_mid",
      label: "Comfortable mid-range",
      sublabel: "Not counting every dollar, not being reckless",
      icon: CircleDollarSign,
    },
    {
      value: "splurge_few",
      label: "Splurge on a few special things",
      sublabel: "Smart most of the time, generous when it counts",
      icon: Gem,
    },
    {
      value: "luxe",
      label: "Luxe, but not wasteful",
      sublabel: "Quality over quantity — fewer, better experiences",
      icon: Crown,
    },
    {
      value: "fit_over_budget",
      label: "Fit matters more than cost right now",
      sublabel: "Just find us the right trip — we'll make it work",
      icon: Heart,
    },
  ];

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Wallet className="w-12 h-12 text-emerald-500 mx-auto" />}
        title="How does money factor into this decision?"
        description=""
        // description="Pick what feels true — not what sounds responsible."
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
