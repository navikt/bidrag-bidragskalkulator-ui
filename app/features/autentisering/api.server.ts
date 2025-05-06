import { getToken, requestOboToken, validateToken } from "@navikt/oasis";
import { redirect } from "react-router";
import { env } from "~/config/env.server";

const innloggingsurlbase = `${env.INGRESS}/oauth2/login`;
const audience = `${env.ENVIRONMENT}-gcp:bidrag:bidrag-bidragskalkulator-api`;

const hentAutentiseringstoken = async ({
  request,
}: {
  request: Request;
}): Promise<string | Response> => {
  if (env.ENVIRONMENT === "local") {
    return env.BIDRAG_BIDRAGSKALKULATOR_TOKEN;
  }

  const innloggingsurl = `${innloggingsurlbase}?redirect=${env.INGRESS}`;

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

  return obo.token;
};

export const medToken = async <T>(
  request: Request,
  fn: (token: string, request: Request) => Promise<T>,
): Promise<Response | T> => {
  const tokenOrResponse = await hentAutentiseringstoken({ request });

  if (typeof tokenOrResponse === "string") {
    return fn(tokenOrResponse, request);
  }

  return tokenOrResponse;
};
