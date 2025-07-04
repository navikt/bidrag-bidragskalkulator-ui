import { BodyLong, Heading } from "@navikt/ds-react";
import {
  useLoaderData,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";
import { medToken } from "~/features/autentisering/api.server";
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

export default function MinOversikt() {
  const { t } = useOversettelse();
  const personinformasjon = useLoaderData<typeof loader>();

  return (
    <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
      <Heading size="xlarge" level="1" spacing align="center">
        {t(tekster.overskrift)}
      </Heading>

      <BodyLong spacing>
        {t(tekster.hei(personinformasjon.person.fulltNavn))}
      </BodyLong>
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
  hei: (navn) => ({
    nb: `Hei ${navn}, her kommer dine dokumenter knyttet til barnebidrag`,
    en: `Hello ${navn}, here will your documents related to child support come`,
    nn: `Hei ${navn}, her kjem dine dokument knytt til fostringstilskot`,
  }),
});
