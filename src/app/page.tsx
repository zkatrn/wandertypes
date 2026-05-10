import { redirect } from "next/navigation";
import { HomePageClient } from "@/components/wandertypes/HomePageClient";
import { isWandertypeKey } from "@/lib/wanderTypeKeys";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ hint?: string }>;
}) {
  const { hint } = await searchParams;
  if (hint && isWandertypeKey(hint)) {
    redirect(`/result/${hint}`);
  }
  return <HomePageClient />;
}
