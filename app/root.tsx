import {
  buildCspHeader,
  fetchDecoratorHtml,
} from "@navikt/nav-dekoratoren-moduler/ssr";
import parse from "html-react-parser";
import {
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
  const decoratorFragments = await fetchDecoratorHtml({
    env: env.ENVIRONMENT,
    params: { language: "nb", context: "privatperson" },
  });

  return {
    decoratorFragments,
  };
}

export async function headers() {
  return buildCspHeader({}, { env: env.ENVIRONMENT });
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
