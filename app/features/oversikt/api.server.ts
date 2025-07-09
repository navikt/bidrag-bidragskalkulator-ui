import { env } from "~/config/env.server";
import { MineDokumenterReponsSchema } from "./apiSchema";

export const hentBidragsdokumenterFraApi = async (token: string) => {
  const response = await fetch(`${env.SERVER_URL}/api/v1/minside/dokumenter`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  const parsed = MineDokumenterReponsSchema.safeParse(data);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data;
};
