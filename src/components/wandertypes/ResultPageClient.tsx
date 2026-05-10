"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import type { WandertypeKey } from "@/lib/wanderType";
import { WANDERTYPES } from "@/lib/wanderType";
import { idealDestinationsTriple } from "@/lib/wanderTypesDestinations";
import { WanderTypesWordmark } from "./WanderTypesWordmark";

const VOYAGEBLITZ_BASE = "https://voyageblitz.com";

export function ResultPageClient({ wanderKey }: { wanderKey: WandertypeKey }) {
  const w = WANDERTYPES[wanderKey];
  const destinations = idealDestinationsTriple(wanderKey);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const voyageUrl = `${VOYAGEBLITZ_BASE}?wandertype=${encodeURIComponent(wanderKey)}`;

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/result/${wanderKey}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [wanderKey]);

  const handleNativeShare = useCallback(async () => {
    const url = `${window.location.origin}/result/${wanderKey}`;
    try {
      await navigator.share({
        title: `${w.name} — WanderTypes`,
        text: w.subtitle,
        url,
      });
    } catch {
      /* User dismissed share sheet or share failed */
    }
  }, [w.name, w.subtitle, wanderKey]);

  return (
    <div className="relative z-20 min-h-screen px-4 pb-16 pt-6 sm:px-8">
      <header className="mx-auto mb-8 flex max-w-2xl items-center justify-between">
        <WanderTypesWordmark />
        <Link
          href="/types"
          className="text-sm text-[#8aa4c0] transition-colors hover:text-[#f0e8d8]"
        >
          All types
        </Link>
      </header>

      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="relative mx-auto max-w-[612px] overflow-hidden rounded-3xl border border-[#8aa4c0]/25 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        style={{
          boxShadow: `0 0 0 1px ${w.color}33, 0 24px 80px rgba(0,0,0,0.45)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.28]"
          style={{
            backgroundImage: `url(/bg_${wanderKey}.png)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(165deg, ${w.color}99 0%, #0f0c29 48%, #0a0822 100%)`,
          }}
          aria-hidden
        />

        <div className="relative px-6 pb-10 pt-12 sm:px-10 sm:pt-14">
          <p className="text-center text-5xl sm:text-6xl" aria-hidden>
            {w.emoji}
          </p>
          <h1 className="mt-4 text-center font-serif text-3xl text-[#f0e8d8] sm:text-[2rem]">
            {w.name}
          </h1>
          <p
            className="mx-auto mt-4 max-w-md text-center font-sans text-base italic leading-relaxed text-[#f0e8d8]/95"
            style={{ textShadow: `0 0 40px ${w.color}66` }}
          >
            &ldquo;{w.subtitle}&rdquo;
          </p>

          <div
            className="mx-auto mt-8 h-px max-w-xs bg-gradient-to-r from-transparent via-[#ffd97d]/50 to-transparent"
            aria-hidden
          />

          <p className="mt-8 font-sans text-[15px] leading-relaxed text-[#e4dcd0]">
            {w.description}
          </p>

          <div className="mt-8">
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8aa4c0]">
              Your travel traits
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {w.traits.map((trait, ti) => (
                <li
                  key={`trait-${ti}`}
                  className="rounded-full border border-[#f0e8d8]/20 bg-[#0f0c29]/50 px-3 py-1.5 font-sans text-sm text-[#f0e8d8]"
                  style={{ borderColor: `${w.color}55` }}
                >
                  {trait}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8aa4c0]">
              Ideal destination vibes
            </p>
            <ul className="mt-3 space-y-2 font-sans text-[15px] text-[#e8dfd3]">
              {destinations.map((d, di) => (
                <li key={`ideal-${di}`} className="flex gap-2">
                  <span style={{ color: w.color }} aria-hidden>
                    ✦
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex flex-col gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-4">
            <a
              href={voyageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ffd97d] to-[#ffb347] px-7 py-3.5 font-sans text-base font-semibold text-[#1a1538] shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Find your perfect trip
              <ExternalLink className="h-4 w-4" strokeWidth={2.25} />
            </a>

            {/* Desktop / tablet: copy link only */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden md:inline-flex items-center justify-center gap-2 rounded-full border border-[#8aa4c0]/45 px-7 py-3.5 font-sans text-base font-medium text-[#f0e8d8] transition-colors hover:border-[#ffd97d]/55 hover:bg-[#1a1744]/50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[#7dffb3]" />
                  Link copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy link
                </>
              )}
            </button>

            {/* Mobile: native share + copy link */}
            <div className="flex w-full max-w-sm flex-col gap-2 self-center md:hidden">
              {canNativeShare ? (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#8aa4c0]/45 px-7 py-3.5 font-sans text-base font-medium text-[#f0e8d8] transition-colors hover:border-[#ffd97d]/55 hover:bg-[#1a1744]/50"
                >
                  <Share2 className="h-4 w-4" />
                  Share…
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#8aa4c0]/35 bg-[#0f0c29]/40 px-7 py-3.5 font-sans text-base font-medium text-[#c9d4df] transition-colors hover:border-[#ffd97d]/45 hover:bg-[#1a1744]/50 hover:text-[#f0e8d8]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-[#7dffb3]" />
                    Link copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </motion.article>

      <p className="mx-auto mt-10 max-w-md text-center font-sans text-sm text-[#8aa4c0]">
        Want a different answer?{" "}
        <Link href="/quiz" className="text-[#ffd97d] underline-offset-2 hover:underline">
          Retake the quiz
        </Link>
      </p>
    </div>
  );
}
