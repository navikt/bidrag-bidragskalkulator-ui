export type Samværsklasse =
  | "SAMVÆRSKLASSE_1"
  | "SAMVÆRSKLASSE_2"
  | "SAMVÆRSKLASSE_3"
  | "SAMVÆRSKLASSE_4"
  | "DELT_BOSTED";

/**
 * Kalkulerer samværsklasse basert på hvor mange netter barnet bor hos forelderen
 */
export function kalkulerSamværsklasse(samværsgrad: number): Samværsklasse {
  if (samværsgrad <= 3 || samværsgrad >= 27) {
    return "SAMVÆRSKLASSE_1";
  }
  if (samværsgrad <= 8 || samværsgrad >= 22) {
    return "SAMVÆRSKLASSE_2";
  }
  if (samværsgrad <= 13 || samværsgrad >= 17) {
    return "SAMVÆRSKLASSE_3";
  }
  if (samværsgrad === 15) {
    return "DELT_BOSTED";
  }
  return "SAMVÆRSKLASSE_4";
}

/**
 * Genererer en tekstlig beskrivelse av samværsgraden
 */
export function lagSamværsgradbeskrivelse(samværsgrad: number): string {
  if (samværsgrad === 1) {
    return "1 natt";
  }
  return `${samværsgrad} netter`;
}

/**
 * Avgjør om forelderen er mottaker eller pliktig basert på samværsgrad
 */
export function kalkulerBidragstype(
  inntektForelder1: number,
  inntektForelder2: number,
  samværsgrad: number
): "MOTTAKER" | "PLIKTIG" {
  if (samværsgrad >= 15) {
    return "MOTTAKER";
  }
  return "PLIKTIG";
}
