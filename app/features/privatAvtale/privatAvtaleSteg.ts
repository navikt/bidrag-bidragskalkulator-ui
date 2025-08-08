import { RouteConfig } from "~/config/routeConfig";
import { definerTekster, oversett, type Språk } from "~/utils/i18n";

type PrivatAvtaleTeksterType = typeof privatAvtaleTekster;
export type StegKey = keyof PrivatAvtaleTeksterType;

export type StegKonfigurasjon = {
  step: number;
  path: string;
  key: StegKey;
};

export type StegdataType = {
  step: number;
  path: string;
  overskrift: string;
};

export const stegKonfigurasjon: StegKonfigurasjon[] = [
  {
    step: 1,
    path: RouteConfig.PRIVAT_AVTALE.STEG_1_FORELDRE,
    key: "omDegOgDenAndreForelderen",
  },
  {
    step: 2,
    path: RouteConfig.PRIVAT_AVTALE.STEG_2_BARN_OG_BIDRAG,
    key: "barnOgBidrag",
  },
  {
    step: 3,
    path: RouteConfig.PRIVAT_AVTALE.STEG_3_AVTALEDETALJER,
    key: "avtaledetaljer",
  },
  {
    step: 4,
    path: RouteConfig.PRIVAT_AVTALE.STEG_4_ANDRE_BESTEMMELSER,
    key: "andreBestemmelser",
  },
  {
    step: 5,
    path: RouteConfig.PRIVAT_AVTALE.STEG_5_OPPSUMMERING_OG_AVTALE,
    key: "oppsummering",
  },
];

export function stegdata(språk: Språk): StegdataType[] {
  return stegKonfigurasjon.map(({ step, path, key }) => ({
    step,
    path,
    overskrift: oversett(språk, privatAvtaleTekster[key].overskrift),
  }));
}

export const privatAvtaleTekster = definerTekster({
  omDegOgDenAndreForelderen: {
    meta: {
      tittel: {
        nb: "Om den andre forelderen - Barnebidrag privat avtale",
        en: "About the other parent - Child support private agreement",
        nn: "Om den andre forelderen - Barnebidrag privat avtale",
      },
      beskrivelse: {
        nb: "Registrer informasjon om den andre forelderen for å lage en privat barnebidragsavtale.",
        en: "Register information about the other parent to create a private child support agreement.",
        nn: "Registrer informasjon om den andre forelderen for å lage ein privat barnebidragsavtale.",
      },
    },
    overskrift: {
      nb: "Om den andre forelderen",
      en: "About the other parent",
      nn: "Om den andre forelderen",
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
  andreBestemmelser: {
    meta: {
      tittel: {
        nb: "Andre bestemmelser - Barnebidrag privat avtale",
        en: "Other Conditions - Child support private agreement",
        nn: "Andre bestemmingar - Barnebidrag privat avtale",
      },
      beskrivelse: {
        nb: "Legg til eventuelle andre bestemmelser som skal gjelde for barnebidragsavtalen.",
        en: "Add any other conditions that will apply to the child support agreement.",
        nn: "Legg til eventuelle andre bestemmingar som skal gjelde for avtala.",
      },
    },
    overskrift: {
      nb: "Andre bestemmelser",
      en: "Other conditions",
      nn: "Andre bestemmingar",
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
