import Image from "next/image";
import Link from "next/link";
import balloonImage from "@/lib/assets/balloon.png";
import { WANDERTYPES, type WandertypeKey } from "@/lib/wanderType";
import anim from "@/styles/animations.module.scss";
import { buttonClassName } from "@/components/ui/buttonStyles";

const WANDERTYPE_ORDER: WandertypeKey[] = [
  "coastal_calm",
  "golden_adventure",
  "city_spark",
  "rainforest_luxe",
  "slow_romance",
  "wild_explorer",
  "balanced_journey",
];

type LandingMarketingSurface = "default" | "night";

function sectionShellClass(surface: LandingMarketingSurface) {
  return surface === "night"
    ? "relative overflow-hidden border-t border-white/10 bg-transparent"
    : "border-t border-stone-200/70 bg-white/55 backdrop-blur-md shadow-sm";
}

function eyebrowClass(surface: LandingMarketingSurface) {
  return surface === "night"
    ? "mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/90"
    : "mb-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary";
}

const inner = "mx-auto max-w-4xl px-4 py-16 md:py-20";

function innerClass(isNight: boolean) {
  return isNight ? `${inner} relative z-10` : inner;
}

function headingClass(surface: LandingMarketingSurface, extra = "") {
  const base =
    surface === "night"
      ? "font-serif text-3xl font-bold tracking-tight text-white md:text-4xl"
      : "font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl";
  return `${base} ${extra}`.trim();
}

type LandingMarketingSectionsProps = {
  /** `night`: headings sit on blue + stars (lower landing column). */
  surface?: LandingMarketingSurface;
};

export function LandingMarketingSections({
  surface = "default",
}: LandingMarketingSectionsProps) {
  const shell = sectionShellClass(surface);
  const eyebrow = eyebrowClass(surface);
  const isNight = surface === "night";

  return (
    <div className={isNight ? "text-stone-100" : "text-stone-900"}>
      <section className={shell}>
        <div className={innerClass(isNight)}>
          <span className={eyebrow}>A different approach</span>
          <h2 className={headingClass(surface, "max-w-xl")}>
            Most travel sites show you everything.
            <br />
            We help you actually decide.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-200/90 bg-white/70 p-6 opacity-60 shadow-sm">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                Every other travel site
              </span>
              <p className="text-sm italic leading-relaxed text-stone-600 line-through decoration-stone-300/80">
                &ldquo;Here are 847 results for Costa Rica. Good luck.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-white/90 p-6 shadow-md ring-1 ring-primary/10">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                VoyageBlitz
              </span>
              <p className="text-sm italic leading-relaxed text-stone-800">
                &ldquo;Based on how you want to feel on this trip, here&apos;s
                exactly where you should go — and why.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200/90 bg-white/70 p-6 opacity-60 shadow-sm">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
                Generic recommendations
              </span>
              <p className="text-sm italic leading-relaxed text-stone-600 line-through decoration-stone-300/80">
                &ldquo;Top 10 destinations for 2026 — curated by our team of
                travel experts.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-white/90 p-6 shadow-md ring-1 ring-primary/10">
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                Your recommendations
              </span>
              <p className="text-sm italic leading-relaxed text-stone-800">
                &ldquo;La Fortuna scores 91% for your group because three of you
                need adventure density and one person needs hot springs
                nearby.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={shell}>
        <div className={innerClass(isNight)}>
          <span className={eyebrow}>How it works</span>
          <h2 className={headingClass(surface)}>
            Feels like a personality quiz.
            <br />
            Secretly very smart.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white/90 p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
              <div className="mb-3 text-5xl font-bold leading-none text-primary/15">
                01
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-primary">
                Tell us everything
              </h3>
              <p className="text-sm italic leading-relaxed text-stone-600">
                Eight questions about how you travel, what you&apos;re craving,
                and who&apos;s coming.{" "}
                <strong className="font-semibold not-italic text-stone-800">
                  No wrong answers.
                </strong>{" "}
                The more honest you are, the better the match.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white/90 p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
              <div className="mb-3 text-5xl font-bold leading-none text-primary/15">
                02
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-primary">
                Meet your Wandertype
              </h3>
              <p className="text-sm italic leading-relaxed text-stone-600">
                We match you to one of{" "}
                <strong className="font-semibold not-italic text-stone-800">
                  7 traveler profiles
                </strong>{" "}
                — then score every destination against what actually matters to
                your group specifically.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-stone-200/90 bg-white/90 p-6 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
              <div className="mb-3 text-5xl font-bold leading-none text-primary/15">
                03
              </div>
              <h3 className="mb-2 font-serif text-lg font-semibold text-primary">
                See your board
              </h3>
              <p className="text-sm italic leading-relaxed text-stone-600">
                A beautiful side-by-side comparison with match scores, tradeoff
                warnings, and{" "}
                <strong className="font-semibold not-italic text-stone-800">
                  everything you need to actually decide.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={shell}>
        <div className={innerClass(isNight)}>
          <span className={eyebrow}>The 7 Wandertypes</span>
          <h2 className={headingClass(surface)}>
            Which kind of traveler are you — really?
          </h2>
          <p
            className={
              isNight
                ? "mt-3 max-w-lg text-base italic text-stone-300"
                : "mt-3 max-w-lg text-base italic text-stone-600"
            }
          >
            Not just &ldquo;beach or mountains.&rdquo; Your actual travel
            personality — the one that determines whether a trip restores you or
            exhausts you.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WANDERTYPE_ORDER.map((key) => {
              const w = WANDERTYPES[key];
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-stone-200/90 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                >
                  <span className="mb-2 block text-3xl" aria-hidden>
                    {w.emoji}
                  </span>
                  <div className="font-serif text-base font-semibold text-stone-900">
                    {w.name}
                  </div>
                  <p className="mt-1 text-xs italic leading-relaxed text-stone-600">
                    &ldquo;{w.subtitle}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/wandertypes"
              className={buttonClassName(
                isNight ? "outlineDark" : "outline",
                "sm",
                "rounded-full px-7 py-2.5 min-h-0 font-semibold",
              )}
            >
              See all 7 Wandertypes →
            </Link>
          </div>
        </div>
      </section>

      <section
        className={`${shell} relative pb-24 pt-16 text-center md:pb-28 md:pt-20`}
      >
        <div
          className={`pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[400px] w-[min(600px,90vw)] -translate-x-1/2 -translate-y-1/2 ${
            isNight
              ? "bg-[radial-gradient(ellipse,rgba(250,204,21,0.18),transparent_70%)]"
              : "bg-[radial-gradient(ellipse,rgba(250,204,21,0.12),transparent_70%)]"
          }`}
          aria-hidden
        />
        <div
          className={`relative z-10 ${inner} flex flex-col items-center`}
        >
          <div className={anim.balloonFloat}>
            <Image
              src={balloonImage}
              alt=""
              width={100}
              height={100}
              className="mx-auto drop-shadow-lg"
            />
          </div>
          <h2 className={headingClass(surface, "mt-6")}>
            Ready to stop overthinking it?
          </h2>
          <p
            className={
              isNight
                ? "mx-auto mt-3 max-w-md text-base italic text-stone-300"
                : "mx-auto mt-3 max-w-md text-base italic text-stone-600"
            }
          >
            Your group chat needs this. Takes 3 minutes. No account required to
            start.
          </p>
          <Link
            href="/survey"
            className={buttonClassName(
              "primary",
              "lg",
              "mt-8 shadow-md",
            )}
          >
            Let&apos;s figure this out →
          </Link>
        </div>
      </section>
    </div>
  );
}
