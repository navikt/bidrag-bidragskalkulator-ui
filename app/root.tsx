import { Page } from "@navikt/ds-react";
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import parse from "html-react-parser";
import { useEffect } from "react";
import {
  data,
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
import { useDekoratørSpråk } from "./features/dektoratøren/useDektoratørSpråk";
import { useInjectDecoratorScript } from "./features/dektoratøren/useInjectDecoratorScript";
import { InternalServerError } from "./features/feilhåndtering/500";
import { lagHeaders } from "./features/headers/headers.server";
import { ApplikasjonssiderSchema } from "./types/applikasjonssider";
import { Analytics } from "./utils/analytics";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  OversettelseProvider,
} from "./utils/i18n";

const BASENAME = "/barnebidrag/tjenester/";
const SLUTTER_MED_SKRÅSTREK = /\/+$/;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sisteDelAvUrl = url.pathname
    .split(BASENAME)[1]
    ?.replace(SLUTTER_MED_SKRÅSTREK, "");
  const applikasjonssideParsed =
    ApplikasjonssiderSchema.safeParse(sisteDelAvUrl);

  if (!applikasjonssideParsed.success) {
    console.error(`Ugyldig side: ${sisteDelAvUrl}`);
  }

  const språk = hentSpråkFraCookie(request.headers.get("Cookie"));
  const [dekoratørHtml, headers] = await Promise.all([
    lagDekoratørHtmlFragmenter(
      språk,
      applikasjonssideParsed.success
        ? applikasjonssideParsed.data
        : "kalkulator",
    ),
    lagHeaders(språk),
  ]);

  return data(
    {
      dekoratørHtml,
      språk,
      umamiWebsiteId: env.UMAMI_WEBSITE_ID,
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
  const { dekoratørHtml, språk, umamiWebsiteId } =
    useLoaderData<typeof loader>();

  const interntSpråk = useDekoratørSpråk(språk);
  useInjectDecoratorScript(dekoratørHtml.DECORATOR_SCRIPTS);

  return (
    <html lang={oversett(interntSpråk, tekster.langTag)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {parse(dekoratørHtml.DECORATOR_HEAD_ASSETS, { trim: true })}
        <Analytics umamiWebsiteId={umamiWebsiteId} />
      </head>
      <body className="flex flex-col min-h-screen">
        {parse(dekoratørHtml.DECORATOR_HEADER, { trim: true })}
        <OversettelseProvider språk={interntSpråk}>
          <Page.Block
            className="flex-1"
            as="main"
            id="maincontent"
            width="xl"
            gutters
          >
            <Outlet />
          </Page.Block>
        </OversettelseProvider>
        {parse(dekoratørHtml.DECORATOR_FOOTER, { trim: true })}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
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

const tekster = definerTekster({
  langTag: {
    nb: "nb-NO",
    en: "en-US",
    nn: "nn-NO",
  },
});
