import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Alert, BodyLong, Button, Heading, Stepper } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import {
  Outlet,
  Link as ReactRouterLink,
  useLocation,
  useRouteLoaderData,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import { medToken } from "~/features/autentisering/api.server";
import { hentPersoninformasjonForPrivatAvtale } from "~/features/privatAvtale/api.server";
import type { HentPersoninformasjonForPrivatAvtaleRespons } from "~/features/privatAvtale/apiSchema";
import { hentSideMetadata } from "~/features/privatAvtale/pageMeta";
import { stegdata } from "~/features/privatAvtale/privatAvtaleSteg";
import { UtregningNavigasjonsdataSchema } from "~/features/skjema/beregning/schema";
import { definerTekster, Språk, useOversettelse } from "~/utils/i18n";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const metadata = data?.metadata;

  return [
    { title: metadata?.tittel ?? "Barnebidrag – lag privat avtale" },
    {
      name: "description",
      content: metadata?.beskrivelse ?? "",
    },
  ];
};

export async function loader({
  request,
  context,
}: LoaderFunctionArgs): Promise<{
  personinformasjon: HentPersoninformasjonForPrivatAvtaleRespons;
  metadata: Awaited<ReturnType<typeof hentSideMetadata>>;
}> {
  const språk = context.språk ?? Språk.NorwegianBokmål;
  const url = new URL(request.url);

  return {
    personinformasjon: await medToken(request, (token) =>
      hentPersoninformasjonForPrivatAvtale(token),
    ),
    metadata: hentSideMetadata(url.pathname, språk),
  };
}

export const usePrivatAvtaleLayoutLoaderData = () => {
  return useRouteLoaderData<typeof loader>("routes/privat-avtale/steg/layout");
};

export default function PrivatAvtaleStegLayout() {
  const { state: navigationState, pathname } = useLocation();
  const bidragsutregningParsed =
    UtregningNavigasjonsdataSchema.safeParse(navigationState);
  const bidragsutregning = bidragsutregningParsed.success
    ? bidragsutregningParsed.data
    : undefined;

  const { t, språk } = useOversettelse();
  const [erHydrert, settErHydrert] = useState(false);

  useEffect(() => {
    settErHydrert(true);
  }, []);

  const privatAvtaleSteg = stegdata(språk);
  const aktivSteg = privatAvtaleSteg.find((steg) =>
    steg.path.endsWith(pathname),
  );
  const aktivStegIndex = privatAvtaleSteg.findIndex((steg) =>
    steg.path.endsWith(pathname),
  );
  const forrigeSteg =
    aktivStegIndex > 0
      ? privatAvtaleSteg[aktivStegIndex - 1].path
      : RouteConfig.PRIVAT_AVTALE.INDEX;
  const nesteSteg =
    aktivStegIndex < privatAvtaleSteg.length - 1
      ? privatAvtaleSteg[aktivStegIndex + 1].path
      : null;

  return (
    <div className="flex flex-col md:flex-row-reverse gap-20">
      <Stepper
        aria-labelledby="skjemaoverskrift"
        activeStep={aktivSteg?.step ?? 1}
      >
        {privatAvtaleSteg.map((steg) => (
          <Stepper.Step as={ReactRouterLink} to={steg.path}>
            {steg.overskrift}
          </Stepper.Step>
        ))}
      </Stepper>
      <section className="flex-1 space-y-6" aria-labelledby="skjemaoverskrift">
        {!!bidragsutregning && erHydrert && (
          <Alert variant={"info"}>
            <BodyLong>{t(tekster.forhåndsutfyltAvtale.info)}</BodyLong>
          </Alert>
        )}
        <Heading id="skjemaoverskrift" level="2" size="large">
          {aktivSteg?.overskrift}
        </Heading>

        <Outlet />

        <div className="flex gap-5">
          <Button
            as={ReactRouterLink}
            to={forrigeSteg}
            variant="secondary"
            icon={<ArrowLeftIcon aria-hidden />}
          >
            {t(tekster.knapp.forrigeSteg)}
          </Button>

          {nesteSteg && (
            <Button
              type="submit"
              variant="primary"
              form="steg"
              icon={<ArrowRightIcon aria-hidden />}
              iconPosition="right"
            >
              {t(tekster.knapp.nesteSteg)}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

const tekster = definerTekster({
  forhåndsutfyltAvtale: {
    info: {
      nb: "Vi har forhåndsufylt deler av den private avtalen med resultatene fra kalkulatoren. Endelig beløp for barnebidrag er det dere som velger. Om du oppdaterer siden må du fylle ut skjemaet på nytt.",
      en: "We have pre-filled parts of the private agreement with the results from the calculator. The final amount for child support is up to you to decide. If you refresh the page, you will have to fill out the form again.",
      nn: "Vi har forhåndsufylt delar av den private avtalen med resultatane frå kalkulatoren. Det endelege beløpet for fostringstilskot er det de som velger. Om du oppdaterer sida må du fylle ut skjemaet på nytt.",
    },
  },
  knapp: {
    nesteSteg: {
      nb: "Neste steg",
      en: "Next step",
      nn: "Neste steg",
    },
    forrigeSteg: {
      nb: "Forrige steg",
      en: "Previous step",
      nn: "Førre steg",
    },
  },
});
