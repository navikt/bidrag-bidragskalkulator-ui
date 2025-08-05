import { fetchDecoratorHtml } from "@navikt/nav-dekoratoren-moduler/ssr";
import { env } from "~/config/env.server";
import type { Applikasjonsside } from "~/types/applikasjonssider";
import { Språk } from "~/utils/i18n";
import { lagBrødsmulesti } from "./brødsmulesti";

export function lagDekoratørHtmlFragmenter(
  språk: Språk,
  side: Applikasjonsside,
) {
  return fetchDecoratorHtml({
    env: env.ENVIRONMENT === "local" ? "dev" : env.ENVIRONMENT,
    params: {
      language: språk,
      context: "privatperson",
      availableLanguages: Object.values(Språk).map((språk) => ({
        locale: språk,
        handleInApp: true,
      })),
      breadcrumbs: lagBrødsmulesti(språk, side),
    },
  });
}
