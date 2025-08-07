import { Button } from "@navikt/ds-react";
import {
  Link as ReactRouterLink,
  useLocation,
  type MetaArgs,
} from "react-router";
import { IntroPanel } from "~/features/privatAvtale/IntroPanel";
import { stegdata } from "~/features/privatAvtale/privatAvtaleSteg";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";

export function meta({ matches }: MetaArgs) {
  const rootData = matches.find((match) => match.pathname === "/")?.data as {
    språk: Språk;
  };

  const språk = rootData?.språk ?? Språk.NorwegianBokmål;

  return [
    { title: oversett(språk, tekster.meta.tittel) },
    {
      name: "description",
      content: oversett(språk, tekster.meta.beskrivelse),
    },
  ];
}

export default function Veiledning() {
  const { t, språk } = useOversettelse();
  const førsteSteg = stegdata(språk).find((steg) => steg.step === 1)?.path;
  const { state: navigationState } = useLocation();

  return (
    <>
      <IntroPanel />
      {førsteSteg && (
        <Button
          as={ReactRouterLink}
          to={førsteSteg}
          state={navigationState}
          variant="primary"
          className="w-fit mx-auto"
        >
          {t(tekster.start)}
        </Button>
      )}
    </>
  );
}

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Veiledning",
      en: "Guidance",
      nn: "Rettleiing",
    },
    beskrivelse: {
      nb: "Dette skjemaet kan dere bruke når dere skal inngå privat avtale om barnebidrag for barn under 18 år.",
      en: "This form can be used when you want to make a private agreement on child support for children under 18 years old.",
      nn: "Dette skjemaet kan de bruke når de skal inngå privat avtale om fostringstilskot for barn under 18 år.",
    },
  },
  start: {
    nb: "Start",
    en: "Start",
    nn: "Start",
  },
});
