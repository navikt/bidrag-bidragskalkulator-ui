import { validationError } from "@rvf/react-router";
import { env } from "~/config/env.server";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import {
  kalkulerBidragstype,
  kalkulerSamværsklasse,
  type Samværsklasse,
} from "./utils";
import { lagValidatorMedSpråk, ResponseSchema } from "./validator";

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

export type BidragsutregningRequest = {
  barn: {
    alder: number;
    samværsklasse: Samværsklasse;
    bidragstype: "MOTTAKER" | "PLIKTIG";
  }[];
  inntektForelder1: number;
  inntektForelder2: number;
};

export async function hentBidragsutregningFraApi({
  requestData,
  språk,
}: {
  requestData: BidragsutregningRequest;
  språk: Språk;
}) {
  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      return {
        error: oversett(språk, tekster.feil.beregning),
      };
    }
    const json = await response.json();
    const parsed = ResponseSchema.safeParse(json);

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
}

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
