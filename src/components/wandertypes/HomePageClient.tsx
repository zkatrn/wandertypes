"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WANDERTYPE_KEYS } from "@/lib/wanderTypeKeys";
import { WANDERTYPES } from "@/lib/wanderType";
import { WanderTypesWordmark } from "./WanderTypesWordmark";

export function HomePageClient() {
  return (
    <div className="relative z-20 flex min-h-screen flex-col px-4 pb-16 pt-6 sm:px-8">
      <header className="mx-auto mb-10 flex w-full max-w-5xl items-center justify-between">
        <WanderTypesWordmark />
        <Link
          href="/types"
          className="text-sm text-[#8aa4c0] transition-colors hover:text-[#f0e8d8]"
        >
          All types
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-sans text-xs uppercase tracking-[0.35em] text-[#8aa4c0]"
        >
          One quiz · Seven truths
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="font-serif text-4xl leading-tight text-[#f0e8d8] sm:text-5xl md:text-[3.25rem]"
        >
          What kind of traveler{" "}
          <span className="bg-gradient-to-r from-[#ffd97d] to-[#ffb347] bg-clip-text text-transparent">
            are you?
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mt-5 max-w-lg font-sans text-base leading-relaxed text-[#c9d4df]"
        >
          Seven WanderTypes — each with its own pace, cravings, and ideal trips.
          Discover yours in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.55 }}
          className="mt-10"
        >
          <Link
            href="/quiz"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffd97d] to-[#ffb347] px-8 py-3.5 font-sans text-base font-semibold text-[#1a1538] shadow-[0_8px_32px_rgba(255,217,125,0.28)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Find Your WanderType
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.65 }}
        className="mx-auto mt-16 w-full max-w-5xl"
        aria-label="The seven WanderTypes"
      >
        <p className="mb-6 text-center font-sans text-xs uppercase tracking-[0.28em] text-[#8aa4c0]">
          Meet the seven
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 lg:gap-2">
          {WANDERTYPE_KEYS.map((key, i) => {
            const w = WANDERTYPES[key];
            return (
              <motion.li
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
              >
                <Link
                  href={`/types#${key}`}
                  className="flex flex-col items-center rounded-2xl border border-[#8aa4c0]/25 bg-[#1a1744]/60 px-3 py-4 text-center backdrop-blur-sm transition-colors hover:border-[#ffd97d]/35 hover:bg-[#1f1a50]/80"
                >
                  <span className="mb-2 text-2xl" aria-hidden>
                    {w.emoji}
                  </span>
                  <span className="font-serif text-xs leading-tight text-[#f0e8d8]">
                    {w.name.replace(/^The /, "")}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.section>

      <p className="mx-auto mt-14 max-w-md text-center font-sans text-xs text-[#8aa4c0]/90">
        Powered by{" "}
        <a
          href="https://voyageblitz.com"
          className="text-[#ffd97d]/90 underline-offset-2 hover:underline"
        >
          VoyageBlitz
        </a>
        — compare destinations matched to your type.
      </p>
    </div>
  );
}
