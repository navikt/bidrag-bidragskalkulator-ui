import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading, Link, Stepper } from "@navikt/ds-react";
import {
  Outlet,
  Link as ReactRouterLink,
  useHref,
  useLoaderData,
  useLocation,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { hentSideMetadata } from "~/features/privatAvtale/pageMeta";
import { PrivatAvtaleFormProvider } from "~/features/privatAvtale/PrivatAvtaleFormProvider";
import { stegdata } from "~/features/privatAvtale/privatAvtaleSteg";
import { ManuellBidragsutregningSchema } from "~/features/skjema/beregning/schema";
import { hentManuellPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
import type { ManuellPersoninformasjon } from "~/features/skjema/personinformasjon/schema";
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

export async function loader({ request, context }: LoaderFunctionArgs) {
  const språk = context.språk ?? Språk.NorwegianBokmål;
  const url = new URL(request.url);

  return {
    personinformasjon: await medToken(request, hentManuellPersoninformasjon),
    metadata: hentSideMetadata(url.pathname, språk),
  };
}

export default function PrivatAvtaleStegLayout() {
  const { personinformasjon } = useLoaderData<typeof loader>();
  const { state: navigationState, pathname } = useLocation();
  const { t, språk } = useOversettelse();
  const basename = useHref("/").slice(0, -1);
  const bidragsutergningParsed =
    ManuellBidragsutregningSchema.safeParse(navigationState);

  const bidragsutregning = bidragsutergningParsed.success
    ? bidragsutergningParsed.data
    : undefined;

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
      : "/privat-avtale";
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
          <Stepper.Step href={`${basename}${steg.path}`}>
            {steg.overskrift}
          </Stepper.Step>
        ))}
      </Stepper>
      <section className="flex-1 space-y-6" aria-labelledby="skjemaoverskrift">
        <Heading id="skjemaoverskrift" level="2" size="large">
          {aktivSteg?.overskrift}
        </Heading>
        <PrivatAvtaleFormProvider
          personinformasjon={personinformasjon as ManuellPersoninformasjon}
          bidragsutregning={bidragsutregning}
        >
          <Outlet />
        </PrivatAvtaleFormProvider>

        <div className="flex gap-5">
          <Link as={ReactRouterLink} to={forrigeSteg}>
            <Button
              className="flex-1"
              variant="secondary"
              icon={<ArrowLeftIcon aria-hidden />}
            >
              {t(tekster.knapp.forrigeSteg)}
            </Button>
          </Link>

          {nesteSteg && (
            <Link as={ReactRouterLink} to={nesteSteg}>
              <Button
                className="flex-1"
                variant="primary"
                icon={<ArrowRightIcon aria-hidden />}
                iconPosition="right"
              >
                {t(tekster.knapp.nesteSteg)}
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

const tekster = definerTekster({
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
