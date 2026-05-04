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
    <LoadingScreen relatedPhrases={relatedPhrases}>
      <div className="w-full max-w-md mx-auto mb-6 text-center px-2">
        <p className="text-[#8aa4c0] text-xs mb-2 opacity-90">
          Dev preview — same layout as /results while the AI runs.
        </p>
        {relatedPhrases && relatedPhrases.length > 0 ? (
          <p className="text-[#6b7f94] text-[11px] leading-relaxed">
            Using <code className="text-[#8aa4c0]">?hints=…</code> — facts
            mentioning these places are shuffled first.
          </p>
        ) : (
          <p className="text-[#6b7f94] text-[11px] leading-relaxed">
            Try{" "}
            <code className="text-[#8aa4c0] whitespace-pre-wrap break-all">
              ?hints=Costa Rica,Japan
            </code>{" "}
            to test destination-aware ordering.
          </p>
        )}
      </div>
    </LoadingScreen>
  );
}

export function DevLoadingPreview() {
  return (
    <Suspense fallback={<LoadingScreen statusSteps={["Loading preview…"]} />}>
      <DevLoadingPreviewInner />
    </Suspense>
  );
}
