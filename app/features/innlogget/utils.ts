import type { Samværsklasse } from "../beregning/schema";
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
  const harKunEnMotpart = personinformasjon.barnerelasjoner.length === 1;

  const motpartIdent = harKunEnMotpart
    ? (personinformasjon.barnerelasjoner[0].motpart?.ident ?? "")
    : "";

  const barn = harKunEnMotpart
    ? personinformasjon.barnerelasjoner[0].fellesBarn.map(
        tilInnloggetBarnSkjema
      )
    : [];

  return {
    motpartIdent,
    barn,
    inntektDeg: String(personinformasjon.inntekt ?? ""),
    inntektMotpart: "",
  };
};

/**
 * Kalkulerer samværsklasse basert på hvor mange netter barnet bor hos forelderen
 */
export function kalkulerSamværsklasse(
  samværsgrad: number,
  bostatus: string
): Samværsklasse {
  if (bostatus === "DELT_BOSTED") {
    return "DELT_BOSTED";
  }
  if (samværsgrad === 0 || samværsgrad === 30) {
    return "SAMVÆRSKLASSE_0";
  }
  if (samværsgrad <= 3 || samværsgrad >= 27) {
    return "SAMVÆRSKLASSE_1";
  }
  if (samværsgrad <= 8 || samværsgrad >= 22) {
    return "SAMVÆRSKLASSE_2";
  }
  if (samværsgrad <= 13 || samværsgrad >= 17) {
    return "SAMVÆRSKLASSE_3";
  }
  return "SAMVÆRSKLASSE_4";
}

/**
 * Avgjør om forelderen er mottaker eller pliktig basert på samværsgrad
 */
export function kalkulerBidragstype(
  bostatus: "HOS_FORELDER_1" | "HOS_FORELDER_2" | "DELT_BOSTED",
  inntektForelder1: number,
  inntektForelder2: number
): "MOTTAKER" | "PLIKTIG" {
  if (bostatus === "DELT_BOSTED") {
    return inntektForelder1 > inntektForelder2 ? "PLIKTIG" : "MOTTAKER";
  }
  return bostatus === "HOS_FORELDER_1" ? "MOTTAKER" : "PLIKTIG";
}

export const finnBarnBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon
) => {
  return personinformasjon.barnerelasjoner
    .flatMap((relasjon) => relasjon.fellesBarn)
    .find((barn) => barn.ident === ident);
};

export const finnMotpartBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon
) => {
  return personinformasjon.barnerelasjoner.find(
    (relasjon) => relasjon.motpart?.ident === ident
  )?.motpart;
};
