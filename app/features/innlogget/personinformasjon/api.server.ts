import { env } from "~/config/env.server";
import { PersoninformasjonSchema } from "./schema";

export const hentPersoninformasjon = async (token: string) => {
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

  const parsed = PersoninformasjonSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
};
