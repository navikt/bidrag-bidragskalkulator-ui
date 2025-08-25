import { createCookieSessionStorage } from "react-router";
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

export const { getSession, commitSession, destroySession } = sessionStorage;

export const PRIVAT_AVTALE_SESSION_KEY = "barnebidrag-privat-avtale";
