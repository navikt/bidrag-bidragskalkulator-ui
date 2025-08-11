import {
  index,
  layout,
  route,
  type RouteConfig as RouteConfigType,
} from "@react-router/dev/routes";
import { RouteConfig } from "./config/routeConfig";
export default [
  layout("routes/hovedlayout.tsx", [
    index("routes/index.tsx"),
    route(RouteConfig.KALKULATOR, "routes/kalkulator.tsx"),
    route(RouteConfig.OVERSIKT.INDEX, "routes/min-side/oversikt.tsx"),
    route(
      RouteConfig.OVERSIKT.DOKUMENTER.DETALJER.route,
      "routes/min-side/dokument.tsx",
    ),

    route(RouteConfig.PRIVAT_AVTALE.API, "routes/api/privat-avtale.ts"),

    layout("routes/privat-avtale/layout.tsx", [
      route(RouteConfig.PRIVAT_AVTALE.INDEX, "routes/privat-avtale/index.tsx"),
      layout("routes/privat-avtale/steg/layout.tsx", [
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_1_FORELDRE,
          "routes/privat-avtale/steg/foreldre.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_2_BARN_OG_BIDRAG,
          "routes/privat-avtale/steg/barn-og-bidrag.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_3_AVTALEDETALJER,
          "routes/privat-avtale/steg/avtaledetaljer.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_4_ANDRE_BESTEMMELSER,
          "routes/privat-avtale/steg/andre-bestemmelser.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_5_VEDLEGG,
          "routes/privat-avtale/steg/vedlegg.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_6_OPPSUMMERING_OG_AVTALE,
          "routes/privat-avtale/steg/oppsummering-og-avtale.tsx",
        ),
      ]),
    ]),

    route(
      RouteConfig.OVERSIKT.DOKUMENTER.HENT_DOKUMENT.route,
      "routes/api/hent-dokument.ts",
    ),

    route(RouteConfig.INTERNAL.IS_ALIVE, "routes/api/internal/isalive.ts"),
    route(RouteConfig.INTERNAL.IS_READY, "routes/api/internal/isready.ts"),
    route(
      RouteConfig.WELL_KNOWN.SECURITY_TXT,
      "routes/well-known/security.txt.ts",
    ),

    // Catch-all route for 404-feil
    route("*", "routes/404.tsx"),
  ]),
] satisfies RouteConfigType;
