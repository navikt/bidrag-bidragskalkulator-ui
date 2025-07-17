import { ArrowLeftIcon, ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading, Stepper } from "@navikt/ds-react";
import {
  Outlet,
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

  const bidragsutergningParsed =
    ManuellBidragsutregningSchema.safeParse(navigationState);

  const bidragsutregning = bidragsutergningParsed.success
    ? bidragsutergningParsed.data
    : undefined;

  const privatAvtaleSteg = stegdata(språk);
  const aktivSteg = privatAvtaleSteg.find((steg) =>
    steg.path.includes(pathname),
  );
  const aktivStegIndex = privatAvtaleSteg.findIndex((steg) =>
    steg.path.includes(pathname),
  );
  const forrigeSteg =
    aktivStegIndex > 0
      ? privatAvtaleSteg[aktivStegIndex - 1].path
      : "/barnebidrag/tjenester/privat-avtale";
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
          <Stepper.Step href={steg.path}>{steg.overskrift}</Stepper.Step>
        ))}
      </Stepper>
      <section className="flex-1 space-y-6" aria-labelledby="skjemaoverskrift">
        <Heading id="skjemaoverskrift" level="2" size="large">
          {aktivSteg?.overskrift}
        </Heading>
        <PrivatAvtaleFormProvider
          personinformasjon={personinformasjon}
          bidragsutregning={bidragsutregning}
        >
          <Outlet />
        </PrivatAvtaleFormProvider>

        <div className="flex gap-5">
          <Button
            className="flex-1"
            variant="secondary"
            icon={<ArrowLeftIcon aria-hidden />}
            as="a"
            href={forrigeSteg}
          >
            {t(tekster.knapp.forrigeSteg)}
          </Button>
          {nesteSteg && (
            <Button
              className="flex-1"
              variant="primary"
              icon={<ArrowRightIcon aria-hidden />}
              iconPosition="right"
              as="a"
              href={nesteSteg}
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
