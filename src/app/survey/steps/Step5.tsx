import { Card } from "@/components/ui/Card";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { Compass, Waves, Droplets, Squirrel, Footprints, UtensilsCrossed, Coffee, Flame, Fish, Music, Building, ShoppingBag, Sparkles, Car, Ship, Wind, Search } from "lucide-react";

type Step5Props = {
  selected: string[];
  onSelect: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step5({ selected, onSelect, onNext, onBack }: Step5Props) {
  const activities = [
    { name: "Swimmable beach", value: "beach_swim", icon: Waves },
    { name: "Waterfalls", value: "waterfalls", icon: Droplets },
    { name: "Wildlife spotting", value: "wildlife", icon: Squirrel },
    { name: "Hiking", value: "hiking", icon: Footprints },
    { name: "Food tours", value: "food_tours", icon: UtensilsCrossed },
    { name: "Coffee or cacao tours", value: "coffee_tours", icon: Coffee },
    { name: "Hot springs", value: "hot_springs", icon: Flame },
    { name: "Snorkeling or diving", value: "snorkeling", icon: Fish },
    { name: "Nightlife", value: "nightlife", icon: Music },
    { name: "Museums and culture", value: "culture", icon: Building },
    { name: "Shopping", value: "shopping", icon: ShoppingBag },
    { name: "Spa or pool days", value: "spa_pool", icon: Sparkles },
    { name: "Scenic drives", value: "scenic_drives", icon: Car },
    { name: "Boat day", value: "boat_day", icon: Ship },
    { name: "Ziplining or rappelling", value: "zipline", icon: Wind },
    { name: "Hidden gems", value: "hidden_gems", icon: Search },
  ];

  const toggleActivity = (activityValue: string) => {
    if (selected.includes(activityValue)) {
      onSelect(selected.filter((a) => a !== activityValue));
    } else {
      onSelect([...selected, activityValue]);
    }
  };

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<Compass className="w-12 h-12 text-orange-500 mx-auto" />}
        title="What else makes the trip complete?"
        description="Pick as many as apply. More is fine — we'll find what fits."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {activities.map((activity) => {
          const Icon = activity.icon;
          const isSelected = selected.includes(activity.value);
          return (
            <Card
              key={activity.value}
              selected={isSelected}
              onClick={() => toggleActivity(activity.value)}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-primary'}`} />
                <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                  {activity.name}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <SurveyFooter
        onBack={onBack}
        onNext={onNext}
        nextDisabled={selected.length === 0}
      />
    </div>
  );
}
