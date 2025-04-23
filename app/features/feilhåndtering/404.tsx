import { BugIcon } from "@navikt/aksel-icons";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  Link,
  List,
  VStack,
} from "@navikt/ds-react";

export function NotFound() {
  return (
    <Box paddingBlock="20 16" data-aksel-template="404-v2">
      <VStack gap="16">
        <VStack gap="12" align="start">
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
                <Link href="https://www.nav.no">Gå til forsiden</Link>
              </List.Item>
            </List>
          </div>
          <Button as="a" href="https://barnebidragskalkulator.nav.no">
            Gå til barnebidragskalkulatoren
          </Button>
          <Link href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
            <BugIcon aria-hidden />
            Meld gjerne fra om at lenken ikke virker
          </Link>
        </VStack>

        <div>
          <Heading level="2" size="large" spacing>
            Page not found
          </Heading>
          <BodyShort spacing>The page you requested cannot be found.</BodyShort>
          <BodyShort>
            Go to the <Link href="https://www.nav.no">front page</Link>, or use
            one of the links in the menu.
          </BodyShort>
        </div>
      </VStack>
    </Box>
  );
}
