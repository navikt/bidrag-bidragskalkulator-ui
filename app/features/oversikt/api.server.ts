import { env } from "~/config/env.server";
import { definerTekster, hentSpråkFraCookie, oversett } from "~/utils/i18n";
import { serverLogger } from "~/utils/logger.server";
import { MineDokumenterReponsSchema } from "./apiSchema";

export const hentBidragsdokumenterFraApi = async (token: string) => {
  const response = await fetch(`${env.SERVER_URL}/api/v1/minside/dokumenter`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).catch(() => {
    serverLogger.error("Kunne ikke kontakte dokument-API");
    throw new Error("Kunne ikke hente dokumenter");
  });

  if (!response.ok) {
    serverLogger.error("Feil ved henting av dokumenter", response.status);
    throw new Error("Kunne ikke hente dokumenter");
  }

  const data = await response.json().catch(() => {
    serverLogger.error("Ugyldig JSON fra dokument-API");
    throw new Error("Ugyldig svar ved henting av dokumenter");
  });
  const parsed = MineDokumenterReponsSchema.safeParse(data);

  if (!parsed.success) {
    serverLogger.error("Ugyldig svar fra dokument-API");
    throw new Error("Ugyldig svar ved henting av dokumenter");
  }

  return parsed.data;
};

export const hentDokument = async (
  token: string,
  request: Request,
  params: { journalpostId: string; dokumentId: string },
) => {
  const { journalpostId, dokumentId } = params;
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);

  const response = await fetch(
    `${env.SERVER_URL}/api/v1/minside/dokumenter/${journalpostId}/${dokumentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).catch(() => {
    serverLogger.error("Kunne ikke kontakte dokument-API");
    throw new Error("Kunne ikke hente dokument");
  });

  if (!response.ok) {
    serverLogger.error("Feil ved henting av dokument", response.status);
    return Promise.reject(oversett(språk, tekster.feil.hentDokument));
  }

  return response;
};

const tekster = definerTekster({
  feil: {
    hentDokument: {
      nb: "Feil ved henting av dokument",
      en: "Error fetching document",
      nn: "Feil ved henting av dokument",
    },
  },
});
