import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import balloonImage from "@/lib/assets/balloon.png";
import { BG_HERO_SRC } from "@/lib/siteAssets";
import { WANDERTYPES, type WandertypeKey } from "@/lib/wanderType";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Wandertypes",
  description: "Explore the seven travel personality types behind VoyageBlitz.",
};

const WANDERTYPE_ORDER: WandertypeKey[] = [
  "coastal_calm",
  "golden_adventure",
  "city_spark",
  "rainforest_luxe",
  "slow_romance",
  "wild_explorer",
  "balanced_journey",
];

export default function WanderTypesPage() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 bg-app-photo-backdrop"
        style={{
          backgroundImage: `url(${BG_HERO_SRC})`,
          backgroundAttachment: "fixed",
          filter: "saturate(0.5) brightness(1.05)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-white/25" />

      <div className="relative z-10 min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14">
          {/* Hero */}
          <header className="text-center mb-14 sm:mb-16">
            <div className="flex justify-center gap-2 items-center mb-4">
              <Image src={balloonImage} alt="" width={28} height={28} />
              <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-medium">
                VoyageBlitz
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-primary mb-4 tracking-tight">
              The 7 Wandertypes
            </h1>
            <p className="text-stone-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-8 italic">
              Every traveler has a type — a way they move through the world, what they&apos;re
              really chasing, and what drains them. Find yours.
            </p>
            <Link href="/">
              <Button className="px-8">✨ Find my Wandertype</Button>
            </Link>
          </header>

          <p className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-medium text-center mb-8 pb-4 border-b border-stone-200/80">
            All 7 Wandertypes — which one are you?
          </p>

          <div className="flex flex-col gap-5 sm:gap-6">
            {WANDERTYPE_ORDER.map((key) => {
              const w = WANDERTYPES[key];
              const d = w.pageDetails;
              return (
                <article
                  key={key}
                  id={key}
                  className="scroll-mt-24 bg-stone-50/95 border border-stone-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[minmax(0,240px)_1fr]">
                    <div
                      className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-stone-200 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${w.color}12 0%, transparent 55%)`,
                      }}
                    >
                      <div className="relative z-10">
                        <span className="text-4xl block mb-3" aria-hidden>
                          {w.emoji}
                        </span>
                        <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">
                          {w.name}
                        </h2>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 font-mono mb-5">
                          {key}
                        </p>
                        <div className="flex flex-col gap-2">
                          {w.traits.map((trait) => (
                            <span
                              key={trait}
                              className="text-[11px] px-3 py-1 rounded-full border border-stone-200 bg-white/80 text-stone-600 w-fit"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col gap-4">
                      <blockquote
                        className="text-base sm:text-lg italic text-stone-800 pl-4 border-l-4"
                        style={{ borderColor: w.color }}
                      >
                        &ldquo;{w.subtitle}&rdquo;
                      </blockquote>
                      <p className="text-sm text-stone-700 leading-relaxed">{w.description}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                        <div className="bg-white/80 border border-stone-200/80 rounded-lg p-3">
                          <p className="text-[9px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                            Ideal destinations
                          </p>
                          <p className="text-xs text-stone-700 leading-snug">{d.idealDestinations}</p>
                        </div>
                        <div className="bg-white/80 border border-stone-200/80 rounded-lg p-3">
                          <p className="text-[9px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                            Avoids
                          </p>
                          <p className="text-xs text-stone-700 leading-snug">{d.avoids}</p>
                        </div>
                        <div className="bg-white/80 border border-stone-200/80 rounded-lg p-3">
                          <p className="text-[9px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                            Pace
                          </p>
                          <p className="text-xs text-stone-700 leading-snug">{d.pace}</p>
                        </div>
                        <div className="bg-white/80 border border-stone-200/80 rounded-lg p-3">
                          <p className="text-[9px] uppercase tracking-wider text-stone-400 font-medium mb-1">
                            Best with
                          </p>
                          <p className="text-xs text-stone-700 leading-snug">{d.bestWith}</p>
                        </div>
                      </div>

                      <p
                        className="text-sm italic mt-1 px-4 py-3 rounded-lg border border-stone-200 bg-white/70"
                        style={{ color: w.color }}
                      >
                        {w.microcopy}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <section className="mt-14 sm:mt-16 text-center p-8 sm:p-10 rounded-2xl border border-stone-200 bg-stone-50/95">
            <h2 className="text-2xl font-serif font-bold text-primary mb-3">Which one are you?</h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto mb-6 italic leading-relaxed">
              Answer a few questions and we&apos;ll match you to your Wandertype — then build your
              personalized trip comparison board.
            </p>
            <Link href="/">
              <Button className="px-8">✨ Find my Wandertype</Button>
            </Link>
          </section>

          <p className="text-center mt-12 text-xs text-stone-500 italic tracking-wide">
            VoyageBlitz · Your trip, matched to you 🎈
          </p>
        </div>
      </div>
    </>
  );
}
