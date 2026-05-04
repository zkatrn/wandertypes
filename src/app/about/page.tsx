import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About WanderMoodz",
  description:
    "A personalized travel decision assistant — survey-first, comparison-driven, emotionally intelligent.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen text-stone-900">
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-app-photo-backdrop"
        style={{ backgroundImage: "url(/about-bg.png)" }}
        aria-hidden
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-stone-950/80 via-stone-900/65 to-stone-950/85"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-28 md:pt-28 md:pb-32">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90 mb-3">
          WanderMoodz
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
          We help you figure out what kind of trip you actually want.
        </h1>
        <p className="text-stone-200 text-base md:text-lg leading-relaxed mb-10">
          Most tools skip straight to bookings. We start with how you want to{" "}
          <em className="text-amber-100 not-italic">feel</em> on the trip — pace,
          group dynamics, tradeoffs — then build a clear comparison board so you
          can decide with confidence.
        </p>

        <div className="space-y-5 text-stone-800">
          <section className="rounded-2xl border border-stone-200/80 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2">
              What we do
            </h2>
            <ul className="list-disc list-inside space-y-2 text-sm leading-relaxed text-stone-700">
              <li>
                Short survey to capture mood, environment, pacing, and what you
                want to avoid — without dense forms.
              </li>
              <li>
                AI-assisted interpretation that maps your answers to a{" "}
                <strong>Wandertype</strong> and tailored destination comparison
                cards.
              </li>
              <li>
                Honest tradeoffs: what shines in each place, what to watch out
                for, and links to explore further (we are not a booking engine).
              </li>
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200/80 bg-white/95 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2">
              What we are not
            </h2>
            <p className="text-sm leading-relaxed text-stone-700">
              Not an itinerary factory, not a scraper, and not a chat-only
              experience. The goal is a calm, visual decision surface you can
              return to while you plan.
            </p>
          </section>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/survey"
              className="inline-flex justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-stone-900 shadow hover:bg-amber-300 transition-colors"
            >
              Start the survey
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
