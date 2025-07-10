import { Box, Heading, Link, Table, VStack } from "@navikt/ds-react";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
  type MetaArgs,
} from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { NotFound } from "~/features/feilhåndtering/404";
import { hentBidragsdokumenterFraApi } from "~/features/oversikt/api.server";
import { datoTilTekst } from "~/utils/dato";
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
  return medToken(request, hentBidragsdokumenterFraApi);
}

export default function Dokument() {
  const { t } = useOversettelse();
  const bidragsdokumenter = useLoaderData<typeof loader>();
  const parametre = useParams();

  const journalpost = bidragsdokumenter.journalposter.find(
    (journalpost) => journalpost.journalpostId === parametre.journalpostId,
  );

  if (!journalpost) {
    return <NotFound />;
  }

  const dokumenter = journalpost.dokumenter;

  return (
    <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4 space-y-2">
      <Heading size="small" level="1" spacing>
        {t(tekster.overskrift)}
      </Heading>

      <Heading level="2" size="large" spacing>
        {journalpost.tittel}
      </Heading>

      {dokumenter.length > 0 && (
        <Box
          background="surface-neutral-subtle"
          padding="space-16"
          borderRadius="12"
        >
          <Link
            href={`/barnebidrag/tjenester/api/hent-dokument/${journalpost.journalpostId}/${dokumenter[0].dokumentInfoId}`}
          >
            {t(tekster.åpne(dokumenter[0].tittel))}
          </Link>
        </Box>
      )}

      <Table>
        <Table.Body>
          {journalpost.avsender && (
            <Table.Row>
              <Table.HeaderCell scope="row">
                {t(tekster.tabell.avsender)}
              </Table.HeaderCell>
              <Table.DataCell>{journalpost.avsender.navn}</Table.DataCell>
            </Table.Row>
          )}
          {journalpost.mottaker && (
            <Table.Row>
              <Table.HeaderCell scope="row">
                {t(tekster.tabell.mottaker)}
              </Table.HeaderCell>
              <Table.DataCell>{journalpost.mottaker.navn}</Table.DataCell>
            </Table.Row>
          )}
          <Table.Row>
            <Table.HeaderCell scope="row">
              {t(tekster.tabell.dato)}
            </Table.HeaderCell>
            <Table.DataCell>
              {datoTilTekst(new Date(journalpost.dato))}
            </Table.DataCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell scope="row">
              {t(tekster.tabell.tema.label)}
            </Table.HeaderCell>
            <Table.DataCell>{t(tekster.tabell.tema.verdi)}</Table.DataCell>
          </Table.Row>
        </Table.Body>
      </Table>

      {dokumenter.length > 1 && (
        <div>
          <Heading level="3" size="small" spacing>
            {t(tekster.vedlegg.overskrift(dokumenter.length))}
          </Heading>
          <VStack as="ul" gap="1">
            {journalpost.dokumenter.map((dokument) => {
              return (
                <li key={dokument.dokumentInfoId}>
                  <Link
                    href={`/barnebidrag/tjenester/api/hent-dokument/${journalpost.journalpostId}/${dokument.dokumentInfoId}`}
                  >
                    <Box>{dokument.tittel}</Box>
                  </Link>
                </li>
              );
            })}
          </VStack>
        </div>
      )}
    </div>
  );
}

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Min side - dokumenter for barnebidrag",
      en: "My page - documents for child support",
      nn: "Mi side - dokument for fostringstilskot",
    },
    beskrivelse: {
      nb: "Denne siden viser et dokument relatert til barnebidrag og eventuelle vedlegg",
      en: "This page shows documents related to child support and any attachments",
      nn: "Denne sida viser dokument knytt til fostringstilskot og eventuelle vedlegg",
    },
  },
  overskrift: {
    nb: "Dokumenter barnebidrag",
    en: "Documents child support",
    nn: "Dokument fostringstilskot",
  },
  åpne: (tittel) => ({
    nb: `Åpne ${tittel}`,
    en: `Open ${tittel}`,
    nn: `Opne ${tittel}`,
  }),
  tabell: {
    avsender: {
      nb: "Avsender",
      en: "Sender",
      nn: "Avsendar",
    },
    mottaker: {
      nb: "Mottaker",
      en: "Recipient",
      nn: "Mottakar",
    },
    dato: {
      nb: "Dato opprettet",
      en: "Date created",
      nn: "Dato oppretta",
    },
    tema: {
      label: {
        nb: "Tema",
        en: "Subject",
        nn: "Tema",
      },
      verdi: {
        nb: "Bidrag",
        en: "Child support",
        nn: "Fostringstilskot",
      },
    },
  },
  vedlegg: {
    overskrift: (antall) => ({
      nb: `Vedlegg (${antall})`,
      en: `Attachments (${antall})`,
      nn: `Vedlegg (${antall})`,
    }),
  },
});
