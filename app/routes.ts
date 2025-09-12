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

    layout("routes/privat-avtale/layout.tsx", [
      route(RouteConfig.PRIVAT_AVTALE.INDEX, "routes/privat-avtale/index.tsx"),
      layout("routes/privat-avtale/steg/layout.tsx", [
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_1_OM_DEG,
          "routes/privat-avtale/steg/om-deg.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_2_OM_DEN_ANDRE_FORELDEREN,
          "routes/privat-avtale/steg/foreldre.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_3_BARN_OG_BIDRAG,
          "routes/privat-avtale/steg/barn-og-bidrag.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_4_AVTALEDETALJER,
          "routes/privat-avtale/steg/avtaledetaljer.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_5_ANDRE_BESTEMMELSER,
          "routes/privat-avtale/steg/andre-bestemmelser.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_6_VEDLEGG,
          "routes/privat-avtale/steg/vedlegg.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_7_OPPSUMMERING_OG_AVTALE,
          "routes/privat-avtale/steg/oppsummering-og-avtale.tsx",
        ),
        route(
          RouteConfig.PRIVAT_AVTALE.STEG_8_LAST_NED,
          "routes/privat-avtale/steg/last-ned.ts",
        ),
      ]),
    ]),

    route(RouteConfig.PRIVAT_AVTALE.FERDIG, "routes/privat-avtale/ferdig.tsx"),

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
