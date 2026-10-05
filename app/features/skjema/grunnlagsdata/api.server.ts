import { env } from "~/config/env.server";
import { serverLogger } from "~/utils/logger.server";
import { KalkulatorgrunnlagsdataSchema } from "./schema";

export const hentKalkulatorgrunnlagsdata = async () => {
  const response = await fetch(
    `${env.SERVER_URL}/api/v1/bidragskalkulator/grunnlagsdata`,
    {
      method: "GET",
    },
  ).catch(() => {
    serverLogger.error("Kunne ikke kontakte API for kalkulatorgrunnlag");
    throw new Error("Kunne ikke hente grunnlagsdata");
  });

  if (!response.ok) {
    serverLogger.error("Feil ved henting av grunnlagsdata", response.status);
    throw new Error("Kunne ikke hente grunnlagsdata");
  }

  const data = await response.json().catch(() => {
    serverLogger.error("Ugyldig JSON fra API for kalkulatorgrunnlag");
    throw new Error("Ugyldig svar ved henting av grunnlagsdata");
  });
  const parsed = KalkulatorgrunnlagsdataSchema.safeParse(data);

  if (!parsed.success) {
    serverLogger.error("Ugyldig svar fra API for kalkulatorgrunnlag");
    throw new Error("Ugyldig svar ved henting av grunnlagsdata");
  }

  return parsed.data;
};
