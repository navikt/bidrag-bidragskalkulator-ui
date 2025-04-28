import { getToken, requestOboToken, validateToken } from "@navikt/oasis";
import { redirect } from "react-router";
import { env } from "~/config/env.server";
import { PersoninformasjonSchema, type Personinformasjon } from "./schema";

const hentPersoninformasjonFraApi = async (token: string) => {
  const response = await fetch(`${env.SERVER_URL}/api/v1/person/informasjon`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  const parsed = PersoninformasjonSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
};

const innloggingsurlbase = `${env.INGRESS}/oauth2/login`;
const audience = `${env.ENVIRONMENT}-gcp:bidrag:bidrag-bidragskalkulator-api`;

export const hentPersoninformasjonAutentisert = async ({
  request,
  navigerTilUrlEtterAutentisering,
}: {
  request: Request;
  navigerTilUrlEtterAutentisering: string;
}): Promise<Personinformasjon | Response> => {
  if (env.ENVIRONMENT === "local") {
    return hentPersoninformasjonFraApi(env.BIDRAG_BIDRAGSKALKULATOR_TOKEN);
  }

  const innloggingsurl = `${innloggingsurlbase}?redirect=${env.INGRESS}${navigerTilUrlEtterAutentisering}`;

  const token = getToken(request);
  if (!token) {
    console.info("Ingen token funnet, omdirigerer til innlogging");
    return redirect(innloggingsurl);
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    console.info("Token er ikke gyldig, omdirigerer til innlogging");
    return redirect(innloggingsurl);
  }

  const obo = await requestOboToken(token, audience);
  if (!obo.ok) {
    console.info("Ingen OBO token funnet, omdirigerer til innlogging");
    return redirect(innloggingsurl);
  }

  return hentPersoninformasjonFraApi(obo.token);
};
