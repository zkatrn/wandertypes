import type { SurveyAnswers } from "@/types/survey";

const STORAGE_KEY = "voyageblitz_survey_answers";
/** Prior app name localStorage key — read/clear for one-time migration. */
const LEGACY_STORAGE_KEY = "lumitrip_survey_answers";

export function saveSurveyAnswers(answers: SurveyAnswers): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to save survey answers:", error);
  }
}

export function loadSurveyAnswers(): SurveyAnswers | null {
  if (typeof window === "undefined") return null;
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load survey answers:", error);
    return null;
  }
}

export function clearSurveyAnswers(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear survey answers:", error);
  }
}
