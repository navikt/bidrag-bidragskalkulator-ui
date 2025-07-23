import { Alert, Link } from "@navikt/ds-react";
import { Link as ReactRouterLink } from "react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { StegdataType } from "../privatAvtaleSteg";

type Props = {
  ufullstendigSteg: StegdataType[];
};

export default function OppsummeringsVarsel({ ufullstendigSteg }: Props) {
  const { t } = useOversettelse();

  return (
    <Alert variant="warning">
      {t(tekster.feilmeldingGenerisk)}

      <ul className="list-disc pl-4 mt-2">
        {ufullstendigSteg.map((steg) => (
          <li key={steg.step}>
            <Link as={ReactRouterLink} to={steg.path}>
              {t(tekster.gåTilSteg(steg.overskrift))}
            </Link>
          </li>
        ))}
      </ul>
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
  ikkeUtfylt: {
    nb: "Ikke utfylt",
    nn: "Ikkje utfylt",
    en: "Not filled in",
  },
});
