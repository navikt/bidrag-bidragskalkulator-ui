import { env } from "~/config/env.server";
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
  token,
}: {
  requestData: LagPrivatAvtaleRequest;
  språk: Språk;
  token: string;
}): Promise<Response> => {
  const response = await fetch(`${env.SERVER_URL}/api/v1/privat-avtale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/pdf",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    console.error(
      `Feil ved generering av privat avtale: ${response.status} ${response.statusText}`,
    );
    return Promise.reject(oversett(språk, tekster.feil.genererePdf));
  }

  return response;
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
    console.error("Pliktig og mottaker i samme privat avtale skjema");
    return Promise.reject(oversett(språk, tekster.feil.mottakerOgPliktig));
  }

  const { bidragstype } = fåSummertBidrag(skjemaData.barn);
  const erBidragsmottaker = bidragstype === "MOTTAKER";

  const deg = {
    fodselsnummer: skjemaData.deg.ident,
    fulltNavn: skjemaData.deg.fulltNavn,
    etternavn: skjemaData.deg.fulltNavn,
    fornavn: skjemaData.deg.fulltNavn,
  };

  const medforelder = {
    fodselsnummer: skjemaData.medforelder.ident,
    fulltNavn: skjemaData.medforelder.fulltNavn,
    etternavn: skjemaData.medforelder.fulltNavn,
    fornavn: skjemaData.medforelder.fulltNavn,
  };

  const requestData: LagPrivatAvtaleRequest = {
    innhold: "", // TODO
    bidragsmottaker: erBidragsmottaker ? deg : medforelder,
    bidragspliktig: erBidragsmottaker ? medforelder : deg,
    fraDato: skjemaData.fraDato,
    nyAvtale: skjemaData.nyAvtale,
    oppgjorsform: skjemaData.medInnkreving ? "Innkreving" : "Privat",
    tilInnsending: skjemaData.medInnkreving,
    barn: skjemaData.barn.map((barn) => {
      return {
        fodselsnummer: barn.ident,
        fulltNavn: barn.fulltNavn,
        fornavn: barn.fulltNavn,
        etternavn: barn.fulltNavn,
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
    mottakerOgPliktig: {
      nb: "Kan ikke være både mottaker og pliktig i samme skjema.",
      en: "Cannot be both recipient and liable in the same form.",
      nn: "Kan ikkje vere både mottakar og pliktig i same skjema.",
    },
    genererePdf: {
      nb: "Det oppstod en feil. Vennligst prøv igjen.",
      en: "An error occurred. Please try again.",
      nn: "Det oppstod ein feil. Ver venleg og prøv igjen.",
    },
  },
});
