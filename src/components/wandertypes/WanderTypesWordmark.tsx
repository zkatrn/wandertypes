import Link from "next/link";

export function WanderTypesWordmark() {
  return (
    <Link
      href="/"
      className="font-serif text-xl tracking-tight text-[#ffd97d] transition-opacity hover:opacity-90"
      style={{ textShadow: "0 0 24px rgba(255, 217, 125, 0.35)" }}
    >
      WanderTypes
    </Link>
  );
}
