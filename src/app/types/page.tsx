import type { Metadata } from "next";
import { AllTypesPageClient } from "@/components/wandertypes/AllTypesPageClient";

export const metadata: Metadata = {
  title: "The 7 WanderTypes",
  description:
    "Meet all seven travel personality archetypes — from the Unplugger to the Harmony Seeker.",
};

export default function AllTypesPage() {
  return <AllTypesPageClient />;
}
