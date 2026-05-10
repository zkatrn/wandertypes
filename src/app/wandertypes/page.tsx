import { redirect } from "next/navigation";

/** Legacy path — all WanderTypes content lives at `/types`. */
export default function LegacyWanderTypesRedirect() {
  redirect("/types");
}
