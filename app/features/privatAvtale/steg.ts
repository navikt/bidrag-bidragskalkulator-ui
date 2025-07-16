import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const lagStepperData = (språk: Språk) => [
  {
    step: 1,
    path: "/barnebidrag/tjenester/privat-avtale/steg/foreldre",
    title: oversett(språk, tekster.omDegOgDenAndreForelderen),
  },
  {
    step: 2,
    path: "/barnebidrag/tjenester/privat-avtale/steg/barnebidrag",
    title: oversett(språk, tekster.barnebidrag),
  },
  {
    step: 3,
    path: "/barnebidrag/tjenester/privat-avtale/steg/avtaledetaljer",
    title: oversett(språk, tekster.avtaledetaljer),
  },
  {
    step: 4,
    path: "/barnebidrag/tjenester/privat-avtale/steg/oppsummering",
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
  avtaledetaljer: {
    nb: "Avtaledetaljer",
    en: "Agreement details",
    nn: "Avtaledetaljar",
  },
  oppsummering: {
    nb: "Oppsummering og generering",
    en: "Summary and generation",
    nn: "Oppsummering og generering",
  },
});
