import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  Building,
  Building2,
  Calendar,
  Check,
  CircleDollarSign,
  Coffee,
  Compass,
  Crown,
  DollarSign,
  Droplets,
  Eye,
  Fish,
  Flame,
  Footprints,
  Gem,
  Heart,
  HeartHandshake,
  Landmark,
  MapPin,
  Palmtree,
  Meh,
  MessageSquareText,
  Mountain,
  Music,
  Scale,
  Search,
  Ship,
  ShoppingBag,
  Sparkles,
  Squirrel,
  Star,
  Sun,
  ThumbsUp,
  Trees,
  Utensils,
  UtensilsCrossed,
  Waves,
  Wind,
  X,
  Zap,
  User,
  Users,
  UsersRound,
  Home,
  Car,
  Shuffle,
} from "lucide-react";
import type { SurveyAnswers } from "@/types/survey";

function pick<M extends Record<string, LucideIcon>>(
  map: M,
  key: string | undefined,
  fallback: LucideIcon = Star
): LucideIcon {
  if (!key) return fallback;
  return map[key] ?? fallback;
}

const STEP1: Record<string, LucideIcon> = {
  reset: Heart,
  unforgettable: Eye,
  explore: Utensils,
  comfortable_adventure: Mountain,
  romantic: HeartHandshake,
  surprise: Shuffle,
};

const STEP2: Record<string, LucideIcon> = {
  slow: Coffee,
  one_per_day: Sun,
  balanced: Scale,
  packed: Zap,
  depends: Calendar,
};

const STEP3: Record<string, LucideIcon> = {
  ocean: Palmtree,
  rainforest: Trees,
  mountains: Mountain,
  culture: Landmark,
  city_energy: Building2,
  boutique: BedDouble,
  remote: MapPin,
};

/** First icon for step 4: group type (who’s coming). */
const STEP4_GROUP: Record<string, LucideIcon> = {
  solo: User,
  couple: Heart,
  friends: UsersRound,
  family: Home,
  mixed: Users,
};

const STEP5_ACTIVITY: Record<string, LucideIcon> = {
  beach_swim: Waves,
  waterfalls: Droplets,
  wildlife: Squirrel,
  hiking: Footprints,
  food_tours: UtensilsCrossed,
  coffee_tours: Coffee,
  hot_springs: Flame,
  snorkeling: Fish,
  nightlife: Music,
  culture: Building,
  shopping: ShoppingBag,
  spa_pool: Sparkles,
  scenic_drives: Car,
  boat_day: Ship,
  zipline: Wind,
  hidden_gems: Search,
};

const STEP6_FRICTION: Record<string, LucideIcon> = {
  worth_it: ThumbsUp,
  some_is_fine: Check,
  low_friction: Meh,
  avoid: X,
};

const STEP7_BUDGET: Record<string, LucideIcon> = {
  budget_conscious: DollarSign,
  comfortable_mid: CircleDollarSign,
  splurge_few: Gem,
  luxe: Crown,
  fit_over_budget: Heart,
};

/**
 * Progress ring markers: default ⭐; once the step has answers, show the same
 * icon used for the chosen option (multi-select → first selected).
 */
export function getSurveyProgressMarkerIcon(
  stepNumber: number,
  answers: SurveyAnswers | undefined | null
): LucideIcon {
  const a = answers ?? {};

  switch (stepNumber) {
    case 1:
      return pick(STEP1, a.tripMood);
    case 2:
      return pick(STEP2, a.pace);
    case 3:
      return pick(STEP3, a.environment);
    case 4:
      return pick(STEP4_GROUP, a.groupType);
    case 5: {
      const first = a.activities?.[0];
      return pick(STEP5_ACTIVITY, first);
    }
    case 6:
      return pick(STEP6_FRICTION, a.frictionTolerance);
    case 7:
      return pick(STEP7_BUDGET, a.budgetFeel);
    case 8:
      if (a.openText?.trim()) {
        return MessageSquareText;
      }
      return Star;
    default:
      return Star;
  }
}
