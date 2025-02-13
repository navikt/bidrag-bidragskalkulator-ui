import { BodyShort, Box, Heading, Link, List } from "@navikt/ds-react";

export function NotFound() {
  return (
    <Box paddingBlock="20 16" data-aksel-template="404-v2">
      <div>
        <Heading level="1" size="large" spacing>
          Beklager, vi fant ikke siden
        </Heading>
        <BodyShort>
          Denne siden kan være slettet eller flyttet, eller det er en feil i
          lenken.
        </BodyShort>
        <List>
          <List.Item>Bruk gjerne søket eller menyen</List.Item>
          <List.Item>
            <Link href="/barnebidrag">Gå til barnebidrag</Link>
          </List.Item>
        </List>
      </div>
    </Box>
  );
}
