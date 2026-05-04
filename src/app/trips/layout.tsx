import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Trips",
  description: "Your saved VoyageBlitz trip comparisons.",
};

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
