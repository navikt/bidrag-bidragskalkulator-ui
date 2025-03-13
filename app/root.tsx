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
} from "react-router";

import { Page } from "@navikt/ds-react";
import type { Route } from "./+types/root";
import "./app.css";
import { env } from "./config/env.server";
import { useInjectDecoratorScript } from "./features/dektoratøren/useInjectDecoratorScript";
import { NotFound } from "./features/feilhåndtering/404";
import { InternalServerError } from "./features/feilhåndtering/500";

export function Layout({ children }: { children: React.ReactNode }) {
  const { decoratorFragments } = useLoaderData<typeof loader>();

  useInjectDecoratorScript(decoratorFragments.DECORATOR_SCRIPTS);

  return (
    <html lang="nb-NO">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {parse(decoratorFragments.DECORATOR_HEAD_ASSETS, { trim: true })}
      </head>
      <body className="flex flex-col min-h-screen">
        {parse(decoratorFragments.DECORATOR_HEADER, { trim: true })}
        <Page.Block
          className="flex-1"
          as="main"
          id="maincontent"
          width="md"
          gutters
        >
          {children}
        </Page.Block>
        {parse(decoratorFragments.DECORATOR_FOOTER, { trim: true })}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader() {
  const [decoratorFragments, cspHeader] = await Promise.all([
    fetchDecoratorHtml({
      env: env.ENVIRONMENT,
      params: { language: "nb", context: "privatperson" },
    }),
    buildCspHeader({}, { env: env.ENVIRONMENT }),
  ]);

  return data(
    {
      decoratorFragments,
    },
    {
      headers: {
        // Sikkerhetsheaders
        "Content-Security-Policy": cspHeader,
        "Referrer-Policy": "same-origin",
        "Permissions-Policy":
          "camera=(), microphone=(), geolocation=(), payment=(), display-capture=(), fullscreen=(), usb=(), screen-wake-lock=(), clipboard-read=(), clipboard-write=()",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless",
        "Cross-Origin-Resource-Policy": "same-origin",
        "X-Permitted-Cross-Domain-Policies": "none",

        // Andre headers
        "Cache-Control": "max-age=60, stale-while-revalidate=86400",
        "Content-Language": "nb-NO",
        "Accept-CH":
          "Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Arch, Sec-CH-Prefers-Color-Scheme",
        Vary: "Accept-Encoding, Accept-Language",
        "X-DNS-Prefetch-Control": "on",
        NEL: '{"report_to":"default","max_age":31536000,"include_subdomains":true}',
      },
    }
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    return <NotFound />;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    stack = error.stack;
  }

  return <InternalServerError stack={stack} />;
}
