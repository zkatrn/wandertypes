"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingScreen } from "@/components/loading/LoadingScreen";

function DevLoadingPreviewInner() {
  const searchParams = useSearchParams();
  const hintsParam = searchParams.get("hints");
  const relatedPhrases = hintsParam
    ? hintsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  return (
    <LoadingScreen relatedPhrases={relatedPhrases} />
  );
}

export function DevLoadingPreview() {
  return (
    <Suspense fallback={<LoadingScreen statusSteps={["Loading preview…"]} />}>
      <DevLoadingPreviewInner />
    </Suspense>
  );
}
