import { parseFormData } from "@rvf/react";
import { validationError } from "@rvf/react-router";
import { env } from "process";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  Språk,
} from "~/utils/i18n";
import type { LagPrivatAvtaleRequest } from "./apiSchema";
import { lagPrivatAvtaleSkjemaSchema } from "./skjemaSchema";

export const hentPrivatAvtaleFraApi = async ({
  requestData,
  språk,
  token,
}: {
  requestData: LagPrivatAvtaleRequest;
  språk: Språk;
  token: string; // TODO
}): Promise<{ error: string } | undefined> => {
  console.log("requestData", requestData);
  try {
    const response = await fetch(`${env.SERVER_URL}/api/v1/privatavtale`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    console.log("Privat avtale response:", response);

    if (!response.ok) {
      const yyy = await response.json();

      console.error("Privat avtale error:", yyy);
      return {
        error: oversett(språk, tekster.feil.beregning),
      };
    }

    // Download the pdf file
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "privatavtale.pdf"); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    // Return a success message or object

    return;
  } catch (error) {
    console.error(error);
    return {
      error: oversett(språk, tekster.feil.beregning),
    };
  }
};

export const hentPrivatAvtaledokument = async (
  token: string,
  request: Request,
) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const skjema = lagPrivatAvtaleSkjemaSchema(språk);
  const parsedFormData = await parseFormData(request, skjema);

  if (parsedFormData.error) {
    return validationError(parsedFormData.error, parsedFormData.submittedData);
  }

  const skjemaData = parsedFormData.data;

  const requestData: LagPrivatAvtaleRequest = {
    innhold: "hallo",
    bidragsmottaker: {
      fodselsnummer: skjemaData.deg.ident,
      fornavn: skjemaData.deg.fornavn,
      etternavn: skjemaData.deg.etternavn,
    },
    bidragspliktig: {
      fodselsnummer: skjemaData.medforelder.ident,
      fornavn: skjemaData.medforelder.fornavn,
      etternavn: skjemaData.medforelder.etternavn,
    },
    fraDato: "2025-01-01", // TODO Bruke fra skjema
    nyAvtale: false,
    oppgjorsform: "Privat",
    barn: skjemaData.barn.map((barn) => {
      return {
        fodselsnummer: barn.ident,
        fornavn: barn.fornavn,
        etternavn: barn.etternavn,
        sumBidrag: barn.sumBidrag, // + eller - ?
      };
    }),
  };

  // TODO
  return hentPrivatAvtaleFraApi({
    requestData,
    språk,
    token,
  });
};

const tekster = definerTekster({
  feil: {
    beregning: {
      nb: "Det oppstod en feil under beregningen. Vennligst prøv igjen.",
      en: "An error occurred during calculation. Please try again.",
      nn: "Det oppstod ein feil under utrekninga. Ver venleg og prøv igjen.",
    },
  },
});
