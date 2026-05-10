import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ResultPageClient } from "@/components/wandertypes/ResultPageClient";
import { WANDERTYPES } from "@/lib/wanderType";
import { WANDERTYPE_KEYS, isWandertypeKey } from "@/lib/wanderTypeKeys";

type Props = {
  params: Promise<{ key: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { key } = await params;
  if (!isWandertypeKey(key)) {
    return { title: "Result" };
  }
  const w = WANDERTYPES[key];
  return {
    title: w.name,
    description: w.subtitle,
  };
}

export function generateStaticParams() {
  return WANDERTYPE_KEYS.map((key) => ({ key }));
}

export default async function ResultPage({ params }: Props) {
  const { key } = await params;
  if (!isWandertypeKey(key)) {
    notFound();
  }
  return <ResultPageClient wanderKey={key} />;
}
