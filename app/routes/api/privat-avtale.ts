import type { ActionFunctionArgs } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { hentPrivatAvtaledokument } from "~/features/privatAvtale/api.server";

export async function action({ request }: ActionFunctionArgs) {
  const originalRespons = await medToken(request, hentPrivatAvtaledokument);

  const nyHeaders = new Headers(originalRespons.headers);
  nyHeaders.set(
    "Content-Disposition",
    "attachment; filename=privat-avtale.pdf",
  );

  const newRes = new Response(await originalRespons.blob(), {
    status: originalRespons.status,
    statusText: originalRespons.statusText,
    headers: nyHeaders,
  });
  return newRes;
}
