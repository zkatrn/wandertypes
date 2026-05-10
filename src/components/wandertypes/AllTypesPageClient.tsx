"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WANDERTYPE_KEYS } from "@/lib/wanderTypeKeys";
import { WANDERTYPES } from "@/lib/wanderType";
import { WanderTypesWordmark } from "./WanderTypesWordmark";
import { ArrowRight } from "lucide-react";

export function AllTypesPageClient() {
  return (
    <div className="relative z-20 min-h-screen px-4 pb-20 pt-6 sm:px-8">
      <header className="mx-auto mb-12 flex w-full max-w-4xl items-center justify-between">
        <WanderTypesWordmark />
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd97d]/40 px-4 py-2 font-sans text-sm font-medium text-[#ffd97d] transition-colors hover:bg-[#ffd97d]/10"
        >
          Find your type
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="mx-auto max-w-4xl text-center">
        <h1 className="font-serif text-3xl text-[#f0e8d8] sm:text-4xl">
          The seven{" "}
          <span className="bg-gradient-to-r from-[#ffd97d] to-[#ffb347] bg-clip-text text-transparent">
            WanderTypes
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-sans text-[#c9d4df]">
          Everyone travels differently. Scan the lineup — when something clicks,
          take the quiz to lock in your match.
        </p>
      </div>

      <ul className="mx-auto mt-14 flex max-w-4xl flex-col gap-6">
        {WANDERTYPE_KEYS.map((key, i) => {
          const w = WANDERTYPES[key];
          return (
            <motion.li
              key={key}
              id={key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
              className="scroll-mt-24 overflow-hidden rounded-3xl border border-[#8aa4c0]/25 bg-[#12102e]/70 shadow-lg backdrop-blur-md"
            >
              <div className="grid md:grid-cols-[minmax(0,220px)_1fr]">
                <div
                  className="flex flex-col justify-center border-b border-[#8aa4c0]/20 p-8 md:border-b-0 md:border-r"
                  style={{
                    background: `linear-gradient(160deg, ${w.color}35 0%, transparent 70%)`,
                  }}
                >
                  <span className="text-5xl" aria-hidden>
                    {w.emoji}
                  </span>
                  <h2 className="mt-4 font-serif text-2xl text-[#f0e8d8]">{w.name}</h2>
                  <div
                    className="mt-3 h-1 w-12 rounded-full"
                    style={{ backgroundColor: w.color }}
                  />
                </div>
                <div className="flex flex-col justify-center gap-5 p-8">
                  <p className="font-sans text-lg italic leading-relaxed text-[#e8dfd3]">
                    &ldquo;{w.subtitle}&rdquo;
                  </p>
                  <Link
                    href="/quiz"
                    className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8aa4c0]/35 px-5 py-2.5 font-sans text-sm font-medium text-[#ffd97d] transition-colors hover:border-[#ffd97d]/55 hover:bg-[#ffd97d]/10"
                  >
                    Is this you?
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <section className="mx-auto mt-16 max-w-xl rounded-3xl border border-[#8aa4c0]/25 bg-[#141233]/80 p-10 text-center backdrop-blur-sm">
        <p className="font-serif text-xl text-[#f0e8d8]">Ready to claim yours?</p>
        <p className="mt-2 font-sans text-sm text-[#8aa4c0]">
          Seven questions. One WanderType. Share-worthy results.
        </p>
        <Link
          href="/quiz"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffd97d] to-[#ffb347] px-8 py-3 font-sans font-semibold text-[#1a1538]"
        >
          Start the quiz
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
