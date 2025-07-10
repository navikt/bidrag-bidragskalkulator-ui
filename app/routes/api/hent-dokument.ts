import type { LoaderFunctionArgs } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { hentDokument } from "~/features/oversikt/api.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.journalpostId || !params.dokumentId) {
    throw new Error("Mangler journalpostId eller dokumentId i params");
  }

  const response = await medToken(request, hentDokument, {
    journalpostId: params.journalpostId,
    dokumentId: params.dokumentId,
  });

  const modifiedResponse = new Response(response.body, {
    headers: {
      ...response.headers,
      "Content-Disposition": "inline; filename=dokument.pdf",
    },
    status: response.status,
  });

  return modifiedResponse;
}
