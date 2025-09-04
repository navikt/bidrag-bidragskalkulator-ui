import { env } from "~/config/env.server";
import { KalkulatorgrunnlagsdataSchema } from "./schema";

export const hentKalkulatorgrunnlagsdata = async () => {
  const response = await fetch(
    `${env.SERVER_URL}/api/v1/bidragskalkulator/grunnlagsdata`,
    {
      method: "GET",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw Error(`Kunne ikke hente grunnlagsdata: ${data?.error}`);
  }

  const parsed = KalkulatorgrunnlagsdataSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
};
