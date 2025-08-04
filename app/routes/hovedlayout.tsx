import { Page } from "@navikt/ds-react";
import parse from "html-react-parser";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import { useDekoratørSpråk } from "~/features/dektoratøren/useDektoratørSpråk";
import { useInjectDecoratorScript } from "~/features/dektoratøren/useInjectDecoratorScript";
import { Analytics } from "~/utils/analytics";
import { definerTekster, oversett, OversettelseProvider } from "~/utils/i18n";

export default function Hovedlayout() {
  const { dekoratørHtml, språk, umamiWebsiteId, applikasjonsside } =
    useRouteLoaderData("root");

  const interntSpråk = useDekoratørSpråk(språk, applikasjonsside);
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

const tekster = definerTekster({
  langTag: {
    nb: "nb-NO",
    en: "en-US",
    nn: "nn-NO",
  },
});
