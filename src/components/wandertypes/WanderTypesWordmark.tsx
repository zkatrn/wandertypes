import Link from "next/link";

export function WanderTypesWordmark() {
  return (
    <Link
      href="/"
      aria-label="WanderTypes"
      className="group inline-flex items-center gap-0 font-serif text-xl tracking-tight text-[#ffd97d] transition-opacity hover:opacity-90"
    >
      <img
        src="/favicon.svg"
        alt=""
        width={28}
        height={28}
        className="h-[1.15em] w-[1.15em] shrink-0 -mr-[3px]"
        aria-hidden
      />
      <span
        style={{ textShadow: "0 0 24px rgba(255, 217, 125, 0.35)" }}
      >
        anderTypes
      </span>
    </Link>
  );
}
