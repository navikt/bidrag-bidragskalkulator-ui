import { validationError } from "@rvf/react-router";
import { hentSpråkFraCookie } from "~/utils/i18n";
import { kalkulerBidragstype, kalkulerSamværsklasse } from "./utils";
import { lagValidatorMedSpråk } from "./validator";
import { hentBidragsutregningFraApi } from "../beregning/api.server";

export async function handleFormSubmission(
  formData: FormData,
  cookieHeader?: string | null
) {
  const språk = hentSpråkFraCookie(cookieHeader || null);
  const validator = lagValidatorMedSpråk(språk);
  const result = await validator.validate(formData);

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const requestData = {
    ...result.data,
    barn: result.data.barn.map((barn) => ({
      alder: barn.alder,
      samværsklasse: kalkulerSamværsklasse(barn.samværsgrad, barn.bostatus),
      bidragstype: kalkulerBidragstype(
        barn.bostatus,
        result.data.inntektForelder1,
        result.data.inntektForelder2
      ),
    })),
  };

  return hentBidragsutregningFraApi({
    requestData,
    språk,
  });
}
