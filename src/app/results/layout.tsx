import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results",
  description: "Your personalized destination comparison.",
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
