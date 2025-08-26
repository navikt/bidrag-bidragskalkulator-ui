import { createCookieSessionStorage } from "react-router";
import type z from "zod";
import { env } from "~/config/env.server";
import { PrivatAvtaleFlerstegsSkjemaSchema } from "~/features/privatAvtale/skjemaSchema";

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

/**
 * Returnerer response options for en redirect som oppdaterer sesjonsdata.
 *
 * Man sender inn requestet og dataen man ønsker å oppdatere sesjonen med.
 *
 * @example
 * ```tsx
 * function action({ request }: ActionFunctionArgs) {
 *   return redirect(
 *     "some-path",
 *     oppdaterSesjonsdata(request, { oppdaterte: 'data' })
 *   );
 * }
 *
 * @param request Requestet
 * @param data Dataen du ønsker å oppdatere sesjonen med
 * @returns andre-argumentet til `data`, `redirect` eller `redirectDocument`-funksjonene
 */
export async function oppdaterSesjonsdata(
  request: Request,
  data: Record<string, unknown>,
) {
  const session = await getSession(request.headers.get("Cookie"));
  const eksisterende = await hentSesjonsdata(
    request,
    PrivatAvtaleFlerstegsSkjemaSchema,
  );
  session.set(PRIVAT_AVTALE_SESSION_KEY, { ...eksisterende, ...data });
  return { headers: { "Set-Cookie": await commitSession(session) } };
}

/**
 * Henter sesjonsdata for en spesifikk request og validerer det mot et schema.
 *
 * @example
 * ```tsx
 * function loader({ request }: LoaderArgs) {
 *   return hentSesjonsdata(request, PrivatAvtaleFlerstegsSkjemaSchema);
 * }
 * ```
 *
 * @param request request objektet fra action eller loader
 * @param schema Zod schemaet som dataen skal valideres mot
 * @returns de validerte sesjonsdataene eller null hvis valideringen feilet
 */
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
