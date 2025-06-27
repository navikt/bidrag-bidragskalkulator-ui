import { env } from "process";

import { fåSummertBidrag } from "~/utils/bidrag";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import type { LagPrivatAvtaleRequest } from "./apiSchema";
import { type PrivatAvtaleSkjemaValidert } from "./skjemaSchema";

export const hentPrivatAvtaleFraApi = async ({
  requestData,
  språk,
}: {
  requestData: LagPrivatAvtaleRequest;
  språk: Språk;
  token: string;
}): Promise<Response | { error: string }> => {
  try {
    const response = await fetch(`${env.SERVER_URL}/api/v1/privat-avtale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      return {
        error: oversett(språk, tekster.feil.genererePdf),
      };
    }

    return response;
  } catch (error) {
    console.error(error);
    return {
      error: oversett(språk, tekster.feil.genererePdf),
    };
  }
};

export const hentPrivatAvtaledokument = async (
  token: string,
  request: Request,
) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjemaData: PrivatAvtaleSkjemaValidert = await request.json();

  const bidragstyper = skjemaData.barn.map((barn) => barn.bidragstype);
  const isMottaker = bidragstyper.includes("MOTTAKER");
  const isPliktig = bidragstyper.includes("PLIKTIG");

  if (isMottaker && isPliktig) {
    // TODO Håndtere pliktig og mottaker i samme avtale
    throw new Error("Kan ikke være både mottaker og pliktig");
  }

  const { bidragstype } = fåSummertBidrag(skjemaData.barn);
  const erBidragsmottaker = bidragstype === "MOTTAKER";

  const deg = {
    fodselsnummer: skjemaData.deg.ident,
    fornavn: skjemaData.deg.fornavn,
    etternavn: skjemaData.deg.etternavn,
  };

  const medforelder = {
    fodselsnummer: skjemaData.medforelder.ident,
    fornavn: skjemaData.medforelder.fornavn,
    etternavn: skjemaData.medforelder.etternavn,
  };

  const requestData: LagPrivatAvtaleRequest = {
    innhold: "", // TODO
    bidragsmottaker: erBidragsmottaker ? deg : medforelder,
    bidragspliktig: erBidragsmottaker ? medforelder : deg,
    fraDato: skjemaData.fraDato,
    nyAvtale: skjemaData.nyAvtale,
    oppgjorsform: skjemaData.medInnkreving ? "Innkreving" : "Privat",
    barn: skjemaData.barn.map((barn) => {
      return {
        fodselsnummer: barn.ident,
        fornavn: barn.fornavn,
        etternavn: barn.etternavn,
        sumBidrag: barn.sum,
      };
    }),
  };

  return hentPrivatAvtaleFraApi({
    requestData,
    språk,
    token,
  });
};

const tekster = definerTekster({
  feil: {
    genererePdf: {
      nb: "Det oppstod en feil. Vennligst prøv igjen.",
      en: "An error occurred. Please try again.",
      nn: "Det oppstod ein feil. Ver venleg og prøv igjen.",
    },
  },
});
