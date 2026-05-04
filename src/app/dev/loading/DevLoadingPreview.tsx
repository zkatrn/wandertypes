"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoadingTravelFact } from "@/components/LoadingTravelFact";

function DevLoadingPreviewInner() {
  const searchParams = useSearchParams();
  const hintsParam = searchParams.get("hints");
  const relatedPhrases = hintsParam
    ? hintsParam.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-900 px-6">
      <div className="text-center max-w-md">
        <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-stone-200 mb-1">
          Generating your personalized comparison…
        </p>
        <p className="text-stone-400 text-xs mb-8">
          Dev preview — same layout as /results while the AI runs.
        </p>
        <LoadingTravelFact
          relatedPhrases={relatedPhrases}
          className="mt-2 text-stone-300/95"
        />
        {relatedPhrases && relatedPhrases.length > 0 ? (
          <p className="text-stone-500 text-[11px] mt-6 leading-relaxed">
            Using <code className="text-stone-400">?hints=…</code> — facts
            mentioning these places are shuffled first.
          </p>
        ) : (
          <p className="text-stone-500 text-[11px] mt-6 leading-relaxed">
            Try{" "}
            <code className="text-stone-400 whitespace-pre-wrap break-all">
              ?hints=Costa Rica,Japan
            </code>{" "}
            to test destination-aware ordering.
          </p>
        )}
      </div>
    </div>
  );
}

export function DevLoadingPreview() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-900 via-indigo-800 to-blue-900">
          <div className="animate-spin w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full" />
        </div>
      }
    >
      <DevLoadingPreviewInner />
    </Suspense>
  );
}
