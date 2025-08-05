import { handle as kalkulatorHandle } from "~/routes/kalkulator";
import { handle as oversiktHandle } from "~/routes/oversikt";
import { handle as privatAvtaleHandle } from "~/routes/privat-avtale/layout";
import type { Applikasjonsside } from "~/types/applikasjonssider";
import { oversett, Språk } from "~/utils/i18n";

const brødsmuletekster = {
  kalkulator: kalkulatorHandle.brødsmuler,
  "privat-avtale": privatAvtaleHandle.brødsmuler,
  oversikt: oversiktHandle.brødsmuler,
} as const;

export const lagBrødsmulesti = (språk: Språk, side: Applikasjonsside) => {
  const brødsmuler = brødsmuletekster[side];
  if (!brødsmuler) {
    return [];
  }

  return brødsmuler.map((brødsmule) => ({
    title: oversett(språk, brødsmule.label),
    url: oversett(språk, brødsmule.url),
  }));
};
