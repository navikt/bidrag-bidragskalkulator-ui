import { env } from "~/config/env.server";
import { hentSpråkFraCookie } from "~/utils/i18n";
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
  const cookieHeader = request.headers.get("Cookie");

  const searchParams = new URL(request.url).searchParams;

  console.log("searchParams", searchParams);

  console.log("token", token);
  const språk = hentSpråkFraCookie(cookieHeader);
  // const skjemaData: {
  //   journalpostId: string;
  //   dokumentId: string;
  // } = await request.json();

  // const { journalpostId, dokumentId } = skjemaData;
  const journalpostId = searchParams.get("journalpostId") ?? "454000114";
  const dokumentId = searchParams.get("dokumentId") ?? "454408109";

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
    return Promise.reject("feil");
  }

  return response;
};
