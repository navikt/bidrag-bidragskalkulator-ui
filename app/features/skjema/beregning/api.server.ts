import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { env } from "process";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import { lagManueltSkjema } from "../schema";
import { kalkulerBidragstype, kalkulerSamværsklasse } from "../utils";
import {
  ManuellBidragsutregningSchema,
  type ManuellBidragsutregning,
  type ManueltBidragsutregningsgrunnlag,
} from "./schema";

export const hentManuellBidragsutregningFraApi = async ({
  requestData,
  språk,
}: {
  requestData: ManueltBidragsutregningsgrunnlag;
  språk: Språk;
}): Promise<ManuellBidragsutregning | { error: string }> => {
  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag/åpen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );

    if (!response.ok) {
      console.error(await response.text());
      return {
        error: oversett(språk, tekster.feil.beregning),
      };
    }
    const json = await response.json();
    const parsed = ManuellBidragsutregningSchema.safeParse(json);

    if (!parsed.success) {
      return {
        error: oversett(språk, tekster.feil.ugyldigSvar),
      };
    }

    return parsed.data;
  } catch (error) {
    console.error(error);
    return {
      error: oversett(språk, tekster.feil.beregning),
    };
  }
};

const tekster = definerTekster({
  feil: {
    beregning: {
      nb: "Det oppstod en feil under beregningen. Vennligst prøv igjen.",
      en: "An error occurred during calculation. Please try again.",
      nn: "Det oppstod ein feil under utrekninga. Ver venleg og prøv igjen.",
    },
    ugyldigSvar: {
      nb: "Vi mottok et ugyldig svar fra beregningsmotoren. Vennligst prøv igjen.",
      en: "We received an invalid response from the calculation engine. Please try again.",
      nn: "Vi mottok eit ugyldig svar frå utrekningsmotoren. Ver venleg og prøv igjen.",
    },
  },
});

export const hentManuellBidragsutregning = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjema = lagManueltSkjema(språk);
  const parsedFormData = await parseFormData(request, skjema);

  if (parsedFormData.error) {
    return validationError(parsedFormData.error, parsedFormData.submittedData);
  }

  const skjemaData = parsedFormData.data;

  const { inntekt: inntektForelder1, ...dittBoforhold } =
    parsedFormData.data.deg;
  const { inntekt: inntektForelder2, ...medforelderBoforhold } =
    parsedFormData.data.medforelder;

  const requestData: ManueltBidragsutregningsgrunnlag = {
    inntektForelder1,
    inntektForelder2,
    dittBoforhold,
    medforelderBoforhold,
    barn: skjemaData.barn.map((barn) => {
      const samværsklasse = kalkulerSamværsklasse(barn.samvær, barn.bosted);
      const bidragstype = kalkulerBidragstype(
        barn.bosted,
        inntektForelder1,
        inntektForelder2,
      );

      return {
        alder: barn.alder,
        samværsklasse,
        bidragstype,
        barnetilsynsutgift: barn.barnetilsynsutgift ?? 0,
      };
    }),
  };

  return hentManuellBidragsutregningFraApi({
    requestData,
    språk,
  });
};
