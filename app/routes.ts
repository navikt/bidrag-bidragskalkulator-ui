import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/skjema/layout.tsx", [
    route("/skjema/barn-og-inntekt", "routes/skjema/step-1.tsx"),
    route("/skjema/utgifter", "routes/skjema/step-2.tsx"),
    route("/skjema/annet", "routes/skjema/step-3.tsx"),
  ]),
  route("/api/internal/isalive", "routes/api/internal/isalive.ts"),
  route("/api/internal/isready", "routes/api/internal/isready.ts"),
] satisfies RouteConfig;
