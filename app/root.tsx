import { FaroErrorBoundary } from "@grafana/faro-react";
import { BodyShort, Heading, Link, Page } from "@navikt/ds-react";
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type HeadersArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { env } from "./config/env.server";
import { lagDekoratørHtmlFragmenter } from "./features/dektoratøren/htmlFragmenter";
import { NotFound } from "./features/feilhåndtering/404";
import { InternalServerError } from "./features/feilhåndtering/500";
import { lagHeaders } from "./features/headers/headers.server";
import { hentApplikasjonsside } from "./utils/applikasjonssider";
import { hentSpråkFraCookie, OversettelseProvider, Språk } from "./utils/i18n";
import { getFaro } from "./utils/telemetri";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const språk = hentSpråkFraCookie(request.headers.get("Cookie"));
  const applikasjonsside = hentApplikasjonsside(url.pathname);
  const [dekoratørHtml, headers] = await Promise.all([
    lagDekoratørHtmlFragmenter(språk, applikasjonsside),
    lagHeaders(språk),
  ]);

  return data(
    {
      dekoratørHtml,
      språk,
      umamiWebsiteId: env.UMAMI_WEBSITE_ID,
      applikasjonsside,
      telemetriUrl: env.TELEMETRY_URL,
    },
    {
      headers,
    },
  );
}

export const headers = ({ loaderHeaders }: HeadersArgs) => {
  return loaderHeaders;
};

export default function App() {
  const { telemetriUrl } = useLoaderData<typeof loader>();
  useEffect(() => {
    getFaro(telemetriUrl);
  }, [telemetriUrl]);
  return (
    <FaroErrorBoundary>
      <Outlet />
    </FaroErrorBoundary>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  useEffect(() => {
    injectDecoratorClientSide({
      env: location.hostname.includes("www.nav.no") ? "prod" : "dev",
    });
  }, []);

  let innhold: React.ReactNode;

  if (isRouteErrorResponse(error) && error.status === 404) {
    innhold = (
      <OversettelseProvider språk={Språk.NorwegianBokmål}>
        <NotFound />
        <div className="pb-16">
          <Heading level="2" size="large" spacing>
            Page not found
          </Heading>
          <BodyShort spacing>The page you requested cannot be found.</BodyShort>
          <BodyShort>
            Go to the <Link href="https://www.nav.no/en">front page</Link>, or
            use one of the links in the menu.
          </BodyShort>
        </div>
      </OversettelseProvider>
    );
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    innhold = <InternalServerError stack={error.stack} />;
  } else {
    innhold = <InternalServerError />;
  }

  return (
    <html lang="nb-NO">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Page.Block
          className="flex-1"
          as="main"
          id="maincontent"
          width="xl"
          gutters
        >
          {innhold}
        </Page.Block>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
