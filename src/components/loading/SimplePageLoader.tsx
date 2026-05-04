"use client";

/**
 * Lightweight fetch gate — avoids the full LoadingScreen (large bg image decode,
 * starfield, fact rotation) when we are only waiting on Auth + Firestore.
 */
export function SimplePageLoader({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-6">
      <div
        className="h-10 w-10 shrink-0 rounded-full border-2 border-primary/25 border-t-primary animate-spin"
        aria-hidden
      />
      <p className="max-w-sm text-center text-sm text-stone-600">{message}</p>
    </div>
  );
}
