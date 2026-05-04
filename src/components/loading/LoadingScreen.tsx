"use client";

import Image from "next/image";
import { useContext, useEffect, useMemo, useState } from "react";
import balloonImage from "@/lib/assets/balloon.png";
import { FullScreenLoadingContext } from "@/context/FullScreenLoadingContext";
import { LOADING_SCREEN_FACTS } from "@/data/loadingScreenFacts";
import styles from "./LoadingScreen.module.css";

/** Same cadence and copy as loading_screen.html status cycling. */
export const DEFAULT_LOADING_STATUS_STEPS = [
  "Reading your answers...",
  "Identifying your Wandertype...",
  "Matching destinations to your mood...",
  "Evaluating adventure options...",
  "Weighing tradeoffs for your group...",
  "Calculating match scores...",
  "Building your comparison board...",
  "Almost ready...",
] as const;

type StarSpec = {
  id: number;
  size: number;
  topPct: number;
  leftPct: number;
  durationS: number;
  delayS: number;
};

function shuffleHtmlStyle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function orderedFactsForPhrases(phrases: string[] | undefined): string[] {
  const pool = [...LOADING_SCREEN_FACTS];
  if (!phrases?.length) {
    return shuffleHtmlStyle(pool);
  }
  const words = new Set<string>();
  for (const phrase of phrases) {
    for (const w of phrase.toLowerCase().split(/[^a-z0-9]+/)) {
      if (w.length >= 4) words.add(w);
    }
  }
  if (words.size === 0) {
    return shuffleHtmlStyle(pool);
  }
  const matched = pool.filter((f) => {
    const fl = f.toLowerCase();
    return [...words].some((w) => fl.includes(w));
  });
  const rest = pool.filter((f) => !matched.includes(f));
  return [...shuffleHtmlStyle(matched), ...shuffleHtmlStyle(rest)];
}

type LoadingScreenProps = {
  /** Uppercase-style brand line in the loading UI. */
  brandLabel?: string;
  /** Status lines; progress dots count matches length. */
  statusSteps?: readonly string[] | string[];
  /** Optional: facts mentioning survey places first, then shuffle the rest. */
  relatedPhrases?: string[];
  children?: React.ReactNode;
};

function generateStars(): StarSpec[] {
  return Array.from({ length: 60 }, (_, id) => ({
    id,
    size: Math.random() * 2.5 + 0.8,
    topPct: Math.random() * 100,
    leftPct: Math.random() * 100,
    durationS: Math.random() * 3 + 1.5,
    delayS: Math.random() * 5,
  }));
}

export function LoadingScreen({
  brandLabel = "VoyageBlitz",
  statusSteps: statusStepsProp,
  relatedPhrases,
  children,
}: LoadingScreenProps) {
  const fullScreenLoading = useContext(FullScreenLoadingContext);

  const stepsKey =
    statusStepsProp?.join("\u0000") ?? "__default_loading_steps__";
  const steps =
    statusStepsProp && statusStepsProp.length > 0
      ? [...statusStepsProp]
      : [...DEFAULT_LOADING_STATUS_STEPS];
  const phraseKey = useMemo(
    () =>
      relatedPhrases
        ?.map((s) => s.trim())
        .filter(Boolean)
        .join("\u0001") ?? "",
    [relatedPhrases],
  );

  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<StarSpec[]>([]);
  const [shuffledFacts, setShuffledFacts] = useState<string[]>([]);
  const [factIndex, setFactIndex] = useState(0);
  const [factFading, setFactFading] = useState(false);

  /** Index of the status line currently shown (matches HTML after each nextStep). */
  const [shownStepIdx, setShownStepIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    setStars(generateStars());
  }, []);

  const registerFullScreen = fullScreenLoading?.begin;
  const unregisterFullScreen = fullScreenLoading?.end;
  useEffect(() => {
    if (!registerFullScreen || !unregisterFullScreen) return;
    registerFullScreen();
    return () => unregisterFullScreen();
  }, [registerFullScreen, unregisterFullScreen]);

  useEffect(() => {
    if (!mounted) return;
    const phrases =
      phraseKey.length > 0 ? phraseKey.split("\u0001") : undefined;
    setShuffledFacts(orderedFactsForPhrases(phrases));
    setFactIndex(0);
  }, [mounted, phraseKey]);

  const currentFact =
    shuffledFacts.length > 0
      ? shuffledFacts[factIndex % shuffledFacts.length]
      : "Loading travel wisdom...";

  useEffect(() => {
    if (!mounted || shuffledFacts.length <= 1) return;

    const rotate = () => {
      setFactFading(true);
      window.setTimeout(() => {
        setFactIndex((i) => (i + 1) % shuffledFacts.length);
        setFactFading(false);
      }, 500);
    };

    const id = window.setInterval(rotate, 7000);
    return () => window.clearInterval(id);
  }, [mounted, shuffledFacts.length]);

  useEffect(() => {
    setShownStepIdx(0);
  }, [stepsKey]);

  useEffect(() => {
    if (!mounted || steps.length <= 1) return;
    const id = window.setInterval(() => {
      setShownStepIdx((i) => (i >= steps.length - 1 ? i : i + 1));
    }, 7000);
    return () => window.clearInterval(id);
  }, [mounted, steps.length, stepsKey]);

  const dotStates = steps.map((_, i) => {
    if (i < shownStepIdx) return "done" as const;
    if (i === shownStepIdx) return "active" as const;
    return "idle" as const;
  });

  const statusText = steps[shownStepIdx] ?? "";

  return (
    <div className={styles.root}>
      <div className={styles.skyBgWrap}>
        <Image
          src="/bg.png"
          alt=""
          fill
          className={styles.skyBgImage}
          priority
          sizes="100vw"
        />
      </div>

      <div className={styles.stars} aria-hidden>
        {stars.map((s) => (
          <div
            key={s.id}
            className={styles.star}
            style={{
              width: s.size,
              height: s.size,
              top: `${s.topPct}%`,
              left: `${s.leftPct}%`,
              ["--d" as string]: `${s.durationS.toFixed(1)}s`,
              animationDelay: `${s.delayS.toFixed(1)}s`,
            }}
          />
        ))}
      </div>

      <div
        className={styles.cloud}
        style={{ top: "15%", ["--cd" as string]: "25s", ["--cdelay" as string]: "0s" }}
        aria-hidden
      >
        ☁️
      </div>
      <div
        className={styles.cloud}
        style={{ top: "28%", ["--cd" as string]: "32s", ["--cdelay" as string]: "8s" }}
        aria-hidden
      >
        ☁️
      </div>
      <div
        className={styles.cloud}
        style={{ top: "10%", ["--cd" as string]: "28s", ["--cdelay" as string]: "14s" }}
        aria-hidden
      >
        ☁️
      </div>
      <div
        className={styles.cloud}
        style={{ top: "22%", ["--cd" as string]: "36s", ["--cdelay" as string]: "4s" }}
        aria-hidden
      >
        ☁️
      </div>

      <div className={styles.loadingContainer}>
        {children}

        <div className={styles.animationStage}>
          <div className={styles.glowRing} aria-hidden />
          <div className={styles.orbitWrap} aria-hidden>
            <div className={styles.orbitDot} />
            <div className={styles.orbitDot} />
            <div className={styles.orbitDot} />
            <div className={styles.orbitDot} />
          </div>

          <div className={styles.compassWrap}>
            <svg
              className={styles.compassSvg}
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                cx="60"
                cy="60"
                r="56"
                fill="none"
                stroke="rgba(255,217,125,0.3)"
                strokeWidth="1.5"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="rgba(255,217,125,0.15)"
                strokeWidth="1"
              />
              <g stroke="rgba(255,217,125,0.4)" strokeWidth="1">
                <line x1="60" y1="4" x2="60" y2="12" />
                <line x1="60" y1="108" x2="60" y2="116" />
                <line x1="4" y1="60" x2="12" y2="60" />
                <line x1="108" y1="60" x2="116" y2="60" />
              </g>
              <g stroke="rgba(255,217,125,0.2)" strokeWidth="0.8">
                <line x1="88.28" y1="11.72" x2="84.24" y2="15.76" />
                <line x1="31.72" y1="108.28" x2="35.76" y2="104.24" />
                <line x1="11.72" y1="31.72" x2="15.76" y2="35.76" />
                <line x1="108.28" y1="88.28" x2="104.24" y2="84.24" />
                <line x1="60" y1="14" x2="60" y2="18" />
                <line x1="60" y1="102" x2="60" y2="106" />
                <line x1="14" y1="60" x2="18" y2="60" />
                <line x1="102" y1="60" x2="106" y2="60" />
              </g>
              <text
                x="60"
                y="26"
                textAnchor="middle"
                fill="rgba(255,217,125,0.9)"
                fontSize="10"
                fontFamily="Georgia, serif"
                letterSpacing="1"
              >
                N
              </text>
              <text
                x="60"
                y="100"
                textAnchor="middle"
                fill="rgba(255,217,125,0.6)"
                fontSize="9"
                fontFamily="Georgia, serif"
              >
                S
              </text>
              <text
                x="96"
                y="64"
                textAnchor="middle"
                fill="rgba(255,217,125,0.6)"
                fontSize="9"
                fontFamily="Georgia, serif"
              >
                E
              </text>
              <text
                x="24"
                y="64"
                textAnchor="middle"
                fill="rgba(255,217,125,0.6)"
                fontSize="9"
                fontFamily="Georgia, serif"
              >
                W
              </text>
              <polygon
                points="60,20 55,60 60,56 65,60"
                fill="rgba(255,217,125,0.95)"
                stroke="rgba(255,217,125,0.3)"
                strokeWidth="0.5"
              />
              <polygon
                points="60,100 55,60 60,64 65,60"
                fill="rgba(255,217,125,0.25)"
                stroke="rgba(255,217,125,0.15)"
                strokeWidth="0.5"
              />
              <polygon
                points="100,60 60,55 64,60 60,65"
                fill="rgba(255,217,125,0.4)"
                stroke="rgba(255,217,125,0.2)"
                strokeWidth="0.5"
              />
              <polygon
                points="20,60 60,55 56,60 60,65"
                fill="rgba(255,217,125,0.4)"
                stroke="rgba(255,217,125,0.2)"
                strokeWidth="0.5"
              />
              <polygon
                points="60,20 85.36,34.64 60,56"
                fill="rgba(255,217,125,0.15)"
                stroke="none"
              />
              <polygon
                points="60,20 34.64,34.64 60,56"
                fill="rgba(255,217,125,0.1)"
                stroke="none"
              />
              <circle
                cx="60"
                cy="60"
                r="5"
                fill="rgba(255,217,125,0.9)"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
              />
              <circle cx="60" cy="60" r="2.5" fill="#1a1a2e" />
            </svg>
          </div>

          <div className={styles.balloonWrap}>
            <Image
              className={styles.balloonImg}
              src={balloonImage}
              alt=""
              width={130}
              height={130}
              priority
            />
          </div>
        </div>

        <div className={styles.statusWrap}>
          <div className={styles.statusLabel}>{brandLabel}</div>
          <p key={shownStepIdx} className={styles.statusText}>
            {statusText}
          </p>
        </div>

        <div className={styles.progressDots} aria-hidden>
          {dotStates.map((state, i) => (
            <div
              key={i}
              className={`${styles.dot} ${
                state === "active"
                  ? styles.dotActive
                  : state === "done"
                    ? styles.dotDone
                    : ""
              }`}
            />
          ))}
        </div>

        <div className={styles.factCard}>
          <div className={styles.factEyebrow}>🌍 &nbsp; Did you know?</div>
          <p
            className={`${styles.factText} ${factFading ? styles.factTextFading : ""}`}
            aria-live="polite"
            aria-atomic="true"
          >
            {mounted && shuffledFacts.length > 0
              ? currentFact
              : "Loading travel wisdom..."}
          </p>
        </div>
      </div>
    </div>
  );
}
