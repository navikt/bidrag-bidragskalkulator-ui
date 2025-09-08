import { definerTekster } from "~/utils/i18n";

export const teksterAvtaledetaljer = definerTekster({
  tittel: {
    nb: "Litt om avtalen",
    nn: "Litt om avtalen",
    en: "About the agreement",
  },
  nyAvtale: {
    label: {
      nb: "Er dette en ny avtale?",
      nn: "Er dette ein ny avtale?",
      en: "Is this a new agreement?",
    },
    true: {
      nb: "Ja",
      nn: "Ja",
      en: "Yes",
    },
    false: {
      nb: "Nei, dette er en endring av en eksisterende avtale",
      nn: "Nei, dette er en endring av en eksisterande avtale",
      en: "No, this is a change to an existing agreement",
    },
  },
  oppgjørsformIdag: {
    label: {
      nb: "Hvilken oppgjørsform har dere i dag?",
      nn: "Kva type oppgjer har de per i dag?",
      en: "What is your current form of settlement?",
    },
    PRIVAT: {
      nb: "Bidraget gjøres opp oss imellom (privat)",
      nn: "Bidraget blir gjort opp oss imellom (privat)",
      en: "Support is settled between us (private)",
    },
    INNKREVING: {
      nb: "Bidraget betales gjennom skatteetaten v/Nav innkreving",
      nn: "Bidraget blir betalt gjennom skatteetaten v/Nav Innkrevjing",
      en: "Support is paid through the Tax Administration/Nav Collection",
    },
  },
  medInnkreving: {
    label: {
      nb: "Hvilken oppgjørsform ønskes?",
      nn: "Kva type oppgjer ønsker de?",
      en: "Which form of settlement do you want?",
    },
    true: {
      nb: "Vi ønsker at bidraget skal betales gjennom Skatteetaten v/Nav Innkreving",
      nn: "Vi ønsker at bidraget skal betalast gjennom Skatteetaten v/Nav Innkreving",
      en: "We want the support to be paid through the Tax Administration/Nav Collection",
    },
    false: {
      nb: "Vi ønsker å gjøre opp bidraget oss i mellom (privat)",
      nn: "Vi ønsker å gjere opp bidraget oss imellom (privat)",
      en: "We want to settle the support between us (private)",
    },
  },
});
