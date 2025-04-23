import {
  buildCspHeader,
  fetchDecoratorHtml,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import parse from "html-react-parser";
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

import { Page } from "@navikt/ds-react";
import {
  onLanguageSelect,
  setBreadcrumbs,
} from "@navikt/nav-dekoratoren-moduler";
import { useState } from "react";
import type { Route } from "./+types/root";
import "./app.css";
import { env } from "./config/env.server";
import { useInjectDecoratorScript } from "./features/dektoratøren/useInjectDecoratorScript";
import { NotFound } from "./features/feilhåndtering/404";
import { InternalServerError } from "./features/feilhåndtering/500";
import { Analytics } from "./utils/analytics";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  OversettelseProvider,
  Språk,
} from "./utils/i18n";

export async function loader({ request }: LoaderFunctionArgs) {
  const språk = hentSpråkFraCookie(request.headers.get("Cookie"));
  const [decoratorFragments, cspHeader] = await Promise.all([
    fetchDecoratorHtml({
      env: env.ENVIRONMENT,
      params: {
        language: språk,
        context: "privatperson",
        availableLanguages: Object.values(Språk).map((språk) => ({
          locale: språk,
          handleInApp: true,
        })),
        breadcrumbs: [
          {
            title: oversett(språk, tekster.breadcrumbs.barnebidrag.label),
            url: oversett(språk, tekster.breadcrumbs.barnebidrag.url),
          },
          {
            title: oversett(
              språk,
              tekster.breadcrumbs.barnebidragskalkulator.label
            ),
            url: "https://barnebidragskalkulator.nav.no",
          },
        ],
      },
    }),
    buildCspHeader(
      {
        "script-src-elem": ["'self'", "https://umami.nav.no"],
        "connect-src": ["'self'", "https://umami.nav.no"],
        "style-src-elem": ["'self'"],
      },
      { env: env.ENVIRONMENT }
    ),
  ]);

  return data(
    {
      decoratorFragments,
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
  const { decoratorFragments, språk, umamiWebsiteId } =
    useLoaderData<typeof loader>();

  const [interntSpråk, setInterntSpråk] = useState(språk);

  useInjectDecoratorScript(decoratorFragments.DECORATOR_SCRIPTS);
  onLanguageSelect(({ locale }) => {
    if (Object.values(Språk).includes(locale as Språk)) {
      const språk = locale as Språk;
      setInterntSpråk(språk);
      setBreadcrumbs([
        {
          title: oversett(språk, tekster.breadcrumbs.barnebidrag.label),
          url: oversett(språk, tekster.breadcrumbs.barnebidrag.url),
        },
        {
          title: oversett(
            språk,
            tekster.breadcrumbs.barnebidragskalkulator.label
          ),
          url: "https://barnebidragskalkulator.nav.no",
        },
      ]);
    } else {
      setInterntSpråk(Språk.NorwegianBokmål);
    }
  });

  return (
    <html lang={oversett(interntSpråk, tekster.langTag)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {parse(decoratorFragments.DECORATOR_HEAD_ASSETS, { trim: true })}
        <Analytics umamiWebsiteId={umamiWebsiteId} />
      </head>
      <body className="flex flex-col min-h-screen">
        {parse(decoratorFragments.DECORATOR_HEADER, { trim: true })}
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
        {parse(decoratorFragments.DECORATOR_FOOTER, { trim: true })}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let content: React.ReactNode;

  if (isRouteErrorResponse(error)) {
    content = <NotFound />;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    content = <InternalServerError stack={error.stack} />;
  } else {
    content = <InternalServerError />;
  }

  return (
    <html lang="nb-NO">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      {content}
      <ScrollRestoration />
      <Scripts />
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
