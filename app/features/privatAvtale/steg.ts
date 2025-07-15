import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const lagStepperData = (språk: Språk) => [
  {
    step: 1,
    path: "/privat-avtale/steg/foreldre",
    title: oversett(språk, tekster.omDegOgDenAndreForelderen),
  },
  {
    step: 2,
    path: "/privat-avtale/steg/barnebidrag",
    title: oversett(språk, tekster.barnebidrag),
  },
  {
    step: 3,
    path: "/privat-avtale/steg/om-avtale",
    title: oversett(språk, tekster.omAvtale),
  },
  {
    step: 4,
    path: "/privat-avtale/steg/oppsummering",
    title: oversett(språk, tekster.oppsummering),
  },
];

const tekster = definerTekster({
  omDegOgDenAndreForelderen: {
    nb: "Om deg og den andre forelderen",
    en: "About you and the other parent",
    nn: "Om deg og den andre forelderen",
  },
  barnebidrag: {
    nb: "Barnebidrag",
    en: "Child support",
    nn: "Barnebidrag",
  },
  omAvtale: {
    nb: "Om avtalen",
    en: "About the agreement",
    nn: "Om avtala",
  },
  oppsummering: {
    nb: "Oppsummering og generering",
    en: "Summary and generation",
    nn: "Oppsummering og generering",
  },
});
