import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { hentBidragsutregningFraApi } from "~/features/beregning/api.server";
import type { Bidragsutregningsgrunnlag } from "~/features/beregning/schema";
import { hentSpråkFraCookie } from "~/utils/i18n";
import { getInnloggetSkjema } from "../schema";
import { kalkulerBidragstype, kalkulerSamværsklasse } from "../utils";

export async function hentBidragsutregning(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjema = getInnloggetSkjema(språk);
  const parsedFormData = await parseFormData(request, skjema);

  if (parsedFormData.error) {
    return validationError(parsedFormData.error, parsedFormData.submittedData);
  }

  const skjemaData = parsedFormData.data;
  const inntektForelder1 = skjemaData.inntektDeg;
  const inntektForelder2 = skjemaData.inntektMotpart;

  const requestData: Bidragsutregningsgrunnlag = {
    inntektForelder1,
    inntektForelder2,
    barn: skjemaData.barn.map((barn) => {
      const samværsklasse = kalkulerSamværsklasse(barn.samvær, barn.bosted);
      const bidragstype = kalkulerBidragstype(
        barn.bosted,
        inntektForelder1,
        inntektForelder2
      );

      return {
        alder: barn.alder,
        samværsklasse,
        bidragstype,
      };
    }),
  };

  return hentBidragsutregningFraApi({
    requestData,
    språk,
  });
}
