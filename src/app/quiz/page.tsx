import type { Metadata } from "next";
import { QuizPageClient } from "@/components/wandertypes/QuizPageClient";

export const metadata: Metadata = {
  title: "Quiz",
  description:
    "Answer a few questions to discover your WanderType travel personality.",
};

export default function QuizPage() {
  return <QuizPageClient />;
}
