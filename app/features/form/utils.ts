export type Samværsklasse =
  | "SAMVÆRSKLASSE_0"
  | "SAMVÆRSKLASSE_1"
  | "SAMVÆRSKLASSE_2"
  | "SAMVÆRSKLASSE_3"
  | "SAMVÆRSKLASSE_4"
  | "DELT_BOSTED";

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

export const lagDelingsurl = (formData: {
  barn: Array<{
    alder: string;
    bostatus: string;
    samværsgrad: string;
  }>;
  inntektForelder1: string;
  inntektForelder2: string;
}) => {
  const searchParams = new URLSearchParams();

  formData.barn.forEach((barn, index) => {
    searchParams.append(`barn[${index}].alder`, barn.alder);
    searchParams.append(`barn[${index}].bostatus`, barn.bostatus);
    searchParams.append(`barn[${index}].samværsgrad`, barn.samværsgrad);
  });

  searchParams.append("inntektForelder1", formData.inntektForelder1);
  searchParams.append("inntektForelder2", formData.inntektForelder2);

  return `${window.location.origin}${
    window.location.pathname
  }?${searchParams.toString()}`;
};
