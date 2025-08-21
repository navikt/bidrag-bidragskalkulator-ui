import { env } from "~/config/env.server";
import { summerBidrag } from "~/utils/bidrag";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
  språkTilApiSpråk,
} from "~/utils/i18n";
import {
  PrivatAvtalePersoninformasjonSchema,
  type HentPersoninformasjonForPrivatAvtaleRespons,
  type LagPrivatAvtaleRequest,
} from "./apiSchema";
import { type PrivatAvtaleFlerstegsSkjemaValidert } from "./skjemaSchema";

export const hentPrivatAvtaleFraApi = async ({
  requestData,
  språk,
  token,
}: {
  requestData: LagPrivatAvtaleRequest;
  språk: Språk;
  token: string;
}): Promise<Response> => {
  const response = await fetch(
    `${env.SERVER_URL}/api/v1/privat-avtale/under-18`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/pdf",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    },
  );

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

    console.error(
      `Feil ved generering av privat avtale: ${status} ${response.statusText}`,
    );

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
  token: string,
  request: Request,
) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjemaData: PrivatAvtaleFlerstegsSkjemaValidert = await request.json();

  const bidragstyper = skjemaData.steg2.barn.map((barn) => barn.bidragstype);
  const isMottaker = bidragstyper.includes("MOTTAKER");
  const isPliktig = bidragstyper.includes("PLIKTIG");

  if (isMottaker && isPliktig) {
    console.error("Pliktig og mottaker i samme privat avtale skjema");
    return Promise.reject(oversett(språk, tekster.feil.mottakerOgPliktig));
  }

  const { bidragstype } = summerBidrag(skjemaData.steg2.barn);
  const erBidragsmottaker = bidragstype === "MOTTAKER";

  const deg = {
    ident: skjemaData.steg1.deg.ident,
    etternavn: skjemaData.steg1.deg.etternavn,
    fornavn: skjemaData.steg1.deg.fornavn,
  };

  const medforelder = {
    ident: skjemaData.steg1.medforelder.ident,
    etternavn: skjemaData.steg1.medforelder.etternavn,
    fornavn: skjemaData.steg1.medforelder.fornavn,
  };

  const requestData: LagPrivatAvtaleRequest = {
    språk: språkTilApiSpråk[språk],
    bidragsmottaker: erBidragsmottaker ? deg : medforelder,
    bidragspliktig: erBidragsmottaker ? medforelder : deg,
    oppgjør: {
      nyAvtale: skjemaData.steg3.avtaledetaljer.nyAvtale,
      oppgjørsformØnsket: skjemaData.steg3.avtaledetaljer.medInnkreving
        ? "INNKREVING"
        : "PRIVAT",
      oppgjørsformIdag: skjemaData.steg3.avtaledetaljer.oppgjørsformIdag,
    },
    tilInnsending: skjemaData.steg3.avtaledetaljer.medInnkreving,
    barn: skjemaData.steg2.barn.map((barn) => ({
      ident: barn.ident,
      fornavn: barn.fornavn,
      etternavn: barn.etternavn,
      sumBidrag: barn.sum,
      fraDato: barn.fraDato,
    })),
    andreBestemmelser: {
      harAndreBestemmelser: skjemaData.steg4.erAndreBestemmelser,
      beskrivelse: skjemaData.steg4.andreBestemmelser,
    },
    vedlegg: skjemaData.steg5.harVedlegg
      ? "SENDES_MED_SKJEMA"
      : "INGEN_EKSTRA_DOKUMENTASJON",
  };

  return hentPrivatAvtaleFraApi({
    requestData,
    språk,
    token,
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
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  const parsed = PrivatAvtalePersoninformasjonSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
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
