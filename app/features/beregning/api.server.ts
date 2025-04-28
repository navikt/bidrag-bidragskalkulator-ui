import { env } from "process";
import { definerTekster, oversett, Språk } from "~/utils/i18n";
import {
  Bidragsutregningskjema,
  type Bidragsutregning,
  type Bidragsutregningsgrunnlag,
} from "./schema";

export const hentBidragsutregningFraApi = async ({
  requestData,
  språk,
}: {
  requestData: Bidragsutregningsgrunnlag;
  språk: Språk;
}): Promise<Bidragsutregning | { error: string }> => {
  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    const parsed = Bidragsutregningskjema.safeParse(json);

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
