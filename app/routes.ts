import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";
export default [
  index("routes/index.tsx"),
  route("/kalkulator", "routes/kalkulator.tsx"),
  route("/oversikt", "routes/oversikt.tsx"),
  route("/oversikt/dokumenter/:journalpostId", "routes/min-side/dokument.tsx"),

  route("/api/privat-avtale", "routes/api/privat-avtale.ts"),

  layout("routes/privat-avtale/layout.tsx", [
    route("/privat-avtale", "routes/privat-avtale/index.tsx"),
    layout("routes/privat-avtale/steg/layout.tsx", [
      route(
        "/privat-avtale/steg/foreldre",
        "routes/privat-avtale/steg/foreldre.tsx",
      ),
      route(
        "/privat-avtale/steg/barn-og-bidrag",
        "routes/privat-avtale/steg/barn-og-bidrag.tsx",
      ),
      route(
        "/privat-avtale/steg/avtaledetaljer",
        "routes/privat-avtale/steg/avtaledetaljer.tsx",
      ),
      route(
        "/privat-avtale/steg/oppsummering-og-avtale",
        "routes/privat-avtale/steg/oppsummering-og-avtale.tsx",
      ),
    ]),
  ]),

  route(
    "/api/hent-dokument/:journalpostId/:dokumentId",
    "routes/api/hent-dokument.ts",
  ),

  route("/api/internal/isalive", "routes/api/internal/isalive.ts"),
  route("/api/internal/isready", "routes/api/internal/isready.ts"),
  route("/.well-known/security.txt", "routes/well-known/security.txt.ts"),

  // Catch-all route for 404-feil
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
