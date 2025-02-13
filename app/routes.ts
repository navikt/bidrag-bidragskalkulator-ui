import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/api/internal/isalive", "routes/api/internal/isalive.ts"),
  route("/api/internal/isready", "routes/api/internal/isready.ts"),
] satisfies RouteConfig;
