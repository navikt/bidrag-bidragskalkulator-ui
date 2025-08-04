import type { Applikasjonsside } from "~/types/applikasjonssider";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const fåBrødsmulesti = (
  språk: Språk,
  side: Applikasjonsside,
): { title: string; url: string }[] => {
  if (side === "oversikt") {
    return [
      {
        title: oversett(språk, breadcrumbTekster["min-side"].label),
        url: oversett(språk, breadcrumbTekster["min-side"].url),
      },
      {
        title: oversett(språk, breadcrumbTekster[side].label),
        url: `/barnebidrag/tjenester/${side}`,
      },
    ];
  }
  return [
    {
      title: oversett(språk, breadcrumbTekster.barnebidrag.label),
      url: oversett(språk, breadcrumbTekster.barnebidrag.url),
    },
    {
      title: oversett(språk, breadcrumbTekster[side].label),
      url: `/barnebidrag/tjenester/${side}`,
    },
  ];
};

export const breadcrumbTekster = definerTekster({
  barnebidrag: {
    label: {
      nb: "Barnebidrag",
      en: "Child support",
      nn: "Fostringstilskot",
    },
    url: {
      nb: "https://www.nav.no/barnebidrag",
      en: "https://www.nav.no/barnebidrag/en",
      nn: "https://www.nav.no/barnebidrag",
    },
  },
  "min-side": {
    label: {
      nb: "Min side",
      en: "My page",
      nn: "Mi side",
    },
    url: {
      nb: "https://www.nav.no/minside",
      en: "https://www.nav.no/minside/en",
      nn: "https://www.nav.no/minside/nn",
    },
  },
  kalkulator: {
    label: {
      nb: "Barnebidragskalkulator",
      en: "Child support calculator",
      nn: "Fostringstilskotskalkulator",
    },
  },
  "privat-avtale": {
    label: {
      nb: "Privat avtale",
      en: "Private agreement",
      nn: "Privat avtale",
    },
  },
  oversikt: {
    label: {
      nb: "Barnebidrag",
      en: "Child support",
      nn: "Fostringstilskot",
    },
  },
});
