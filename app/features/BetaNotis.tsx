import { Alert, BodyLong, Link } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const BetaNotis = () => {
  const { t } = useOversettelse();
  return (
    <Alert variant="info" className="mb-4 [&>*:nth-child(2)]:max-w-none">
      <BodyLong>{t(tekster.notis)}</BodyLong>
    </Alert>
  );
};

const sporGåTilGammelKalkulatorKlikket = () => {
  sporHendelse({
    hendelsetype: "gå til gammel kalkulator klikket fra ny kalkulator",
    kilde: "infoboks",
  });
};

const tekster = definerTekster({
  notis: {
    nb: (
      <>
        Dette er vår nye kalkulator for utregning av barnebidrag.{" "}
        <Link
          href="https://tjenester.nav.no/bidragskalkulator/innledning?0"
          onClick={sporGåTilGammelKalkulatorKlikket}
        >
          Den gamle kalkulatoren
        </Link>{" "}
        er fortsatt mulig å bruke dersom du ønsker det.
      </>
    ),
    en: (
      <>
        This is our new child support calculator.{" "}
        <Link
          href="https://tjenester.nav.no/bidragskalkulator/innledning?0"
          onClick={sporGåTilGammelKalkulatorKlikket}
        >
          The old calculator
        </Link>{" "}
        is still available if you prefer it.
      </>
    ),
    nn: (
      <>
        Dette er den nye kalkulatoren vår for å rekne ut barnebidrag.{" "}
        <Link
          href="https://tjenester.nav.no/bidragskalkulator/innledning?0"
          onClick={sporGåTilGammelKalkulatorKlikket}
        >
          Den gamle kalkulatoren
        </Link>{" "}
        er framleis mogleg å bruke dersom du ønsker det.
      </>
    ),
  },
});
