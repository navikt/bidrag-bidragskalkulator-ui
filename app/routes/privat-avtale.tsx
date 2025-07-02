import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { useEffect, useState } from "react";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";
import { useHref, useLoaderData, useLocation } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { IntroPanel } from "~/features/privatAvtale/IntroPanel";
import { PrivatAvtaleSkjema } from "~/features/privatAvtale/PrivatAvtaleskjema";
import {
  lagPrivatAvtaleSkjemaValidertSchema,
  type PrivatAvtaleSkjema as PrivatAvtaleSkjemaType,
  type PrivatAvtaleSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import { hentPrivatAvtaleSkjemaStandardverdi } from "~/features/privatAvtale/utils";
import { ManuellBidragsutregningSchema } from "~/features/skjema/beregning/schema";
import { hentManuellPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
import { tilÅrMånedDag } from "~/utils/dato";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";
import { lastNedPdf } from "~/utils/pdf";

const hentPrivatAvtalePdf = async (
  basename: string,
  skjemadata: PrivatAvtaleSkjemaValidert,
): Promise<Response> => {
  return fetch(`${basename}api/privat-avtale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skjemadata),
  });
};

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

export async function loader({ request }: LoaderFunctionArgs) {
  return medToken(request, hentManuellPersoninformasjon);
}

export default function ManuellBarnebidragskalkulator() {
  const [erHydrert, settErHydrert] = useState(false);
  const [feilVedHentingAvAvtale, settFeilVedHentingAvAvtale] = useState<
    string | undefined
  >();
  const basename = useHref("/");
  const { t } = useOversettelse();
  const personinformasjon = useLoaderData<typeof loader>();

  useEffect(() => {
    settErHydrert(true);
  }, []);

  const { state: navigationState } = useLocation();

  const bidragsutergningParsed =
    ManuellBidragsutregningSchema.safeParse(navigationState);

  const bidragsutregning = bidragsutergningParsed.success
    ? bidragsutergningParsed.data
    : undefined;

  const { språk } = useOversettelse();

  const form = useForm<PrivatAvtaleSkjemaType, PrivatAvtaleSkjemaValidert>({
    schema: lagPrivatAvtaleSkjemaValidertSchema(språk),
    submitSource: "state",
    defaultValues: hentPrivatAvtaleSkjemaStandardverdi(
      personinformasjon,
      bidragsutregning?.resultater,
    ),
    handleSubmit: async (skjemadata) => {
      settFeilVedHentingAvAvtale(undefined);
      const respons = await hentPrivatAvtalePdf(basename, skjemadata);

      if (!respons.ok) {
        settFeilVedHentingAvAvtale(
          oversett(språk, tekster.feilVedGenereringAvAvtale),
        );
        return;
      }

      const datoFormatert = tilÅrMånedDag(new Date());
      const filnavn = `privat-avtale-barnebidrag-${datoFormatert}.pdf`;
      const blob = await respons.blob();

      lastNedPdf(blob, filnavn);
    },
  });

  return (
    <>
      <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
        <Heading size="xlarge" level="1" spacing align="center">
          {t(tekster.overskrift)}
        </Heading>

        <IntroPanel />

        {!!bidragsutregning && erHydrert && (
          <Alert variant={"info"}>
            <BodyLong>{t(tekster.forhåndsutfyltAvtale.info)}</BodyLong>
          </Alert>
        )}

        <PrivatAvtaleSkjema form={form} error={feilVedHentingAvAvtale} />
      </div>
    </>
  );
}

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Barnebidrag - lag privat avtale",
      en: "Child support - create private agreement",
      nn: "Fostringstilskot - lag privat avtale",
    },
    beskrivelse: {
      nb: "Dette skjemaet kan dere bruke når dere skal inngå privat avtale om barnebidrag for barn under 18 år.",
      en: "This form can be used when you want to make a private agreement on child support for children under 18 years old.",
      nn: "Dette skjemaet kan de bruke når de skal inngå privat avtale om fostringstilskot for barn under 18 år.",
    },
  },
  overskrift: {
    nb: "Barnebidrag - lag privat avtale",
    en: "Child support - create private agreement",
    nn: "Fostringstilskot - lag privat avtale",
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
