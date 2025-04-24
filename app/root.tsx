import parse from "html-react-parser";
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

import { Page } from "@navikt/ds-react";
import { injectDecoratorClientSide } from "@navikt/nav-dekoratoren-moduler";
import { useEffect } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { env } from "./config/env.server";
import { publicEnv } from "./config/publicEnv";
import { lagDekoratørHtmlFragmenter } from "./features/dektoratøren/htmlFragmenter";
import { useDekoratørSpråk } from "./features/dektoratøren/useDektoratørSpråk";
import { useInjectDecoratorScript } from "./features/dektoratøren/useInjectDecoratorScript";
import { InternalServerError } from "./features/feilhåndtering/500";
import { lagCspHeader } from "./features/headers/csp.server";
import { Analytics } from "./utils/analytics";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  OversettelseProvider,
} from "./utils/i18n";

export async function loader({ request }: LoaderFunctionArgs) {
  const språk = hentSpråkFraCookie(request.headers.get("Cookie"));
  const [dekoratørHtml, cspHeader] = await Promise.all([
    lagDekoratørHtmlFragmenter(språk),
    lagCspHeader(),
  ]);

  return data(
    {
      dekoratørHtml,
      språk,
      umamiWebsiteId: env.UMAMI_WEBSITE_ID,
    },
    {
      headers: {
        // Sikkerhetsheaders
        "Content-Security-Policy": cspHeader,
        "Referrer-Policy": "same-origin",
        "Permissions-Policy":
          "camera=(), microphone=(), geolocation=(), payment=(), display-capture=(), fullscreen=(), usb=(), screen-wake-lock=(), clipboard-read=self, clipboard-write=self",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless",
        "Cross-Origin-Resource-Policy": "same-origin",
        "X-Permitted-Cross-Domain-Policies": "none",
        "X-Content-Type-Options": "nosniff",

        // Andre headers
        "Cache-Control": "max-age=60, stale-while-revalidate=86400",
        "Content-Language": språk,
        "Accept-CH":
          "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Arch, Sec-CH-Prefers-Color-Scheme",
        Vary: "Accept-Encoding, Accept-Language",
        "X-DNS-Prefetch-Control": "on",
        NEL: '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
      },
    }
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
      env: publicEnv.ENVIRONMENT,
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
  breadcrumbs: {
    barnebidrag: {
      label: {
        nb: "Barnebidrag",
        en: "Child support",
        nn: "Fostringstilskot",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag",
        en: "https://www.nav.no/barnebidrag/en",
        nn: "https://www.nav.no/barnebidrag",
      },
    },
    barnebidragskalkulator: {
      label: {
        nb: "Barnebidragskalkulator",
        en: "Child support calculator",
        nn: "Fostringstilskotskalkulator",
      },
    },
  },
});
