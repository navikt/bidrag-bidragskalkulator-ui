import type { Applikasjonsside } from "~/types/applikasjonssider";

export const fåApplikasjonsside = (pathname: string): Applikasjonsside => {
  if (pathname.includes("privat-avtale")) {
    return "privat-avtale";
  }

  if (pathname.includes("oversikt")) {
    return "oversikt";
  }

  return "kalkulator";
};
