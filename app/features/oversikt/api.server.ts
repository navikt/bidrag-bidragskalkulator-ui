import { env } from "~/config/env.server";
import { definerTekster, hentSpråkFraCookie, oversett } from "~/utils/i18n";
import { MineDokumenterReponsSchema } from "./apiSchema";

export const hentBidragsdokumenterFraApi = async (token: string) => {
  const response = await fetch(`${env.SERVER_URL}/api/v1/minside/dokumenter`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  const parsed = MineDokumenterReponsSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
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
  );

  if (!response.ok) {
    console.error(
      `Feil ved henting av dokument: ${response.status} ${response.statusText}`,
    );
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
