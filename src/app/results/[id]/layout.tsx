import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saved comparison",
  description: "A saved VoyageBlitz trip comparison.",
};

export default function SavedResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
