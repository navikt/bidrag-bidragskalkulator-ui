import { env } from "~/config/env.server";
import { getToken, validateToken, requestOboToken } from "@navikt/oasis";
import { redirect } from "react-router";
import { PERSON_MED_EN_MOTPART_TO_BARN } from "~/mocks/personinformasjon";
import {
  personinformasjonResponseSchema,
  type PersoninformasjonResponse,
} from "./schema";

async function hentPersoninformasjonFraApi(token: string) {
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

  const parsed = personinformasjonResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
}

const loginUrl = `${env.INGRESS}/oauth2/login`;
const audience = `${env.ENVIRONMENT}-gcp:bidrag:bidrag-bidragskalkulator-api`;

export async function hentPersoninformasjon(
  request: Request
): Promise<PersoninformasjonResponse | Response> {
  if (process.env.NODE_ENV === "development") {
    // Dette er mocket data, som man kan bruke i utvikling
    return PERSON_MED_EN_MOTPART_TO_BARN;
  }

  const token = getToken(request);
  if (!token) {
    return redirect(loginUrl);
  }

  const validation = await validateToken(token);
  if (!validation.ok) {
    return redirect(loginUrl);
  }

  const obo = await requestOboToken(token, audience);
  if (!obo.ok) {
    return redirect(loginUrl);
  }

  return hentPersoninformasjonFraApi(obo.token);
}
