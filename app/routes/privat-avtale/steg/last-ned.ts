import archiver from "archiver";
import { PassThrough, Readable } from "node:stream";
import type { ActionFunctionArgs } from "react-router";
import { getSession, PRIVAT_AVTALE_SESSION_KEY } from "~/config/session.server";
import { medToken } from "~/features/autentisering/api.server";
import { hentPrivatAvtaledokument } from "~/features/privatAvtale/api.server";
import {
  lagPrivatAvtaleFlerstegsSchema,
  type PrivatAvtaleFlerstegsSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import {
  BidragstypeSchema,
  type Bidragstype,
} from "~/features/skjema/beregning/schema";
import { tilÅrMånedDag } from "~/utils/dato";
import { Språk } from "~/utils/i18n";

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieString = request.headers.get("Cookie");
  const session = await getSession(cookieString);
  const data = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;

  const resultat = lagPrivatAvtaleFlerstegsSchema(
    Språk.NorwegianBokmål,
  ).safeParse(data);
  if (!resultat.success) {
    return { error: "Ugyldig skjema" };
  }

  const skjemadata: PrivatAvtaleFlerstegsSkjemaValidert = resultat.data;

  const barnPerBidragstype = BidragstypeSchema.options
    .map((type) => ({
      type,
      barn: skjemadata.steg2.barn
        .filter((b) => b.bidragstype === type)
        .map((barn) => ({ ...barn, sum: Number(barn.sum) })),
    }))
    .filter(({ barn }) => barn.length > 0);

  if (barnPerBidragstype.length === 1) {
    const pdfBuffer = await hentPrivatAvtalePdf(request, {
      ...skjemadata,
      steg2: {
        barn: skjemadata.steg2.barn,
      },
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="privat-avtale.pdf"',
        "Cache-Control": "no-store",
      },
      status: 200,
    });
  }

  const arkiv = archiver("zip", { zlib: { level: 9 } });
  const passThrough = new PassThrough();
  arkiv.pipe(passThrough);

  await Promise.all(
    barnPerBidragstype.map(async ({ type, barn }) => {
      const buffer = await hentPrivatAvtalePdf(request, {
        ...skjemadata,
        steg2: { barn },
      });

      if (!buffer) {
        return;
      }

      arkiv.append(buffer, { name: lagPrivatAvtalePdfNavn(type) });
    }),
  );

  void arkiv.finalize();

  const webStream = Readable.toWeb(
    passThrough,
  ) as unknown as ReadableStream<Uint8Array>;
  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition":
        'attachment; filename="barnebidrag-private-avtaler.zip"',
      "Cache-Control": "no-store",
    },
  });
};

const hentPrivatAvtalePdf = async (
  request: Request,
  skjemadata: PrivatAvtaleFlerstegsSkjemaValidert,
) => {
  const response = await medToken(request, (token) =>
    hentPrivatAvtaledokument(token, request, skjemadata),
  );

  if (!response.ok) {
    const feilmelding = await response.text();
    throw new Error(feilmelding);
  }

  // Returner som Buffer slik at archiver kan konsumere innholdet
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const lagPrivatAvtalePdfNavn = (bidragstype: Bidragstype) => {
  const datoFormatert = tilÅrMånedDag(new Date());
  const rolle =
    bidragstype === "MOTTAKER"
      ? "som-mottaker"
      : bidragstype === "PLIKTIG"
        ? "som-pliktig"
        : "ukjent";

  return `privat-avtale-barnebidrag-${rolle}-${datoFormatert}.pdf`;
};
