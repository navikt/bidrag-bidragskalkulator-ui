import { Alert, Button } from "@navikt/ds-react";
import { useEffect } from "react";
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useRouteLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { getSession, PRIVAT_AVTALE_SESSION_KEY } from "~/config/session.server";
import { medToken } from "~/features/autentisering/api.server";
import { hentPrivatAvtaledokument } from "~/features/privatAvtale/api.server";
import { OppsummeringAndreBestemmelser } from "~/features/privatAvtale/oppsummering/OppsummeringAndreBestemmelser";
import { OppsummeringAvtaledetaljer } from "~/features/privatAvtale/oppsummering/OppsummeringAvtaledetaljer";
import { OppsummeringBarn } from "~/features/privatAvtale/oppsummering/OppsummeringBarn";
import { OppsummeringForeldre } from "~/features/privatAvtale/oppsummering/OppsummeringForeldre";
import OppsummeringsVarsel from "~/features/privatAvtale/oppsummering/OppsummeringsVarsel";
import { OppsummeringVedlegg } from "~/features/privatAvtale/oppsummering/OppsummeringVedlegg";
import { useUfullstendigeSteg } from "~/features/privatAvtale/oppsummering/useUfullstendigeSteg";
import {
  PrivatAvtaleFlerstegsSkjemaSchema,
  type PrivatAvtaleFlerstegsSkjema,
  type PrivatAvtaleFlerstegsSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import {
  BidragstypeSchema,
  type Bidragstype,
} from "~/features/skjema/beregning/schema";
import { tilÅrMånedDag } from "~/utils/dato";
import {
  definerTekster,
  hentSpråkFraCookie,
  oversett,
  useOversettelse,
} from "~/utils/i18n";
import { lastNedPdf } from "~/utils/pdf";

export default function OppsummeringOgAvtale() {
  const { t } = useOversettelse();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const ufullstendigeSteg = useUfullstendigeSteg();
  const harUfullstendigeSteg = ufullstendigeSteg.length > 0;
  const senderInn = navigation.state === "submitting";

  useEffect(() => {
    if (actionData && "pdfer" in actionData && actionData.pdfer) {
      const { pdfer, feilet } = actionData;
      if (feilet) {
        console.log(feilet);
        alert(t(tekster.feilmelding));
      } else {
        pdfer.forEach(({ pdf, type }) => {
          if (!pdf) {
            return;
          }
          lastNedPdf(pdf, lagPrivatAvtalePdfNavn(type));
        });
      }
    }
  }, [actionData, t]);

  return (
    <div className="flex flex-col gap-6">
      {harUfullstendigeSteg && (
        <OppsummeringsVarsel ufullstendigeSteg={ufullstendigeSteg} />
      )}
      {actionData && "error" in actionData && (
        <Alert variant="error">{actionData.error}</Alert>
      )}
      <div className="flex flex-col gap-4">
        <OppsummeringForeldre />
        <OppsummeringBarn />
        <OppsummeringAvtaledetaljer />
        <OppsummeringAndreBestemmelser />
        <OppsummeringVedlegg />
      </div>

      <Form method="post">
        <Button
          variant="primary"
          className="w-full sm:w-60"
          type="submit"
          disabled={harUfullstendigeSteg}
          loading={senderInn}
        >
          {senderInn ? t(tekster.lasterNed) : t(tekster.lastNedKnapp)}
        </Button>
      </Form>
    </div>
  );
}

export const headers = () => {
  return { "Cache-Control": "no-store" };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionData = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;
  const resultat =
    PrivatAvtaleFlerstegsSkjemaSchema.partial().safeParse(sessionData);
  if (!resultat.success) {
    return {};
  }
  return data(resultat.data, { headers: { "Cache-Control": "no-store" } });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieString = request.headers.get("Cookie");
  const session = await getSession(cookieString);
  const språk = hentSpråkFraCookie(cookieString);
  const data = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;

  const resultat = PrivatAvtaleFlerstegsSkjemaSchema.safeParse(data);
  if (!resultat.success) {
    return { error: "Ugyldig skjema" };
  }

  const skjemadata = resultat.data;

  const barnPerBidragstype = BidragstypeSchema.options
    .map((type) => ({
      type,
      barn: skjemadata.steg2.barn
        .filter((b) => b.bidragstype === type)
        .map((barn) => ({ ...barn, sum: Number(barn.sum) })),
    }))
    .filter(({ barn }) => barn.length > 0);

  const pdfer = await Promise.all(
    barnPerBidragstype.map(async ({ type, barn }) => {
      try {
        const pdf = await hentPrivatAvtalePdf(request, {
          ...skjemadata,
          steg2: { barn },
        });

        return { type, pdf };
      } catch (feil: unknown) {
        return {
          type,
          pdf: null,
          feilmelding:
            feil instanceof Error
              ? feil.message
              : oversett(språk, tekster.feilmelding),
        };
      }
    }),
  );

  console.log(pdfer);

  const feilet = pdfer.some(({ pdf }) => pdf === null);
  return {
    pdfer,
    feilet,
  };
};

export const useOppsummeringsdata = () => {
  const data = useRouteLoaderData(
    "routes/privat-avtale/steg/oppsummering-og-avtale",
  ) as PrivatAvtaleFlerstegsSkjema;
  return data;
};

const tekster = definerTekster({
  lastNedKnapp: {
    nb: "Last ned privat avtale",
    nn: "Last ned privat avtale",
    en: "Download private agreement",
  },
  lasterNed: {
    nb: "Laster ned…",
    nn: "Lastar ned…",
    en: "Downloading…",
  },
  suksessmelding: (antallFiler) => ({
    nb:
      antallFiler === 1
        ? "Avtalen ble generert og lastet ned."
        : `${antallFiler} avtaler ble generert og lastet ned.`,
    nn:
      antallFiler === 1
        ? "Avtalen blei generert og lasta ned."
        : `${antallFiler} avtalar blei generert og lasta ned.`,
    en:
      antallFiler === 1
        ? "The agreement was generated and downloaded."
        : `${antallFiler} agreements were generated and downloaded.`,
  }),
  feilmelding: {
    nb: "Det oppsto en feil under generering av avtalen.",
    nn: "Det oppstod ein feil under generering av avtalen.",
    en: "An error occurred while generating the agreement.",
  },
});

const hentPrivatAvtalePdf = async (
  request: Request,
  skjemadata: PrivatAvtaleFlerstegsSkjemaValidert,
): Promise<Blob> => {
  const response = await medToken(request, (token) =>
    hentPrivatAvtaledokument(token, request, skjemadata),
  );

  if (!response.ok) {
    const feilmelding = await response.text();
    throw new Error(feilmelding);
  }

  return response.blob();
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
