import { Button } from "@navikt/ds-react";
import { useEffect, useState } from "react";
import type { MetaArgs } from "react-router";
import { useNavigate } from "react-router";
import { IntroPanel } from "~/features/privatAvtale/IntroPanel";
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
  const [erHydrert, settErHydrert] = useState(false);
  const [feilVedHentingAvAvtale, settFeilVedHentingAvAvtale] = useState<
    string | undefined
  >();
  const { t } = useOversettelse();
  const navigate = useNavigate();

  useEffect(() => {
    settErHydrert(true);
  }, []);

  return (
    <>
      <IntroPanel />

      <Button
        onClick={() => navigate("/privat-avtale/steg/foreldre")}
        variant="primary"
      >
        {t(tekster.start)}
      </Button>

      {/* {!!bidragsutregning && erHydrert && (
          <Alert variant={"info"}>
            <BodyLong>{t(tekster.forhåndsutfyltAvtale.info)}</BodyLong>
          </Alert>
        )} */}
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
  overskrift: {
    nb: "Veiledning",
    en: "Guidance",
    nn: "Rettleiing",
  },
  start: {
    nb: "Start",
    en: "Start",
    nn: "Start",
  },
  forhåndsutfyltAvtale: {
    info: {
      nb: "Vi har forhåndsufylt deler av den private avtalen med resultatene fra kalkulatoren. Endelig beløp for barnebidrag er det dere som velger. Om du oppdaterer siden må du fylle ut skjemaet på nytt.",
      en: "We have pre-filled parts of the private agreement with the results from the calculator. The final amount for child support is up to you to decide. If you refresh the page, you will have to fill out the form again.",
      nn: "Vi har forhåndsufylt delar av den private avtalen med resultatane frå kalkulatoren. Det endelege beløpet for fostringstilskot er det de som velger. Om du oppdaterer sida må du fylle ut skjemaet på nytt.",
    },
  },
  feilVedGenereringAvAvtale: {
    nb: "Det oppstod en feil ved generering av privat avtale.",
    en: "An error occurred while generating the private agreement.",
    nn: "Det oppstod ein feil ved generering av privat avtale.",
  },
});
