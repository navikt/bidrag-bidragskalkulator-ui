import { index, route, type RouteConfig } from "@react-router/dev/routes";
export default [
  index("routes/index.tsx"),
  route("/api/internal/isalive", "routes/api/internal/isalive.ts"),
  route("/api/internal/isready", "routes/api/internal/isready.ts"),
  route("/.well-known/security.txt", "routes/.well-known/security.txt"),
] satisfies RouteConfig;
