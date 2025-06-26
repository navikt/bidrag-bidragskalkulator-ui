import type { ActionFunctionArgs } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { hentPrivatAvtaledokument } from "~/features/privatAvtale/api.server";

export async function action({ request }: ActionFunctionArgs) {
  return medToken(request, hentPrivatAvtaledokument);
}
