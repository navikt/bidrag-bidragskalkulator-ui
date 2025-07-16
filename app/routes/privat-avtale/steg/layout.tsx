import { Button, Heading, Stepper } from "@navikt/ds-react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  type LoaderFunctionArgs,
} from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { PrivatAvtaleFormProvider } from "~/features/privatAvtale/PrivatAvtaleFormProvider";
import { lagStepperData } from "~/features/privatAvtale/steg";
import { ManuellBidragsutregningSchema } from "~/features/skjema/beregning/schema";
import { hentManuellPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export async function loader({ request }: LoaderFunctionArgs) {
  return medToken(request, hentManuellPersoninformasjon);
}

export default function PrivatAvtaleStegLayout() {
  const personinformasjon = useLoaderData<typeof loader>();
  const { state: navigationState, pathname } = useLocation();
  const { t, språk } = useOversettelse();

  const bidragsutergningParsed =
    ManuellBidragsutregningSchema.safeParse(navigationState);

  const bidragsutregning = bidragsutergningParsed.success
    ? bidragsutergningParsed.data
    : undefined;

  const privatAvtaleSteg = lagStepperData(språk);
  const aktivStegIndex = privatAvtaleSteg.findIndex((steg) =>
    steg.path.includes(pathname),
  );
  const aktivSteg = privatAvtaleSteg[aktivStegIndex];
  const aktivStegStep = aktivSteg?.step ?? 1;

  const forrigeSteg =
    aktivStegIndex > 0
      ? privatAvtaleSteg[aktivStegIndex - 1].path
      : "/barnebidrag/tjenester/privat-avtale";
  const nesteSteg =
    aktivStegIndex < privatAvtaleSteg.length - 1
      ? privatAvtaleSteg[aktivStegIndex + 1].path
      : null;

  return (
    <>
      <Stepper aria-labelledby="stepper-heading" activeStep={aktivStegStep}>
        {privatAvtaleSteg.map((steg) => (
          <Stepper.Step href={steg.path}>{steg.title}</Stepper.Step>
        ))}
      </Stepper>
      <Heading level="2" size="large">
        {aktivSteg?.title}
      </Heading>
      <PrivatAvtaleFormProvider
        personinformasjon={personinformasjon}
        bidragsutregning={bidragsutregning}
      >
        <Outlet />
      </PrivatAvtaleFormProvider>
      <div className="flex gap-5">
        <Button className="flex-1" variant="primary" as="a" href={forrigeSteg}>
          {t(tekster.knapp.forrigeSteg)}
        </Button>
        {nesteSteg && (
          <Button
            className="flex-1"
            variant="secondary"
            as="a"
            href={nesteSteg}
          >
            {t(tekster.knapp.nesteSteg)}
          </Button>
        )}
      </div>
    </>
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
