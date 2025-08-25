import { Button } from "@navikt/ds-react";
import {
  data,
  Form,
  useNavigate,
  useRouteLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import { getSession, PRIVAT_AVTALE_SESSION_KEY } from "~/config/session.server";
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
} from "~/features/privatAvtale/skjemaSchema";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export default function OppsummeringOgAvtale() {
  const { t } = useOversettelse();
  const navigate = useNavigate();

  const ufullstendigeSteg = useUfullstendigeSteg();
  const harUfullstendigeSteg = ufullstendigeSteg.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {harUfullstendigeSteg && (
        <OppsummeringsVarsel ufullstendigeSteg={ufullstendigeSteg} />
      )}
      <div className="flex flex-col gap-4">
        <OppsummeringForeldre />
        <OppsummeringBarn />
        <OppsummeringAvtaledetaljer />
        <OppsummeringAndreBestemmelser />
        <OppsummeringVedlegg />
      </div>

      <Form
        method="post"
        action={RouteConfig.PRIVAT_AVTALE.STEG_6_LAST_NED}
        reloadDocument
        onSubmit={() => {
          navigate(RouteConfig.PRIVAT_AVTALE.FERDIG);
        }}
      >
        <Button
          variant="primary"
          className="w-full sm:w-60"
          type="submit"
          disabled={harUfullstendigeSteg}
        >
          {t(tekster.lastNedKnapp)}
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
});
