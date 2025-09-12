import archiver from "archiver";
import { PassThrough, Readable } from "node:stream";
import type { ActionFunctionArgs } from "react-router";
import { hentSesjonsdata } from "~/config/session.server";
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
import { hentSpråkFraCookie } from "~/utils/i18n";

export const action = async ({ request }: ActionFunctionArgs) => {
  const språk = hentSpråkFraCookie(request.headers.get("Cookie"));
  const sesjonsdata = await hentSesjonsdata(
    request,
    lagPrivatAvtaleFlerstegsSchema(språk),
  );

  if (!sesjonsdata) {
    return { error: "Ugyldig skjema" };
  }

  const barnPerBidragstype = BidragstypeSchema.options
    .map((type) => ({
      type,
      barn: sesjonsdata.steg3.barn
        .filter((b) => b.bidragstype === type)
        .map((barn) => ({ ...barn, sum: Number(barn.sum) })),
    }))
    .filter(({ barn }) => barn.length > 0);

  if (barnPerBidragstype.length === 1) {
    const pdfBuffer = await hentPrivatAvtalePdf(request, {
      ...sesjonsdata,
      steg3: {
        barn: sesjonsdata.steg3.barn,
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
        ...sesjonsdata,
        steg3: { barn },
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
