import { definerTekster, oversett, type Språk } from "~/utils/i18n";

type PrivatAvtaleTeksterType = typeof privatAvtaleTekster;
export type StegKey = keyof PrivatAvtaleTeksterType;

export type StegKonfigurasjon = {
  step: number;
  path: string;
  key: StegKey;
};

export const stegKonfigurasjon: StegKonfigurasjon[] = [
  {
    step: 1,
    path: "privat-avtale/steg/foreldre",
    key: "omDegOgDenAndreForelderen",
  },
  {
    step: 2,
    path: "privat-avtale/steg/barn-og-bidrag",
    key: "barnOgBidrag",
  },
  {
    step: 3,
    path: "privat-avtale/steg/avtaledetaljer",
    key: "avtaledetaljer",
  },
  {
    step: 4,
    path: "privat-avtale/steg/oppsummering-og-avtale",
    key: "oppsummering",
  },
];

export function stegdata(språk: Språk, basename: string) {
  return stegKonfigurasjon.map(({ step, path, key }) => ({
    step,
    path: `${basename}${path}`,
    overskrift: oversett(språk, privatAvtaleTekster[key].overskrift),
  }));
}

export const privatAvtaleTekster = definerTekster({
  omDegOgDenAndreForelderen: {
    meta: {
      tittel: {
        nb: "Om deg og den andre forelderen - Barnebidrag privat avtale",
        en: "About you and the other parent - Child support private agreement",
        nn: "Om deg og den andre forelderen - Barnebidrag privat avtale",
      },
      beskrivelse: {
        nb: "Registrer informasjon om deg og den andre forelderen for å lage en privat barnebidragsavtale.",
        en: "Register information about you and the other parent to create a private child support agreement.",
        nn: "Registrer informasjon om deg og den andre forelderen for å lage ein privat barnebidragsavtale.",
      },
    },
    overskrift: {
      nb: "Om deg og den andre forelderen",
      en: "About you and the other parent",
      nn: "Om deg og den andre forelderen",
    },
  },
  barnOgBidrag: {
    meta: {
      tittel: {
        nb: "Barn og bidrag - Barnebidrag privat avtale",
        en: "Child support - Child support private agreement",
        nn: "Barn og bidrag - Barnebidrag privat avtale",
      },
      beskrivelse: {
        nb: "Registrer informasjon om barnet og velg om du skal motta eller betale barnebidrag.",
        en: "Register information about the child and choose whether you will receive or pay child support.",
        nn: "Registrer informasjon om barnet og vel om du skal motta eller betala barnebidrag.",
      },
    },
    overskrift: {
      nb: "Barn og bidrag",
      en: "Child support",
      nn: "Barn og bidrag",
    },
  },
  avtaledetaljer: {
    meta: {
      tittel: {
        nb: "Avtaledetaljer - Barnebidrag privat avtale",
        en: "Agreement details - Child support private agreement",
        nn: "Avtaledetaljar - Barnebidrag privat avtale",
      },
      beskrivelse: {
        nb: "Fyll ut avtalens detaljer og spesielle vilkår for barnebidragsavtalen.",
        en: "Fill in the agreement details and special conditions for the child support agreement.",
        nn: "Fyll ut avtalens detaljar og spesielle vilkår for barnebidragsavtala.",
      },
    },
    overskrift: {
      nb: "Avtaledetaljer",
      en: "Agreement details",
      nn: "Avtaledetaljar",
    },
  },
  oppsummering: {
    meta: {
      tittel: {
        nb: "Oppsummering og avtale - Barnebidrag privat avtale",
        en: "Summary and agreement - Child support private agreement",
        nn: "Oppsummering og avtale - Barnebidrag privat avtale",
      },
      beskrivelse: {
        nb: "Se over og generer din private barnebidragsavtale.",
        en: "Review and generate your private child support agreement.",
        nn: "Sjå over og generer din private barnebidragsavtale.",
      },
    },
    overskrift: {
      nb: "Oppsummering og avtale",
      en: "Summary and agreement",
      nn: "Oppsummering og avtale",
    },
  },
});
