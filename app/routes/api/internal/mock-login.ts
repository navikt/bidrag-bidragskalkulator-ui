import { data, type LoaderFunctionArgs } from "react-router";
import { env } from "~/config/env.server";

/** Et proxy-endepunkt for mock-login, som brukes av e2e-testene */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (env.ENVIRONMENT === "prod") {
    return data(
      { error: "mock-login er ikke tilgjengelig i produksjonsmiljøet" },
      { status: 404 },
    );
  }

  const personident = new URL(request.url).searchParams.get("ident");

  if (!personident) {
    return data({ error: "ident query parameter er påkrevd" }, { status: 400 });
  }

  const token = await hentToken(personident);

  return data({ token }, { status: 200 });
};

async function hentToken(personident: string) {
  const response = await fetch(
    `${process.env.SERVER_URL}/api/v1/mock-login?ident=${personident}`,
  );
  const data = await response.json();
  return data.token;
}
