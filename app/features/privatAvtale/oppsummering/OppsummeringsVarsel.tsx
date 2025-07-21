import { Alert, Link } from "@navikt/ds-react";
import { Link as ReactRouterLink } from "react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { StegdataType } from "../privatAvtaleSteg";

type Props = {
  manglendeSteg: StegdataType;
};

export default function OppsummeringsVarsel({ manglendeSteg }: Props) {
  const { t } = useOversettelse();

  return (
    <Alert variant="warning">
      {t(tekster.feilmelding)}
      {manglendeSteg && (
        <Link as={ReactRouterLink} to={manglendeSteg.path}>
          {t(tekster.gåTilSteg(manglendeSteg.overskrift))}
        </Link>
      )}
    </Alert>
  );
}

const tekster = definerTekster({
  feilmelding: {
    nb: "For å laste ned avtalen må du fylle ut alle nødvendige opplysninger.",
    nn: "For å laste ned avtalen må du fylle ut alle nødvendige opplysningar.",
    en: "To download the agreement, you must fill in all required information.",
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
