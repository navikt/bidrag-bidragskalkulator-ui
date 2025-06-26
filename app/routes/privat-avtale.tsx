import { Heading } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import type { LoaderFunctionArgs, MetaArgs } from "react-router";
import { useHref, useLoaderData, useSearchParams } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { IntroPanel } from "~/features/privatAvtale/IntroPanel";
import { PrivatAvtaleSkjema } from "~/features/privatAvtale/PrivatAvtaleskjema";
import {
  lagPrivatAvtaleSkjemaValidertSchema,
  type PrivatAvtaleSkjema as PrivatAvtaleSkjemaType,
  type PrivatAvtaleSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import { hentPrivatAvtaleSkjemaStandardverdi } from "~/features/privatAvtale/utils";
import { hentManuellPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
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

export async function loader({ request }: LoaderFunctionArgs) {
  return medToken(request, hentManuellPersoninformasjon);
}

export default function ManuellBarnebidragskalkulator() {
  const basename = useHref("/");
  const { t } = useOversettelse();
  const personinformasjon = useLoaderData<typeof loader>();

  const [urlSøkeparametre] = useSearchParams();
  const kalkulatorResultater = urlSøkeparametre.get("kalkulator");

  const forhåndsvalgteBarn = kalkulatorResultater
    ? JSON.parse(kalkulatorResultater)
    : [];

  const { språk } = useOversettelse();

  const form = useForm<PrivatAvtaleSkjemaType, PrivatAvtaleSkjemaValidert>({
    schema: lagPrivatAvtaleSkjemaValidertSchema(språk),
    submitSource: "state",
    defaultValues: hentPrivatAvtaleSkjemaStandardverdi(
      personinformasjon,
      forhåndsvalgteBarn,
    ),
    handleSubmit: async (skjemaData) => {
      const respons = await fetch(`${basename}api/privat-avtale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skjemaData),
      });

      if (!respons.ok) {
        // TODO
        return;
      }

      // Noe som kan feile her?
      const blob = await respons.blob();
      const url = URL.createObjectURL(blob);
      const datoFormatert = new Date().toISOString().split("T")[0];
      const a = document.createElement("a");
      a.href = url;
      a.download = `privat-avtale-barnebidrag-${datoFormatert}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  return (
    <>
      <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
        <Heading size="xlarge" level="1" spacing align="center">
          {t(tekster.overskrift)}
        </Heading>

        <IntroPanel />

        <PrivatAvtaleSkjema form={form} />
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
      nb: "Barnebidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
      en: "The child support calculator helps you calculate how much child support you are entitled to.",
      nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut hvor stort eit fostringstilskot er.",
    },
  },
  overskrift: {
    nb: "Barnebidrag - lag privat avtale",
    en: "Child support - create private agreement",
    nn: "Fostringstilskot - lag privat avtale",
  },
});
