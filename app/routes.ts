import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/form/layout.tsx", [
    route("/skjema/barn-og-inntekt", "routes/form/step-1.tsx"),
    route("/skjema/utgifter", "routes/form/step-2.tsx"),
    route("/skjema/annet", "routes/form/step-3.tsx"),
  ]),
  route("/api/internal/isalive", "routes/api/internal/isalive.ts"),
  route("/api/internal/isready", "routes/api/internal/isready.ts"),
] satisfies RouteConfig;
