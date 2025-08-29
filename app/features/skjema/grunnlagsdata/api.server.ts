import { env } from "~/config/env.server";
import {
  KalkulatorgrunnlagsdataSchema,
  ManuellPersoninformasjonSchema,
} from "./schema";

export const hentManuellPersoninformasjon = async (token: string) => {
  const response = await fetch(`${env.SERVER_URL}/api/v1/person/informasjon`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  const parsed = ManuellPersoninformasjonSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
};

export const hentKalkulatorgrunnlagsdata = async () => {
  const response = await fetch(
    `${env.SERVER_URL}/api/v1/person/grunnlagsdata`,
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
