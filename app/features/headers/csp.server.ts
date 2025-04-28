import { buildCspHeader } from "@navikt/nav-dekoratoren-moduler/ssr";
import { env } from "~/config/env.server";

export function lagCspHeader() {
  return buildCspHeader(
    {
      "script-src-elem": ["'self'", "https://umami.nav.no"],
      "connect-src": ["'self'", "https://umami.nav.no"],
      "style-src-elem": ["'self'"],
    },
    { env: env.ENVIRONMENT === "local" ? "dev" : env.ENVIRONMENT },
  );
}
