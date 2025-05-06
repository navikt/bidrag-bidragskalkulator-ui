import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { env } from "process";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import { getInnloggetSkjema } from "../schema";
import { kalkulerBidragstype, kalkulerSamværsklasse } from "../utils";
import {
  BidragsutregningSchema,
  type Bidragsutregning,
  type Bidragsutregningsgrunnlag,
} from "./schema";

export const hentBidragsutregningFraApi = async ({
  requestData,
  språk,
  token,
}: {
  requestData: Bidragsutregningsgrunnlag;
  språk: Språk;
  token: string;
}): Promise<Bidragsutregning | { error: string }> => {
  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      },
    );

    if (!response.ok) {
      return {
        error: oversett(språk, tekster.feil.beregning),
      };
    }
    const json = await response.json();
    const parsed = BidragsutregningSchema.safeParse(json);

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

export const hentBidragsutregning = async (token: string, request: Request) => {
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
        barn.samvær,
        inntektForelder1,
        inntektForelder2,
      );

      return {
        ident: barn.ident,
        samværsklasse,
        bidragstype,
      };
    }),
  };

  return hentBidragsutregningFraApi({
    requestData,
    språk,
    token,
  });
};
