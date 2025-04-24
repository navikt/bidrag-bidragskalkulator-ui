import { useMatches } from "react-router";
import type { Personinformasjon } from "./schema";

export function usePersoninformasjon() {
  const matches = useMatches().find((match) => match.pathname === "/innlogget");
  const data = matches?.data as {
    personinformasjon: Personinformasjon;
  };
  if (!data) {
    throw new Error("Personinformasjon ikke funnet");
  }
  return data.personinformasjon;
}
