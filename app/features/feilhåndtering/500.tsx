import { BodyShort, Box, Heading, HGrid, Link, List } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

type InternalServerErrorProps = {
  stack?: string;
};
export function InternalServerError({ stack }: InternalServerErrorProps) {
  const { t } = useOversettelse();
  return (
    <Box paddingBlock="20 16">
      <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
        <BodyShort textColor="subtle" size="small">
          {t(tekster.underoverskrift)}
        </BodyShort>
        <Heading level="1" size="large" spacing>
          {t(tekster.overskrift)}
        </Heading>
        {/* Tekster bør tilpasses den aktuelle 500-feilen. Teksten under er for en generisk 500-feil. */}
        <BodyShort spacing>{t(tekster.innhold)}</BodyShort>
        <BodyShort>Du kan prøve å</BodyShort>
        <List>
          <List.Item>{t(tekster.prøvÅLasteSidenPåNytt)}</List.Item>
          {history && history.length > 1 && (
            <List.Item>
              <Link href="#" onClick={() => history.back()}>
                {t(tekster.gåTilbakeTilForrigeSide)}
              </Link>
            </List.Item>
          )}
        </List>
        <BodyShort>{t(tekster.kontaktOss)}.</BodyShort>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </HGrid>
    </Box>
  );
}

const tekster = definerTekster({
  overskrift: {
    nb: "Beklager, noe gikk galt.",
    en: "Sorry, something went wrong.",
    nn: "Beklager, noko gjekk feil.",
  },
  underoverskrift: {
    nb: "Statuskode 500",
    en: "Status code 500",
    nn: "Statuskode 500",
  },
  innhold: {
    nb: "En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette skyldes ikke noe du gjorde.",
    en: "A technical error on our servers makes the page unavailable. This is not your fault.",
    nn: "Ein teknisk feil på våre servere gjør at sida er utilgjengelig. Dette skyldes ikkje noko du gjorde.",
  },
  prøvÅLasteSidenPåNytt: {
    nb: (
      <>
        vente noen minutter og{" "}
        <Link href="#" onClick={() => location.reload()}>
          laste siden på nytt
        </Link>
      </>
    ),
    en: (
      <>
        Wait a few minutes and{" "}
        <Link href="#" onClick={() => location.reload()}>
          reload the page
        </Link>
      </>
    ),
    nn: (
      <>
        Vent nokre minutt og{" "}
        <Link href="#" onClick={() => location.reload()}>
          last sida på nytt
        </Link>
      </>
    ),
  },
  gåTilbakeTilForrigeSide: {
    nb: "Gå tilbake til forrige side",
    en: "Go back to the previous page",
    nn: "Gå tilbake til forrige side",
  },
  kontaktOss: {
    nb: (
      <>
        Hvis problemet vedvarer, kan du{" "}
        <Link href="/kontaktoss" target="_blank">
          kontakte oss (åpnes i ny fane)
        </Link>
        .
      </>
    ),
    en: (
      <>
        If the problem persists, you can{" "}
        <Link href="/kontaktoss" target="_blank">
          contact us (opens in new tab)
        </Link>
      </>
    ),
    nn: (
      <>
        Hvis problemet vedvarer, kan du{" "}
        <Link href="/kontaktoss" target="_blank">
          kontakte oss (åpnes i ny fane)
        </Link>
        .
      </>
    ),
  },
});
