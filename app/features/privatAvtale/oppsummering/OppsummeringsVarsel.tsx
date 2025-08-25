import { Alert, Link, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { Link as ReactRouterLink } from "react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { StegdataType } from "../privatAvtaleSteg";

type Props = {
  ufullstendigeSteg: StegdataType[];
};

export default function OppsummeringsVarsel({ ufullstendigeSteg }: Props) {
  const { t } = useOversettelse();

  return (
    <Alert variant="warning">
      {t(tekster.feilmeldingGenerisk)}

      <List>
        {ufullstendigeSteg.map((steg) => (
          <ListItem key={steg.step}>
            <Link as={ReactRouterLink} to={steg.path}>
              {t(tekster.gåTilSteg(steg.overskrift))}
            </Link>
          </ListItem>
        ))}
      </List>
    </Alert>
  );
}

const tekster = definerTekster({
  feilmeldingGenerisk: {
    nb: "For å laste ned avtalen må du fylle ut manglende informasjon eller rette opp i ugyldige felter:",
    nn: "For å laste ned avtalen må du fylle ut manglande informasjon eller rette opp i ugyldige felt:",
    en: "To download the agreement, please complete the missing information or correct invalid fields:",
  },
  gåTilSteg: (tittel) => ({
    nb: `Gå til steget: ${tittel}`,
    nn: `Gå til steget: ${tittel}`,
    en: `Go to step: ${tittel}`,
  }),
});
