import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { env } from "process";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import { serverLogger } from "~/utils/logger.server";
import { lagBarnebidragSkjema } from "../schema";
import { kalkulerBidragstype, kalkulerSamværsklasse } from "../utils";
import {
  BarnebidragsutregningSchema,
  type Barnebidragsutregning,
  type Barnebidragsutregningsgrunnlag,
} from "./schema";

export const hentBarnebidragsutregningFraApi = async ({
  requestData,
  språk,
}: {
  requestData: Barnebidragsutregningsgrunnlag;
  språk: Språk;
}): Promise<Barnebidragsutregning | { error: string }> => {
  let response: Response;
  try {
    response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag/åpen`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      },
    );
  } catch {
    serverLogger.error("Kunne ikke kontakte beregnings-API");
    return {
      error: oversett(språk, tekster.feil.beregning),
    };
  }

  if (!response.ok) {
    serverLogger.error("Feil ved beregning av barnebidrag", response.status);
    return {
      error: oversett(språk, tekster.feil.beregning),
    };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    serverLogger.error("Ugyldig JSON fra beregnings-API");
    return {
      error: oversett(språk, tekster.feil.beregning),
    };
  }

  const parsed = BarnebidragsutregningSchema.safeParse(json);
  if (!parsed.success) {
    serverLogger.error("Ugyldig svar fra beregnings-API");
    return {
      error: oversett(språk, tekster.feil.ugyldigSvar),
    };
  }

  return parsed.data;
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

export const hentBarnebidragsutregning = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjema = lagBarnebidragSkjema(språk);
  const parsedFormData = await parseFormData(request, skjema);

  if (parsedFormData.error) {
    return validationError(parsedFormData.error, parsedFormData.submittedData);
  }

  const skjemaData = parsedFormData.data;

  const { inntekt: inntektForelder1 } = skjemaData.deg;
  const { inntekt: inntektForelder2 } = skjemaData.medforelder;

  const requestData: Barnebidragsutregningsgrunnlag = {
    inntektForelder1,
    inntektForelder2,
    dittBoforhold:
      skjemaData.dittBoforhold.borMedAndreBarn !== undefined &&
      skjemaData.dittBoforhold.borMedAnnenVoksen !== undefined
        ? {
            borMedAnnenVoksen: skjemaData.dittBoforhold.borMedAnnenVoksen,
            antallBarnBorFast: skjemaData.dittBoforhold.antallBarnBorFast,
            antallBarnDeltBosted: skjemaData.dittBoforhold.antallBarnDeltBosted,
          }
        : null,
    medforelderBoforhold:
      skjemaData.medforelderBoforhold.borMedAndreBarn !== undefined &&
      skjemaData.medforelderBoforhold.borMedAnnenVoksen !== undefined
        ? {
            borMedAnnenVoksen:
              skjemaData.medforelderBoforhold.borMedAnnenVoksen,
            antallBarnBorFast:
              skjemaData.medforelderBoforhold.antallBarnBorFast,
            antallBarnDeltBosted:
              skjemaData.medforelderBoforhold.antallBarnDeltBosted,
          }
        : null,
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

  return hentBarnebidragsutregningFraApi({
    requestData,
    språk,
  });
};
