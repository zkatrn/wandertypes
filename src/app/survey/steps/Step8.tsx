"use client";

import { useRouter } from "next/navigation";
import { SurveyStepHeader } from "@/components/SurveyStepHeader";
import { SurveyFooter } from "@/components/SurveyFooter";
import { MessageSquare, Heart, Eye, Utensils, Mountain, HeartHandshake, Shuffle, Coffee, Sun, Scale, Zap, Calendar, Waves, Trees, Landmark, Building2, BedDouble, MapPin, Palmtree, User, UsersRound, Home, Users, CheckCircle, Circle, AlertCircle, XCircle, Compass, Wind, Search, Droplets, Squirrel, Footprints, UtensilsCrossed, Flame, Fish, Music, Building, ShoppingBag, Sparkles, Car, Ship, ThumbsUp, Check, Meh, X, Route, DollarSign, CircleDollarSign, Gem, Crown, Edit2 } from "lucide-react";
import type { SurveyAnswers } from "@/types/survey";

type Step8Props = {
  value: string;
  onChange: (value: string) => void;
  answers: SurveyAnswers;
  onNext: () => void;
  onBack: () => void;
  onNavigateToStep?: (step: number) => void;
};

// Define all the options with their icons and labels
const tripMoodOptions = [
  { value: "reset", label: "Rest and reset", icon: Heart },
  { value: "unforgettable", label: "See something unforgettable", icon: Eye },
  { value: "explore", label: "Eat, wander, and soak it in", icon: Utensils },
  { value: "comfortable_adventure", label: "Adventure with a soft landing", icon: Mountain },
  { value: "romantic", label: "Romantic and beautiful", icon: HeartHandshake },
  { value: "surprise", label: "Surprise me", icon: Shuffle },
];

const paceOptions = [
  { value: "slow", label: "Slow mornings, loose plans", icon: Coffee },
  { value: "one_per_day", label: "One great thing per day", icon: Sun },
  { value: "balanced", label: "A balanced mix", icon: Scale },
  { value: "packed", label: "Pack it in", icon: Zap },
  { value: "depends", label: "Depends on the day", icon: Calendar },
];

const environmentOptions = [
  { value: "ocean", label: "Ocean air and soft sand", icon: Palmtree },
  { value: "rainforest", label: "Rainforest and waterfalls", icon: Trees },
  { value: "mountains", label: "Mountains and wide-open views", icon: Mountain },
  { value: "culture", label: "Colorful streets, local food, culture", icon: Landmark },
  { value: "city_energy", label: "City energy — nightlife, shopping, buzz", icon: Building2 },
  { value: "boutique", label: "A beautiful property with a great pool", icon: BedDouble },
  { value: "remote", label: "Somewhere that feels untouched", icon: MapPin },
];

const groupTypeOptions = [
  { value: "solo", label: "Just me", icon: User },
  { value: "couple", label: "Couple", icon: Heart },
  { value: "friends", label: "Friends", icon: UsersRound },
  { value: "family", label: "Family", icon: Home },
  { value: "mixed", label: "Mixed group", icon: Users },
];

const groupAlignmentOptions = [
  { value: "same_page", label: "We're all on the same page", icon: CheckCircle },
  { value: "mostly_aligned", label: "Mostly aligned, small differences", icon: Circle },
  { value: "different_priorities", label: "A few people want different things", icon: AlertCircle },
  { value: "chaos", label: "Total chaos — please help us", icon: XCircle },
];

const activityOptions = [
  { value: "beach_swim", label: "Swimmable beach", icon: Waves },
  { value: "waterfalls", label: "Waterfalls", icon: Droplets },
  { value: "wildlife", label: "Wildlife spotting", icon: Squirrel },
  { value: "hiking", label: "Hiking", icon: Footprints },
  { value: "food_tours", label: "Food tours", icon: UtensilsCrossed },
  { value: "coffee_tours", label: "Coffee or cacao tours", icon: Coffee },
  { value: "hot_springs", label: "Hot springs", icon: Flame },
  { value: "snorkeling", label: "Snorkeling or diving", icon: Fish },
  { value: "nightlife", label: "Nightlife", icon: Music },
  { value: "culture", label: "Museums and culture", icon: Building },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "spa_pool", label: "Spa or pool days", icon: Sparkles },
  { value: "scenic_drives", label: "Scenic drives", icon: Car },
  { value: "boat_day", label: "Boat day", icon: Ship },
  { value: "zipline", label: "Ziplining or rappelling", icon: Wind },
  { value: "hidden_gems", label: "Hidden gems", icon: Search },
];

const frictionToleranceOptions = [
  { value: "worth_it", label: "Worth it if the payoff is real", icon: ThumbsUp },
  { value: "some_is_fine", label: "Some friction is fine, not too much", icon: Check },
  { value: "low_friction", label: "I'd rather keep things close and easy", icon: Meh },
  { value: "avoid", label: "Minimize it completely", icon: X },
];

const budgetFeelOptions = [
  { value: "budget_conscious", label: "Budget-conscious but still beautiful", icon: DollarSign },
  { value: "comfortable_mid", label: "Comfortable mid-range", icon: CircleDollarSign },
  { value: "splurge_few", label: "Splurge on a few special things", icon: Gem },
  { value: "luxe", label: "Luxe, but not wasteful", icon: Crown },
  { value: "fit_over_budget", label: "Fit matters more than cost right now", icon: Heart },
];

export function Step8({ value, onChange, answers, onNext, onBack, onNavigateToStep }: Step8Props) {
  const router = useRouter();

  // Debug: log what we're receiving
  console.log('Step 8 answers:', answers);
  console.log('destinations:', answers.destinations);
  console.log('destinationList:', answers.destinationList);
  console.log('chooseForMe:', answers.chooseForMe);

  const handleCardClick = (step: number) => {
    if (step === 0) {
      // Step 0 is the landing page
      router.push("/");
    } else if (onNavigateToStep) {
      onNavigateToStep(step);
    }
  };

  // Generate dynamic title based on destinations
  const getTitle = () => {
    // Check both new and legacy destination fields
    const destinations = answers.destinations || answers.destinationList;
    
    console.log(`%c destinations`, 'color: #FF10F0;', destinations)
    if (answers.chooseForMe || !destinations || destinations.length === 0) {
      return "Here's what you told us.";
    }

    if (destinations.length === 1) {
      return `Here's what you told us about ${destinations[0]}.`;
    } else if (destinations.length === 2) {
      return `Here's what you told us about ${destinations[0]} and ${destinations[1]}.`;
    } else {
      // 3 or more destinations
      return `Here's what you told us about ${destinations[0]}, ${destinations[1]}, and ${destinations.length - 2} other ${destinations.length - 2 === 1 ? 'place' : 'places'}.`;
    }
  };

  return (
    <div className="text-center">
      <SurveyStepHeader
        icon={<MessageSquare className="w-12 h-12 text-indigo-500 mx-auto" />}
        title={getTitle()}
        description="Add anything we missed and we'll take care of the rest."
      />

      {/* Answer Summary Cards */}
      <div className="mb-8">
        <p className="text-stone-500 text-xs uppercase tracking-wide mb-4 text-left">Your answers</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {/* Step 0: Destinations */}
          {((answers.destinations && answers.destinations.length > 0) || (answers.destinationList && answers.destinationList.length > 0) || answers.chooseForMe) && (
            <AnswerCard
              stepLabel="Destinations"
              icon={answers.chooseForMe ? Shuffle : MapPin}
              label={
                answers.chooseForMe
                  ? "Surprise me"
                  : (() => {
                      const dests = answers.destinations || answers.destinationList;
                      return dests && dests.length > 0
                        ? dests.slice(0, 3).join(", ") + (dests.length > 3 ? ` +${dests.length - 3} more` : "")
                        : "";
                    })()
              }
              onClick={() => handleCardClick(0)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 1: Trip Mood */}
          {answers.tripMood && (
            <AnswerCard
              stepLabel="Trip Mood"
              icon={tripMoodOptions.find((o) => o.value === answers.tripMood)?.icon || Heart}
              label={tripMoodOptions.find((o) => o.value === answers.tripMood)?.label || ""}
              onClick={() => handleCardClick(1)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 2: Pace */}
          {answers.pace && (
            <AnswerCard
              stepLabel="Pace"
              icon={paceOptions.find((o) => o.value === answers.pace)?.icon || Coffee}
              label={paceOptions.find((o) => o.value === answers.pace)?.label || ""}
              onClick={() => handleCardClick(2)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 3: Environment */}
          {answers.environment && (
            <AnswerCard
              stepLabel="Environment"
              icon={environmentOptions.find((o) => o.value === answers.environment)?.icon || Waves}
              label={environmentOptions.find((o) => o.value === answers.environment)?.label || ""}
              onClick={() => handleCardClick(3)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 4: Group (Combined) */}
          {(answers.groupType || answers.groupAlignment) && (
            <AnswerCard
              stepLabel="Group"
              isDouble
              icon1={groupTypeOptions.find((o) => o.value === answers.groupType)?.icon}
              label1={groupTypeOptions.find((o) => o.value === answers.groupType)?.label}
              icon2={groupAlignmentOptions.find((o) => o.value === answers.groupAlignment)?.icon}
              label2={groupAlignmentOptions.find((o) => o.value === answers.groupAlignment)?.label}
              onClick={() => handleCardClick(4)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 5: Activities */}
          {answers.activities && answers.activities.length > 0 && (
            <AnswerCard
              stepLabel="Activities"
              isMulti
              items={answers.activities.slice(0, 3).map((actVal) => {
                const activity = activityOptions.find((o) => o.value === actVal);
                return {
                  icon: activity?.icon || Compass,
                  label: activity?.label || actVal,
                };
              })}
              extraCount={answers.activities.length > 3 ? answers.activities.length - 3 : 0}
              onClick={() => handleCardClick(5)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 6: Friction Tolerance */}
          {answers.frictionTolerance && (
            <AnswerCard
              stepLabel="Travel Friction"
              icon={frictionToleranceOptions.find((o) => o.value === answers.frictionTolerance)?.icon || Route}
              label={frictionToleranceOptions.find((o) => o.value === answers.frictionTolerance)?.label || ""}
              onClick={() => handleCardClick(6)}
              isClickable={!!onNavigateToStep}
            />
          )}

          {/* Step 7: Budget */}
          {answers.budgetFeel && (
            <AnswerCard
              stepLabel="Budget"
              icon={budgetFeelOptions.find((o) => o.value === answers.budgetFeel)?.icon || DollarSign}
              label={budgetFeelOptions.find((o) => o.value === answers.budgetFeel)?.label || ""}
              onClick={() => handleCardClick(7)}
              isClickable={!!onNavigateToStep}
            />
          )}
        </div>
      </div>

      {/* Open Text Field */}
      <div className="mb-8">
        <p className="text-stone-500 text-xs uppercase tracking-wide mb-4 text-left">Anything to add?</p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Example: I want to see the Colosseum and the Amalfi Coast during this trip. "
          className="w-full h-40 p-4 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-blue-300 resize-none bg-white text-stone-900 placeholder:text-stone-400"
        />
      </div>

      <p className="text-stone-500 text-xs mb-8">
        We'll use everything you told us to build your personalized trip comparison.
      </p>

      <SurveyFooter onBack={onBack} onNext={onNext} nextLabel="✨ Reveal my travel match" />
    </div>
  );
}

type AnswerCardProps = {
  stepLabel: string;
  icon?: any;
  label?: string;
  isDouble?: boolean;
  icon1?: any;
  label1?: string;
  icon2?: any;
  label2?: string;
  isMulti?: boolean;
  items?: { icon: any; label: string }[];
  extraCount?: number;
  onClick?: () => void;
  isClickable?: boolean;
};

function AnswerCard({
  extraCount,
  icon: Icon,
  icon1: Icon1,
  icon2: Icon2,
  isClickable,
  isDouble,
  isMulti,
  items,
  label,
  label1,
  label2,
  onClick,
  stepLabel,
}: AnswerCardProps) {
  return (
    <div
      className={`bg-stone-50/50 border border-stone-200/50 rounded-lg p-3 text-left group transition-all ${
        isClickable ? "cursor-pointer hover:bg-stone-100/50 hover:border-stone-300/50" : ""
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wide text-stone-400 font-medium">{stepLabel}</p>
        {isClickable && (
          <Edit2 className="w-3 h-3 text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {isDouble && Icon1 && Icon2 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Icon1 className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm text-stone-700">{label1}</p>
          </div>
          <div className="h-px bg-stone-200/50" />
          <div className="flex items-center gap-2">
            <Icon2 className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm text-stone-700">{label2}</p>
          </div>
        </div>
      ) : isMulti && items ? (
        <div className="space-y-1.5">
          {items.map((item, idx) => {
            const ItemIcon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2">
                <ItemIcon className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-sm text-stone-700">{item.label}</p>
              </div>
            );
          })}
          {!!extraCount && (
            <p className="text-xs text-stone-400 mt-1">+{extraCount} more</p>
          )}
        </div>
      ) : Icon ? (
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-sm text-stone-700 line-clamp-2">{label}</p>
        </div>
      ) : null}
    </div>
  );
}
