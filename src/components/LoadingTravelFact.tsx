"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TRAVEL_FACTS } from "@/data/travelFacts";

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Prefer facts that mention user-entered place words, then shuffle the rest. */
function orderedFacts(relatedPhrases: string[] | undefined): string[] {
  const pool = [...TRAVEL_FACTS];
  if (!relatedPhrases?.length) {
    return shuffle(pool);
  }

  const words = new Set<string>();
  for (const phrase of relatedPhrases) {
    for (const w of phrase.toLowerCase().split(/[^a-z0-9]+/)) {
      if (w.length >= 4) {
        words.add(w);
      }
    }
  }
  if (words.size === 0) {
    return shuffle(pool);
  }

  const matched = pool.filter((f) => {
    const fl = f.toLowerCase();
    return [...words].some((w) => fl.includes(w));
  });
  const rest = pool.filter((f) => !matched.includes(f));
  return [...shuffle(matched), ...shuffle(rest)];
}

type LoadingTravelFactProps = {
  /** Rotate every N ms (default 7s). */
  intervalMs?: number;
  className?: string;
  /** Destination strings from the survey — matching facts surface first. */
  relatedPhrases?: string[];
};

export function LoadingTravelFact({
  intervalMs = 7000,
  className = "",
  relatedPhrases,
}: LoadingTravelFactProps) {
  /** Random order must not run during SSR — it would mismatch client hydration. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const phraseKey = useMemo(
    () =>
      relatedPhrases
        ?.map((s) => s.trim())
        .filter(Boolean)
        .join("\u0001") ?? "",
    [relatedPhrases]
  );

  const reduceMotion = useReducedMotion();

  const facts = useMemo(() => {
    if (!mounted) {
      return [];
    }
    const phrases =
      phraseKey.length > 0 ? phraseKey.split("\u0001") : undefined;
    return orderedFacts(phrases);
  }, [mounted, phraseKey]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [facts]);

  useEffect(() => {
    if (!mounted || reduceMotion || facts.length <= 1) {
      return;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % facts.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [mounted, facts.length, intervalMs, reduceMotion]);

  if (!mounted || facts.length === 0) {
    return (
      <div
        className={`mx-auto max-w-md px-2 ${className}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="text-sm leading-relaxed text-center opacity-50">
          Picking a travel fact…
        </p>
      </div>
    );
  }

  const fact = facts[index] ?? "";

  return (
    <div
      className={`mx-auto max-w-md px-2 ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
          className="text-sm leading-relaxed text-center"
        >
          <span className="mr-1.5 select-none" aria-hidden>
            🌍
          </span>
          {fact}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
