import {
  BodyShort,
  Box,
  Button,
  Heading,
  HGrid,
  Link,
  List,
  Page,
  VStack,
} from "@navikt/ds-react";

type InternalServerErrorProps = {
  stack?: string;
};
export function InternalServerError({ stack }: InternalServerErrorProps) {
  return (
    <Box paddingBlock="20 16">
      <Page.Block as="main" width="xl" gutters>
        <Box paddingBlock="20 8">
          <HGrid columns="minmax(auto,600px)" data-aksel-template="500-v2">
            <VStack gap="16">
              <VStack gap="12" align="start">
                <div>
                  <BodyShort textColor="subtle" size="small">
                    Statuskode 500
                  </BodyShort>
                  <Heading level="1" size="large" spacing>
                    Beklager, noe gikk galt.
                  </Heading>
                  <BodyShort spacing>
                    En teknisk feil på våre servere gjør at siden er
                    utilgjengelig. Dette skyldes ikke noe du gjorde.
                  </BodyShort>
                  <BodyShort>Du kan prøve å</BodyShort>
                  <List>
                    <List.Item>
                      vente noen minutter og{" "}
                      <Link href="#" onClick={() => location.reload()}>
                        laste siden på nytt
                      </Link>
                    </List.Item>
                    <List.Item>
                      <Link href="#" onClick={() => history.back()}>
                        gå tilbake til forrige side
                      </Link>
                    </List.Item>
                  </List>
                  <BodyShort>
                    Hvis problemet vedvarer, kan du{" "}
                    <Link href="https://nav.no/kontaktoss" target="_blank">
                      kontakte oss (åpnes i ny fane)
                    </Link>
                    .
                  </BodyShort>
                </div>

                {stack && (
                  <div>
                    <Heading level="2" size="small">
                      Stack trace
                    </Heading>
                    <BodyShort size="small" textColor="subtle" className="mb-2">
                      For lokal debugging:
                    </BodyShort>
                    <code className="block bg-gray-100 p-2 rounded-md">
                      <pre className="whitespace-pre-wrap text-sm">{stack}</pre>
                    </code>
                  </div>
                )}

                <Button>Gå til Min side</Button>
              </VStack>

              <div>
                <Heading level="1" size="large" spacing>
                  Something went wrong
                </Heading>
                <BodyShort spacing>
                  This was caused by a technical fault on our servers. Please
                  refresh this page or try again in a few minutes.{" "}
                </BodyShort>
                <BodyShort>
                  <Link target="_blank" href="https://www.nav.no/kontaktoss/en">
                    Contact us (opens in new tab)
                  </Link>{" "}
                  if the problem persists.
                </BodyShort>
              </div>
            </VStack>
          </HGrid>
        </Box>
      </Page.Block>
    </Box>
  );
}
