import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
import { env } from "~/config/env.server";
import { oversett, Språk } from "~/utils/i18n";
import { breadcrumbTekster } from "./breadcrumbTekster";

export function lagDekoratørHtmlFragmenter(språk: Språk) {
  return fetchDecoratorHtml({
    env: env.ENVIRONMENT === "local" ? "dev" : env.ENVIRONMENT,
    params: {
      language: språk,
      context: "privatperson",
      availableLanguages: Object.values(Språk).map((språk) => ({
        locale: språk,
        handleInApp: true,
      })),
      breadcrumbs: [
        {
          title: oversett(språk, breadcrumbTekster.barnebidrag.label),
          url: oversett(språk, breadcrumbTekster.barnebidrag.url),
        },
        {
          title: oversett(
            språk,
            breadcrumbTekster.barnebidragskalkulator.label,
          ),
          url: "https://barnebidragskalkulator.nav.no",
        },
      ],
    },
  });
}
