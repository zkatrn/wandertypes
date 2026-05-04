import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Palmtree, Trees, Mountain, Building2, Landmark, BedDouble, MapPin } from "lucide-react";

type Step3Props = {
  selected?: string;
  onSelect: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step3({ selected, onSelect, onNext, onBack }: Step3Props) {
  const options = [
    {
      value: "ocean",
      label: "Ocean air and soft sand",
      sublabel: "Swimmable water, warm breeze, total ease",
      icon: Palmtree,
    },
    {
      value: "rainforest",
      label: "Rainforest and waterfalls",
      sublabel: "Wildlife, green everywhere, alive",
      icon: Trees,
    },
    {
      value: "mountains",
      label: "Mountains and wide-open views",
      sublabel: "Big sky, clean air, a sense of scale",
      icon: Mountain,
    },
    {
      value: "culture",
      label: "Colorful streets, local food, culture",
      sublabel: "Wandering markets, history, flavor",
      icon: Landmark,
    },
    {
      value: "city_energy",
      label: "City energy — nightlife, shopping, buzz",
      sublabel: "Restaurants, rooftops, things happening",
      icon: Building2,
    },
    {
      value: "boutique",
      label: "A beautiful property with a great pool",
      sublabel: "The house IS the vacation",
      icon: BedDouble,
    },
    {
      value: "remote",
      label: "Somewhere that feels untouched",
      sublabel: "Off the beaten path, no crowds",
      icon: MapPin,
    },
  ];

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Palmtree className="w-12 h-12 text-green-500 mx-auto" />}
        title="Close your eyes. Where do you end up?"
        description=""
        // description="Pick the setting that makes you exhale."
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
