import { createCookieSessionStorage } from "react-router";
import { env } from "~/config/env.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "nav_barnebidrag_privatavtale_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.ENVIRONMENT !== "local",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export const AVTALEPART_SESSION_KEY = "barnebidrag-privat-avtale";
