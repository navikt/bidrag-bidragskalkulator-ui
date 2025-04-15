import type {
  Person,
  PersoninformasjonResponse,
} from "../personinformasjon/schema";
import type { InnloggetBarnSkjema, InnloggetSkjema } from "./schema";

export const SAMVÆR_FORHÅNDSVALGT_VERDI = "15";

export const toBarnFormValue = (person: Person): InnloggetBarnSkjema => {
  return {
    ident: person.ident,
    bosted: "",
    samvær: SAMVÆR_FORHÅNDSVALGT_VERDI,
  };
};

export const getInnloggetFormDefaultValues = (
  personinformasjon: PersoninformasjonResponse
): InnloggetSkjema => {
  const harKunEnMotpart = personinformasjon.barnRelasjon.length === 1;

  const motpartIdent = harKunEnMotpart
    ? personinformasjon.barnRelasjon[0].motpart?.ident ?? ""
    : "";

  const barn = harKunEnMotpart
    ? personinformasjon.barnRelasjon[0].fellesBarn.map(toBarnFormValue)
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
  personinformasjon: PersoninformasjonResponse
) => {
  return personinformasjon.barnRelasjon
    .flatMap((relasjon) => relasjon.fellesBarn)
    .find((barn) => barn.ident === ident);
};

export const finnMotpartBasertPåIdent = (
  ident: string,
  personinformasjon: PersoninformasjonResponse
) => {
  return personinformasjon.barnRelasjon.find(
    (relasjon) => relasjon.motpart?.ident === ident
  )?.motpart;
};
