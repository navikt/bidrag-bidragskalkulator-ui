import { Button, Heading, Stepper } from "@navikt/ds-react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
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
  const navigate = useNavigate();

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

  const handleForrigeSteg = () => {
    if (aktivStegIndex > 0) {
      navigate(privatAvtaleSteg[aktivStegIndex - 1].path);
    }
  };

  const handleNesteSteg = () => {
    if (aktivStegIndex < privatAvtaleSteg.length - 1) {
      navigate(privatAvtaleSteg[aktivStegIndex + 1].path);
    }
  };

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
        <Button
          className="flex-1"
          variant="primary"
          onClick={handleForrigeSteg}
        >
          {t(tekster.knapp.forrigeSteg)}
        </Button>
        <Button
          className="flex-1"
          variant="secondary"
          onClick={handleNesteSteg}
        >
          {t(tekster.knapp.nesteSteg)}
        </Button>
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
