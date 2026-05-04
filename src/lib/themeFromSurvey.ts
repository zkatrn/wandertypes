import type { ThemeKey } from "@/types/interpretation";
import type { SurveyAnswers } from "@/types/survey";

/**
 * Offline / fallback theme selection from survey signals.
 * Rainforest (and boutique) no longer default straight to "The Nester" — we score
 * property-first comfort vs adventure-forward signals and use Harmony when it's in the middle.
 */
export function selectThemeFromSurveyAnswers(answers: SurveyAnswers): ThemeKey {
  if (answers.tripMood === "romantic") return "slow_romance";
  if (answers.environment === "ocean") return "coastal_calm";
  if (answers.environment === "culture" || answers.environment === "city_energy") {
    return "city_spark";
  }
  if (answers.environment === "remote") return "wild_explorer";
  if (answers.environment === "mountains") return "golden_adventure";

  if (answers.environment === "rainforest" || answers.environment === "boutique") {
    return resolveSeekerNesterOrHarmony(answers);
  }

  return "coastal_calm";
}

/** Higher = stronger "Nester" (property-first, slow, low-friction) signals. */
function scoreNesterLean(answers: SurveyAnswers): number {
  let s = 0;
  switch (answers.pace) {
    case "slow":
      s += 3;
      break;
    case "one_per_day":
      s += 2;
      break;
    case "balanced":
      s += 1;
      break;
    case "packed":
      s -= 2;
      break;
    default:
      break;
  }
  switch (answers.frictionTolerance) {
    case "avoid":
      s += 3;
      break;
    case "low_friction":
      s += 2;
      break;
    case "some_is_fine":
      s += 1;
      break;
    case "worth_it":
      s -= 1;
      break;
    default:
      break;
  }
  if (answers.tripMood === "reset") s += 2;
  if (answers.tripMood === "comfortable_adventure") s += 2;

  for (const a of answers.activities ?? []) {
    if (a === "spa_pool") s += 3;
    if (a === "hot_springs" || a === "scenic_drives") s += 1;
    if (a === "hiking" || a === "zipline") s -= 2;
    if (a === "waterfalls" || a === "wildlife") s -= 1;
  }
  return s;
}

/** Higher = stronger "Seeker" (adventure-forward, friction OK) signals. */
function scoreSeekerLean(answers: SurveyAnswers): number {
  let s = 0;
  switch (answers.pace) {
    case "packed":
      s += 3;
      break;
    case "balanced":
      s += 1;
      break;
    case "slow":
    case "one_per_day":
      s -= 1;
      break;
    default:
      break;
  }
  switch (answers.frictionTolerance) {
    case "worth_it":
      s += 3;
      break;
    case "some_is_fine":
      s += 1;
      break;
    case "avoid":
    case "low_friction":
      s -= 2;
      break;
    default:
      break;
  }
  if (answers.tripMood === "unforgettable") s += 3;
  if (answers.tripMood === "explore") s += 2;

  for (const a of answers.activities ?? []) {
    if (a === "hiking" || a === "zipline") s += 2;
    if (a === "waterfalls" || a === "wildlife" || a === "snorkeling") s += 1;
    if (a === "spa_pool") s -= 2;
  }
  return s;
}

function resolveSeekerNesterOrHarmony(answers: SurveyAnswers): ThemeKey {
  const nest = scoreNesterLean(answers);
  const seek = scoreSeekerLean(answers);
  const diff = nest - seek;

  if (diff >= 3) return "rainforest_luxe";
  if (diff <= -3) return "golden_adventure";
  return "balanced_journey";
}
