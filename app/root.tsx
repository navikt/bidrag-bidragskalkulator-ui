import { Page } from "@navikt/ds-react";
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";
import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type HeadersArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { env } from "./config/env.server";
import { lagDekoratørHtmlFragmenter } from "./features/dektoratøren/htmlFragmenter";
import { InternalServerError } from "./features/feilhåndtering/500";
import { lagHeaders } from "./features/headers/headers.server";
import { fåApplikasjonsside } from "./utils/applikasjonssider";
import { hentSpråkFraCookie } from "./utils/i18n";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  const språk = hentSpråkFraCookie(request.headers.get("Cookie"));
  const applikasjonsside = fåApplikasjonsside(url.pathname);
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
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  useEffect(() => {
    injectDecoratorClientSide({
      env: location.hostname.includes("www.nav.no") ? "prod" : "dev",
    });
  }, []);

  let innhold: React.ReactNode;

  if (import.meta.env.DEV && error && error instanceof Error) {
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
