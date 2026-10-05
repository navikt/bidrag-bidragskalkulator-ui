import { env } from "~/config/env.server";
import { summerBidrag } from "~/utils/bidrag";
import { tilNorskDatoFormat } from "~/utils/dato";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
  språkTilApiSpråk,
} from "~/utils/i18n";
import { serverLogger } from "~/utils/logger.server";
import {
  PrivatAvtalePersoninformasjonSchema,
  type HentPersoninformasjonForPrivatAvtaleRespons,
  type LagPrivatAvtaleRequest,
} from "./apiSchema";
import { type PrivatAvtaleFlerstegsSkjemaValidert } from "./skjemaSchema";

export const hentPrivatAvtaleFraApi = async ({
  requestData,
  språk,
}: {
  requestData: LagPrivatAvtaleRequest;
  språk: Språk;
}): Promise<Response> => {
  const response = await fetch(
    `${env.SERVER_URL}/api/v1/privat-avtale/under-18`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
      body: JSON.stringify(requestData),
    },
  ).catch(() => {
    serverLogger.error("Kunne ikke kontakte API for privat avtale");
    throw new Error("Kunne ikke generere privat avtale");
  });

  if (!response.ok) {
    const status = response.status;

    let feilmelding;
    if (status === 502) {
      // Metaforce-feil
      feilmelding = oversett(språk, tekster.feil.metaforce);
    } else {
      // Generell feil
      feilmelding = oversett(språk, tekster.feil.genererePdf);
    }

    serverLogger.error("Feil ved generering av privat avtale", status);

    return new Response(feilmelding, {
      status,
      statusText: response.statusText,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  return response;
};

export const hentPrivatAvtaledokument = async (
  request: Request,
  skjemadata: PrivatAvtaleFlerstegsSkjemaValidert,
) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);

  const bidragstyper = skjemadata.steg3.barn.map((barn) => barn.bidragstype);
  const isMottaker = bidragstyper.includes("MOTTAKER");
  const isPliktig = bidragstyper.includes("PLIKTIG");

  if (isMottaker && isPliktig) {
    serverLogger.error("Pliktig og mottaker i samme privat avtale skjema");
    return Promise.reject(oversett(språk, tekster.feil.mottakerOgPliktig));
  }

  const { bidragstype } = summerBidrag(skjemadata.steg3.barn);
  const erBidragsmottaker = bidragstype === "MOTTAKER";

  const deg = {
    ident: skjemadata.steg1.deg.ident,
    etternavn: skjemadata.steg1.deg.etternavn,
    fornavn: skjemadata.steg1.deg.fornavn,
  };

  const medforelder = {
    ident: skjemadata.steg2.medforelder.ident,
    etternavn: skjemadata.steg2.medforelder.etternavn,
    fornavn: skjemadata.steg2.medforelder.fornavn,
  };

  const requestData: LagPrivatAvtaleRequest = {
    språk: språkTilApiSpråk[språk],
    bidragstype: erBidragsmottaker ? "MOTTAKER" : "PLIKTIG",
    bidragsmottaker: erBidragsmottaker ? deg : medforelder,
    bidragspliktig: erBidragsmottaker ? medforelder : deg,
    oppgjør: {
      nyAvtale: skjemadata.steg4.avtaledetaljer.nyAvtale === "true",
      oppgjørsformØnsket: skjemadata.steg4.avtaledetaljer.medInnkreving
        ? "INNKREVING"
        : "PRIVAT",
      oppgjørsformIdag:
        skjemadata.steg4.avtaledetaljer.oppgjørsformIdag || undefined,
    },
    tilInnsending: skjemadata.steg4.avtaledetaljer.medInnkreving === "true",
    barn: skjemadata.steg3.barn.map((barn) => ({
      ident: barn.ident,
      fornavn: barn.fornavn,
      etternavn: barn.etternavn,
      sumBidrag: barn.sum,
      fraDato: tilNorskDatoFormat(barn.fraDato),
    })),
    andreBestemmelser: {
      harAndreBestemmelser: skjemadata.steg5.erAndreBestemmelser,
      beskrivelse: skjemadata.steg5.andreBestemmelser,
    },
    vedlegg: skjemadata.steg6.harVedlegg
      ? "SENDES_MED_SKJEMA"
      : "INGEN_EKSTRA_DOKUMENTASJON",
  };

  return hentPrivatAvtaleFraApi({
    requestData,
    språk,
  });
};

export const hentPersoninformasjonForPrivatAvtale = async (
  token: string,
): Promise<HentPersoninformasjonForPrivatAvtaleRespons> => {
  const response = await fetch(
    `${env.SERVER_URL}/api/v1/privat-avtale/informasjon`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).catch(() => {
    serverLogger.error("Kunne ikke kontakte API for personinformasjon");
    throw new Error("Kunne ikke hente personinformasjon");
  });

  if (!response.ok) {
    serverLogger.error(
      "Feil ved henting av personinformasjon",
      response.status,
    );
    throw new Error("Kunne ikke hente personinformasjon");
  }

  const data = await response.json().catch(() => {
    serverLogger.error("Ugyldig JSON fra API for personinformasjon");
    throw new Error("Ugyldig svar ved henting av personinformasjon");
  });
  const parsed = PrivatAvtalePersoninformasjonSchema.safeParse(data);

  if (!parsed.success) {
    serverLogger.error("Ugyldig svar fra API for personinformasjon");
    throw new Error("Ugyldig svar ved henting av personinformasjon");
  }

  return parsed.data;
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
    metaforce: {
      nb: "Det er for tiden en teknisk feil med dokumenttjenesten. Prøv igjen senere.",
      en: "There is currently a technical error with the document service. Please try again later.",
      nn: "Det er for tida ein teknisk feil med dokumenttenesta. Prøv igjen seinare.",
    },
  },
});
