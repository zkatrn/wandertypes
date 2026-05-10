"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  WANDERTYPES_QUIZ,
  computeScoresFromSelections,
  resolveWandertypeKey,
} from "@/lib/wanderTypesQuiz";
import { WanderTypesWordmark } from "./WanderTypesWordmark";
import { QUIZ_OPTION_ICONS } from "./quizIcons";

const MAIN_QUESTION_COUNT = 8;

export function QuizPageClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<(number | null)[]>(() =>
    Array(WANDERTYPES_QUIZ.length).fill(null),
  );

  const total = WANDERTYPES_QUIZ.length;
  const question = WANDERTYPES_QUIZ[step];
  const isFinalQuestion = question.isTiebreaker;

  const progress = ((step + 1) / total) * 100;

  const selectedIndex = selections[step];
  const hasAnswer =
    typeof selectedIndex === "number" &&
    selectedIndex >= 0 &&
    selectedIndex <= 3;

  const canGoBack = step > 0;
  const canGoNext = hasAnswer && step < total - 1;
  const canFinish = hasAnswer && step === total - 1;

  const stepLabel = useMemo(() => {
    if (isFinalQuestion) return "Final question";
    return `Question ${step + 1} of ${MAIN_QUESTION_COUNT}`;
  }, [isFinalQuestion, step]);

  const submitQuiz = (complete: number[]) => {
    const scores = computeScoresFromSelections(complete);
    router.push(`/result/${resolveWandertypeKey(scores)}`);
  };

  /** Choosing an answer advances immediately except on the final question — result opens via “See my result”. */
  const selectOption = (optionIndex: number) => {
    setSelections((prev) => {
      const next = [...prev];
      next[step] = optionIndex;
      return next;
    });

    if (step < total - 1) {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (!canGoBack) return;
    setStep((s) => s - 1);
  };

  const goNext = () => {
    if (!canGoNext) return;
    setStep((s) => s + 1);
  };

  const finish = () => {
    if (!canFinish) return;
    if (!selections.every((x): x is number => typeof x === "number")) return;
    submitQuiz(selections);
  };

  return (
    <div className="relative z-20 flex min-h-screen flex-col px-4 pb-12 pt-6 sm:px-8">
      <header className="mx-auto mb-8 flex w-full max-w-[612px] items-center justify-between gap-4">
        <WanderTypesWordmark />
        <Link
          href="/types"
          className="shrink-0 text-sm text-[#8aa4c0] transition-colors hover:text-[#f0e8d8]"
        >
          Types
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-[612px] flex-1 flex-col">
        <div className="mb-3 flex items-end justify-between gap-4 font-sans text-xs uppercase tracking-[0.2em] text-[#8aa4c0]">
          <span className={isFinalQuestion ? "text-[#ffd97d]/95" : undefined}>
            {/* {stepLabel} */}
          </span>
          <span className="tracking-[0.14em] text-[#8aa4c0]/85">
            Question {step + 1} / {total}
          </span>
        </div>

        <div
          className="mb-10 h-1.5 overflow-hidden rounded-full bg-[#1e1a45]"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#ffd97d] to-[#ffb347]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35 }}
            className="flex flex-1 flex-col"
          >
            <h1 className="font-serif text-2xl leading-snug text-[#f0e8d8] sm:text-3xl">
              {question.prompt}
            </h1>

            <ul className="mt-10 flex flex-col gap-3">
              {question.options.map((opt, i) => {
                const Icon = QUIZ_OPTION_ICONS[opt.icon];
                const isChosen = selectedIndex === i;
                return (
                  <li key={opt.id}>
                    <button
                      type="button"
                      onClick={() => selectOption(i)}
                      className={`group flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-left backdrop-blur-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd97d]/80 ${
                        isChosen
                          ? "border-[#ffd97d]/70 bg-[#1f1a55]/90 ring-1 ring-[#ffd97d]/35"
                          : "border-[#8aa4c0]/30 bg-[#141233]/75 hover:border-[#ffd97d]/45 hover:bg-[#1a1744]/90"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-[#0f0c29]/80 text-[#ffd97d] transition-colors ${
                          isChosen
                            ? "border-[#ffd97d]/50"
                            : "border-[#8aa4c0]/25 group-hover:border-[#ffd97d]/40"
                        }`}
                        aria-hidden
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <span className="pt-1.5 font-sans text-[15px] leading-snug text-[#e8e2d8]">
                        {opt.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto flex items-center justify-between gap-4 pt-12 pb-2">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className="inline-flex items-center gap-2 rounded-full border border-[#8aa4c0]/35 px-5 py-3 font-sans text-sm font-medium text-[#c9d4df] transition-colors hover:border-[#ffd97d]/45 hover:text-[#f0e8d8] disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" strokeWidth={2} />
                Back
              </button>

              {step < total - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canGoNext}
                  title="Move forward after going back"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffd97d]/45 bg-[#ffd97d]/12 px-5 py-3 font-sans text-sm font-semibold text-[#ffd97d] transition-colors hover:bg-[#ffd97d]/18 disabled:pointer-events-none disabled:opacity-35"
                >
                  Next
                  <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={finish}
                  disabled={!canFinish}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffd97d] to-[#ffb347] px-6 py-3 font-sans text-sm font-semibold text-[#1a1538] shadow-lg transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  See my result
                  <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
