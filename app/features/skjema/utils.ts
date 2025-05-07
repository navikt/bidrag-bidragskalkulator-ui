import type { Samværsklasse } from "./beregning/schema";
import type { Barn, Personinformasjon } from "./personinformasjon/schema";
import type {
  FastBosted,
  InnloggetBarnSkjema,
  InnloggetSkjema,
} from "./schema";

export const SAMVÆR_STANDARDVERDI = "15";

/**
 * Aldersgrupper som tilsvarer gruppering brukt i underholdskostnader
 */
type Aldersgruppe = "0-5" | "6-10" | "11-14" | "15+";

export const tilInnloggetBarnSkjema = (person: Barn): InnloggetBarnSkjema => {
  return {
    ident: person.ident,
    bosted: "",
    samvær: SAMVÆR_STANDARDVERDI,
  };
};

export const getInnloggetSkjemaStandardverdi = (
  personinformasjon: Personinformasjon,
): InnloggetSkjema => {
  const harKunEnMotpart = personinformasjon.barnerelasjoner.length === 1;

  const motpartIdent = harKunEnMotpart
    ? (personinformasjon.barnerelasjoner[0].motpart?.ident ?? "")
    : "";

  const barn = harKunEnMotpart
    ? personinformasjon.barnerelasjoner[0].fellesBarn.map(
        tilInnloggetBarnSkjema,
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
  bostatus: FastBosted,
): Samværsklasse {
  if (bostatus === "DELT_FAST_BOSTED") {
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
  bostatus: FastBosted,
  samvær: number,
  inntektForelder1: number,
  inntektForelder2: number,
): "MOTTAKER" | "PLIKTIG" {
  if (bostatus === "DELT_FAST_BOSTED") {
    return inntektForelder1 > inntektForelder2 ? "PLIKTIG" : "MOTTAKER";
  }
  return samvær >= 15 ? "MOTTAKER" : "PLIKTIG";
}

export const finnBarnBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon,
) => {
  return personinformasjon.barnerelasjoner
    .flatMap((relasjon) => relasjon.fellesBarn)
    .find((barn) => barn.ident === ident);
};

export const finnMotpartBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon,
) => {
  return personinformasjon.barnerelasjoner.find(
    (relasjon) => relasjon.motpart?.ident === ident,
  )?.motpart;
};

export const finnAldersgruppe = (alder: number): Aldersgruppe => {
  if (alder <= 5) {
    return "0-5";
  }
  if (alder <= 10) {
    return "6-10";
  }
  if (alder <= 14) {
    return "11-14";
  }
  return "15+";
};

/**
 * Finner det nærmeste avrundede tallet basert på tierpotens
 * @param tall Tallet som skal avrundes
 * @param tierpotens Bestemmer hvilken tierpotens som skal brukes for avrunding
 * @returns Det nærmeste avrundede tallet
 * @example
 * // Avrunder 1234 til nærmeste 10
 * finnAvrundetTall(1234, 1); // 1230
 * // Avrunder 1234 til nærmeste 1000
 * finnAvrundetTall(1234, 3); // 1000
 */
export const finnAvrundetTall = (tall: number, tierpotens: number) => {
  const factor = Math.pow(10, tierpotens);
  return Math.round(tall / factor) * factor;
};
