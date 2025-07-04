import { Heading } from "@navikt/ds-react";
import { type LoaderFunctionArgs, type MetaArgs } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { hentBidragsdokumenterFraApi } from "~/features/oversikt/api.server";
import { MineDokumenter } from "~/features/oversikt/MineDokumenter";
import { hentManuellPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";
import { erResponse } from "~/utils/respons";

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
  const [bidragsdokumenter, personinformasjon] = await Promise.all([
    medToken(request, hentBidragsdokumenterFraApi),
    medToken(request, hentManuellPersoninformasjon),
  ]);

  if (erResponse(bidragsdokumenter)) return bidragsdokumenter;
  if (erResponse(personinformasjon)) return personinformasjon;

  return { bidragsdokumenter, personinformasjon };
}

export default function MinOversikt() {
  const { t } = useOversettelse();

  return (
    <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
      <Heading size="xlarge" level="1" spacing align="center">
        {t(tekster.overskrift)}
      </Heading>

      <MineDokumenter />
    </div>
  );
}

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Barnebidrag - oversikt",
      en: "Child support - overview",
      nn: "Fostringstilskot - oversikt",
    },
    beskrivelse: {
      nb: "Denne siden viser dokumenter knyttet til barnebidrag",
      en: "This page shows documents related to child support",
      nn: "Denne sida viser dokument knytt til fostringstilskot",
    },
  },
  overskrift: {
    nb: "Barnebidrag - oversikt",
    en: "Child support - overview",
    nn: "Fostringstilskot - oversikt",
  },
});
