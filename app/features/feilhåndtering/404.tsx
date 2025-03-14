import { BodyShort, Box, Heading, Link, List } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function NotFound() {
  const { t } = useOversettelse();
  return (
    <Box paddingBlock="20 16" data-aksel-template="404-v2">
      <div>
        <Heading level="1" size="large" spacing>
          {t(tekster.overskrift)}
        </Heading>
        <BodyShort>{t(tekster.innhold)}</BodyShort>
        <List>
          <List.Item>{t(tekster.brukSøkEllerMeny)}</List.Item>
          <List.Item>
            <Link href="/">{t(tekster.gåTilBarnebidrag)}</Link>
          </List.Item>
        </List>
      </div>
    </Box>
  );
}

const tekster = definerTekster({
  overskrift: {
    nb: "Beklager, vi fant ikke siden",
    en: "Sorry, we couldn't find the page",
    nn: "Beklager, vi fant ikke sida",
  },
  innhold: {
    nb: "Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.",
    en: "The page may have been deleted or moved, or there is an error in the link.",
    nn: "Sidene kan ha blitt sletta eller flytta, eller det er ein feil i lenken.",
  },
  gåTilBarnebidrag: {
    nb: "Gå til barnebidragskalkulatoren",
    en: "Go to child support calculator",
    nn: "Gå til fostringstilskotkalkulatoren",
  },
  brukSøkEllerMeny: {
    nb: "Bruk gjerne søket eller menyen",
    en: "Use the search or menu",
    nn: "Bruk gjerne søket eller menyen",
  },
});
