import { BodyLong, GuidePanel } from "@navikt/ds-react";
import { Link } from "react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function IntroPanel() {
  const { t } = useOversettelse();

  return (
    <GuidePanel poster>
      <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
      <BodyLong spacing>{t(tekster.innhold2)}</BodyLong>

      <Link to={"/kalkulator"}>{t(tekster.lenkeTilKalkulator)}</Link>
    </GuidePanel>
  );
}

const tekster = definerTekster({
  innhold1: {
    nb: "Dette skjemaet kan dere bruke når dere skal inngå privat avtale om barnebidrag for barn under 18 år.",
    en: "This form can be used when you want to make a private agreement on child support for children under 18 years old.",
    nn: "Dette skjemaet kan de bruke når de skal inngå privat avtale om fostringstilskot for barn under 18 år.",
  },
  innhold2: {
    nb: "Nav blir ikke involvert når dere inngår en privat avtale. Hvis dere ønsker at Skatteetaten skal kreve inn og utbetale allerede avtalt barnebidrag, må dere sende gjeldende private avtale til Nav. Vi tar det så videre med Skatteetaten.",
    en: "Nav will not be involved when you make a private agreement. If you want the Norwegian Tax Administration to collect and pay out the agreed child support, you must send the current private agreement to Nav. We will then forward it to the Norwegian Tax Administration.",
    nn: "Nav blir ikkje involvert når de inngår ein privat avtale. Dersom de ønskjer at Skatteetaten skal krevje inn og utbetale allereie avtalt fostringstilskot, må de sende gjeldande private avtale til Nav. Vi tek det så vidare med Skatteetaten.",
  },
  lenkeTilKalkulator: {
    nb: "Bruk kalkulatoren for å bestemme barnebidrag",
    en: "Use the calculator to determine child support",
    nn: "Bruk kalkulatoren for å bestemme fostringstilskot",
  },
});
