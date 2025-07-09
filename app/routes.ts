import { index, route, type RouteConfig } from "@react-router/dev/routes";
export default [
  index("routes/index.tsx"),
  route("/kalkulator", "routes/kalkulator.tsx"),
  route("/privat-avtale", "routes/privat-avtale.tsx"),
  route("/oversikt", "routes/oversikt.tsx"),

  route("/api/privat-avtale", "routes/api/privat-avtale.ts"),

  route("/api/internal/isalive", "routes/api/internal/isalive.ts"),
  route("/api/internal/isready", "routes/api/internal/isready.ts"),
  route("/.well-known/security.txt", "routes/well-known/security.txt.ts"),

  // Catch-all route for 404-feil
  route("*", "routes/404.tsx"),
] satisfies RouteConfig;
