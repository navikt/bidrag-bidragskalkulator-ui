import { BugIcon } from "@navikt/aksel-icons";
import { BodyShort, Box, Button, Heading, Link, List } from "@navikt/ds-react";
import { Link as ReactRouterLink } from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function NotFound() {
  const { t } = useOversettelse();
  return (
    <Box paddingBlock="20 16" data-aksel-template="404-v2">
      <div className="flex flex-col gap-12 items-start">
        <div>
          <Heading level="1" size="large" spacing>
            {t(tekster.tittel)}
          </Heading>
          <BodyShort>{t(tekster.årsaker)}</BodyShort>
          <List>
            <List.Item>{t(tekster.forslag.brukSøkEllerMeny)}</List.Item>
            <List.Item>{t(tekster.forslag.gåTilForsiden)}</List.Item>
          </List>
        </div>
        <Button as={ReactRouterLink} to={RouteConfig.KALKULATOR}>
          {t(tekster.ctas.gåTilKalkulator)}
        </Button>
        <Link href="https://www.nav.no/person/kontakt-oss/tilbakemeldinger/feil-og-mangler">
          <BugIcon aria-hidden />
          {t(tekster.ctas.meldFra)}
        </Link>
      </div>
    </Box>
  );
}

const tekster = definerTekster({
  tittel: {
    nb: "Beklager, vi fant ikke siden",
    en: "Sorry, we couldn't find the page",
    nn: "Beklager, vi fant ikke siden",
  },
  årsaker: {
    nb: "Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.",
    en: "This page may have been deleted or moved, or there is an error in the link.",
    nn: "Denne siden kan være slettet eller flyttet, eller det er en feil i lenken.",
  },
  forslag: {
    brukSøkEllerMeny: {
      nb: "Bruk gjerne søket eller menyen",
      en: "Please use the search or menu",
      nn: "Bruk gjerne søket eller menyen",
    },
    gåTilForsiden: {
      nb: <Link href="https://www.nav.no">Gå til forsiden</Link>,
      en: <Link href="https://www.nav.no/en">Go to the front page</Link>,
      nn: <Link href="https://www.nav.no">Gå til forsiden</Link>,
    },
  },
  ctas: {
    gåTilKalkulator: {
      nb: "Gå til barnebidragskalkulatoren",
      en: "Go to the child benefit calculator",
      nn: "Gå til barnebidragskalkulatoren",
    },
    meldFra: {
      nb: "Meld gjerne fra om at lenken ikke virker",
      en: "Please report if the link is not working",
      nn: "Meld gjerne fra om at lenken ikke virker",
    },
  },
});
