import { Alert, BodyLong, Link } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export const BetaNotis = () => {
  const { t } = useOversettelse();
  return (
    <Alert variant="info" className="mb-4 [&>*:nth-child(2)]:max-w-none">
      <BodyLong>{t(tekster.notis)}</BodyLong>
    </Alert>
  );
};

const tekster = definerTekster({
  notis: {
    nb: (
      <>
        Dette er vår nye kalkulator for utregning av barnebidrag.{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          Den gamle kalkulatoren
        </Link>{" "}
        er fortsatt mulig å bruke, dersom du ønsker det.
      </>
    ),
    en: (
      <>
        This is our new child support calculator.{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          The old calculator
        </Link>{" "}
        is still available if you prefer it.
      </>
    ),
    nn: (
      <>
        Dette er vår nye kalkulator for utregning av fostringstilskot.{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          Den gamle kalkulatoren
        </Link>{" "}
        er framleis mogleg å bruke, dersom du ønskjer det.
      </>
    ),
  },
});
