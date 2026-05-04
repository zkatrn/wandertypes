import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Survey",
  description: "Answer a few questions so we can match your trip to you.",
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
