import { useLoaderData } from "react-router";
import { PersoninformasjonSchema, type Personinformasjon } from "./schema";

export function usePersoninformasjon(): Personinformasjon {
  const data = useLoaderData();

  if (!data) {
    throw new Error("Loader data ikke funnet");
  }

  const parsed = PersoninformasjonSchema.safeParse(data?.personinformasjon);

  if (!parsed.success) {
    throw new Error("Personinformasjon er ikke gyldig");
  }

  return parsed.data;
}
