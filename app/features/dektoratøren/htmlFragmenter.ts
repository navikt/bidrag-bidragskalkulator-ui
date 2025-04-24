import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
import { env } from "~/config/env.server";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

export function lagDekoratørHtmlFragmenter(språk: Språk) {
  return fetchDecoratorHtml({
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
  });
}

const tekster = definerTekster({
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
