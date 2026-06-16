import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { env } from "process";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import {
  lagBarnebidragSkjema,
  type BarnebidragSkjemaValidert,
} from "../schema";
import { kalkulerSamværsklasse } from "../utils";
import {
  BarnebidragsutregningSchema,
  type Barnebidragsutregning,
  type Barnebidragsutregningsgrunnlag,
  type Boforhold,
} from "./schema";

type InntektSkjema = BarnebidragSkjemaValidert["deg"];
type BoforholdSkjema = BarnebidragSkjemaValidert["dittBoforhold"];

const lagInntektGrunnlag = (inntekt: InntektSkjema) => ({
  inntekt: inntekt.inntekt,
  nettoPositivKapitalinntekt: inntekt.harKapitalinntektOver10k
    ? inntekt.kapitalinntekt
    : 0,
});

const lagBoforholdGrunnlag = (boforhold: BoforholdSkjema): Boforhold | null => {
  return {
    antallBarnUnder18BorFast: boforhold.antallBarnUnder18,
    voksneOver18Type: boforhold.voksneOver18Type,
    antallBarnOver18Vgs: boforhold.antallBarnOver18Vgs,
  };
};

export const hentBarnebidragsutregningFraApi = async ({
  requestData,
  språk,
}: {
  requestData: Barnebidragsutregningsgrunnlag;
  språk: Språk;
}): Promise<Barnebidragsutregning | { error: string }> => {
  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag/åpen`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      },
    );

    if (!response.ok) {
      console.error(await response.text());
      return { error: oversett(språk, tekster.feil.beregning) };
    }

    const json = await response.json();
    const parsed = BarnebidragsutregningSchema.safeParse(json);

    if (!parsed.success) {
      return { error: oversett(språk, tekster.feil.ugyldigSvar) };
    }

    return parsed.data;
  } catch (error) {
    console.error(error);
    return { error: oversett(språk, tekster.feil.beregning) };
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

export const hentBarnebidragsutregning = async (request: Request) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjema = lagBarnebidragSkjema(språk);
  const parsedFormData = await parseFormData(request, skjema);

  if (parsedFormData.error) {
    return validationError(parsedFormData.error, parsedFormData.submittedData);
  }

  const {
    bidragstype,
    deg,
    medforelder,
    dittBoforhold,
    medforelderBoforhold,
    ytelser,
    barn,
    barnHarEgenInntekt,
  } = parsedFormData.data;

  const erMottaker = bidragstype === "MOTTAKER";

  const requestData: Barnebidragsutregningsgrunnlag = {
    bidragstype,
    bidragsmottakerInntekt: lagInntektGrunnlag(erMottaker ? deg : medforelder),
    bidragspliktigInntekt: lagInntektGrunnlag(erMottaker ? medforelder : deg),
    dittBoforhold: erMottaker ? null : lagBoforholdGrunnlag(dittBoforhold),
    medforelderBoforhold: erMottaker
      ? lagBoforholdGrunnlag(medforelderBoforhold)
      : null,
    småbarnstillegg: ytelser.mottarSmåbarnstillegg === true,
    utvidetBarnetrygd: {
      harUtvidetBarnetrygd: ytelser.mottarUtvidetBarnetrygd === true,
      delerMedMedforelder: ytelser.delerUtvidetBarnetrygd === true,
    },
    barn: barn.map((b) => ({
      fødselsdato: b.fødselsdato,
      samværsklasse: kalkulerSamværsklasse(b.samvær, b.bosted),
      barnetilsyn: {
        plassType:
          b.harBarnetilsynsutgift && b.mottarStønadTilBarnetilsyn
            ? b.barnepassSituasjon
            : null,
        månedligUtgift:
          b.harBarnetilsynsutgift && !b.mottarStønadTilBarnetilsyn
            ? b.barnetilsynsutgift
            : null,
      },
      inntekt: barnHarEgenInntekt ? b.inntektPerMåned : 0,
      kontantstøtte: ytelser.kontantstøtte.mottar
        ? {
            beløp: ytelser.kontantstøtte.beløp,
            deles: ytelser.kontantstøtte.deler,
          }
        : null,
    })),
  };

  return hentBarnebidragsutregningFraApi({ requestData, språk });
};
