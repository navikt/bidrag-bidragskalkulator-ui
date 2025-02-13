import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
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
import { useInjectDecoratorScript } from "./features/dektoratøren/useInjectDecoratorScript";

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
          width="xl"
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
    env: "dev",
    params: { language: "nb", context: "privatperson" },
  });

  return {
    decoratorFragments,
  };
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
