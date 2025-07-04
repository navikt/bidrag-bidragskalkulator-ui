import { BodyLong, Box, Heading, VStack } from "@navikt/ds-react";
import { useRouteLoaderData } from "react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";

import type { loader } from "~/routes/oversikt";
import { datoTilTekst } from "~/utils/dato";

export const MineDokumenter: React.FC = () => {
  const { t } = useOversettelse();

  const loaderData = useRouteLoaderData<typeof loader>("routes/oversikt");

  if (!loaderData) {
    throw new Error("Kunne ikke hente data for MineDokumenter");
  }

  const {
    bidragsdokumenter: { journalposter },
  } = loaderData;

  return (
    <>
      <Heading level="2" size="small">
        {t(tekster.tittel.label)}
      </Heading>

      <VStack as="ul" gap="1">
        {journalposter.map((journalpost, index) => {
          const erFørsteElement = index === 0;
          const erSisteElement = index === journalposter.length - 1;

          const borderRadiusTopp = erFørsteElement ? "12 12" : "4 4";
          const borderRadiusBunn = erSisteElement ? "12 12" : "4 4";

          const parter =
            journalpost.mottaker?.navn && journalpost.avsender?.navn
              ? `${journalpost.mottaker.navn}, ${journalpost.avsender.navn}`
              : journalpost.mottaker?.navn || journalpost.avsender?.navn || "";

          return (
            <Box
              as="li"
              key={journalpost.journalpostId}
              background="surface-neutral-subtle"
              padding="space-16"
              borderRadius={`${borderRadiusTopp} ${borderRadiusBunn}`}
            >
              <BodyLong size="small">
                {datoTilTekst(new Date(journalpost.dato))} - {parter}
              </BodyLong>
              {journalpost.tittel}
            </Box>
          );
        })}
      </VStack>

      <Heading level="2" size="small">
        {t(tekster.finnerIkkeInnhold.tittel)}
      </Heading>
      <BodyLong>{t(tekster.finnerIkkeInnhold.beskrivelse)}</BodyLong>
    </>
  );
};

const tekster = definerTekster({
  tittel: {
    label: {
      nb: "Mine dokumenter (bidragssaker)",
      nn: "Mine dokument (bidragssaker)",
      en: "My documents (child support)",
    },
  },
  finnerIkkeInnhold: {
    tittel: {
      nb: "Finner du ikke det du leter etter?",
      nn: "Finner du ikkje det du leitar etter?",
      en: "Can't find what you're looking for?",
    },
    beskrivelse: {
      nb: "For bidragssaker kan du kun se dokumenter fra starten av 2022.",
      nn: "For bidragssaker kan du berre sjå dokument frå starten av 2022.",
      en: "For child support cases, you can only see documents from the beginning of 2022.",
    },
  },
});
