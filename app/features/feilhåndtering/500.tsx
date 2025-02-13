import { BodyShort, Box, Heading, HGrid, Link, List } from "@navikt/ds-react";

type InternalServerErrorProps = {
  stack?: string;
};
export function InternalServerError({ stack }: InternalServerErrorProps) {
  return (
    <Box paddingBlock="20 16">
      <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
        <BodyShort textColor="subtle" size="small">
          Statuskode 500
        </BodyShort>
        <Heading level="1" size="large" spacing>
          Beklager, noe gikk galt.
        </Heading>
        {/* Tekster bør tilpasses den aktuelle 500-feilen. Teksten under er for en generisk 500-feil. */}
        <BodyShort spacing>
          En teknisk feil på våre servere gjør at siden er utilgjengelig. Dette
          skyldes ikke noe du gjorde.
        </BodyShort>
        <BodyShort>Du kan prøve å</BodyShort>
        <List>
          <List.Item>
            vente noen minutter og{" "}
            <Link href="#" onClick={() => location.reload()}>
              laste siden på nytt
            </Link>
          </List.Item>
          {history.length > 1 && (
            <List.Item>
              <Link href="#" onClick={() => history.back()}>
                gå tilbake til forrige side
              </Link>
            </List.Item>
          )}
        </List>
        <BodyShort>
          Hvis problemet vedvarer, kan du{" "}
          <Link href="/kontaktoss" target="_blank">
            kontakte oss (åpnes i ny fane)
          </Link>
          .
        </BodyShort>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </HGrid>
    </Box>
  );
}
