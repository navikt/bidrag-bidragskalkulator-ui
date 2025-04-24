import type { Barn, Personinformasjon } from "./personinformasjon/schema";
import type { InnloggetBarnSkjema, InnloggetSkjema } from "./schema";

export const SAMVÆR_STANDARDVERDI = "15";

export const tilInnloggetBarnSkjema = (person: Barn): InnloggetBarnSkjema => {
  return {
    ident: person.ident,
    bosted: "",
    samvær: SAMVÆR_STANDARDVERDI,
    alder: String(person.alder),
  };
};

export const getInnloggetSkjemaStandardverdi = (
  personinformasjon: Personinformasjon
): InnloggetSkjema => {
  const harKunEnMotpart = personinformasjon.barnRelasjon.length === 1;

  const motpartIdent = harKunEnMotpart
    ? personinformasjon.barnRelasjon[0].motpart?.ident ?? ""
    : "";

  const barn = harKunEnMotpart
    ? personinformasjon.barnRelasjon[0].fellesBarn.map(tilInnloggetBarnSkjema)
    : [];

  return {
    motpartIdent,
    barn,
    inntektDeg: "",
    motpartInntekt: "",
  };
};

export const finnBarnBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon
) => {
  return personinformasjon.barnRelasjon
    .flatMap((relasjon) => relasjon.fellesBarn)
    .find((barn) => barn.ident === ident);
};

export const finnMotpartBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon
) => {
  return personinformasjon.barnRelasjon.find(
    (relasjon) => relasjon.motpart?.ident === ident
  )?.motpart;
};
