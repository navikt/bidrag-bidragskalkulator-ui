import { createCookieSessionStorage } from "react-router";
import type z from "zod";
import { env } from "~/config/env.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "nav_barnebidrag_privatavtale_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.ENVIRONMENT !== "local",
    secrets: [env.SESSION_SECRET],
    maxAge: 60 * 60, // 1 hour
  },
});

export async function hentSesjonsdata<T>(
  request: Request,
  schema: z.ZodSchema<T>,
) {
  const session = await getSession(request.headers.get("Cookie"));
  const data = session.get(PRIVAT_AVTALE_SESSION_KEY);
  const result = schema.safeParse(data);
  if (!result.success) {
    return null;
  }
  return result.data;
}

export const { getSession, commitSession, destroySession } = sessionStorage;

export const PRIVAT_AVTALE_SESSION_KEY = "barnebidrag-privat-avtale";
