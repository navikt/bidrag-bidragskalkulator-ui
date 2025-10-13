import { BodyLong, GuidePanel, Link, List } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function IntroPanel() {
  const { t } = useOversettelse();

  return (
    <GuidePanel poster>
      <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
      <BodyLong spacing>{t(tekster.innhold2)}</BodyLong>
      <BodyLong>{t(tekster.brukGammelKalkulator.overskrift)}</BodyLong>

      <List>
        <ListItem>{t(tekster.brukGammelKalkulator.situasjon1)}</ListItem>
        <ListItem>{t(tekster.brukGammelKalkulator.situasjon2)}</ListItem>
      </List>
    </GuidePanel>
  );
}

const sporGåTilGammelKalkulatorKlikket = () => {
  sporHendelse({
    hendelsetype: "gå til gammel kalkulator klikket fra ny kalkulator",
    kilde: "intropanel",
  });
};

const tekster = definerTekster({
  innhold1: {
    nb: "Barnebidragskalkulatoren er et verktøy for deg som ønsker å lage en privat avtale om barnebidrag for barn under 18 år – uten at Nav er involvert. Kalkulatoren gir et forslag til bidragsbeløp basert på informasjonen du legger inn, og kan være et nyttig utgangspunkt for at dere kommer frem til et beløp som passer dere.",
    en: "The child support calculator is a tool for parents who want to make a private agreement on child support for children under 18 years of age – without Nav being involved. The calculator provides a suggested amount of child support based on the information you enter, and can be a useful starting point for you to decide on an amount that suits you.",
    // TODO: nynorsk er ikke oppdatert
    nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
  },
  innhold2: {
    nb: "Beløpet som kalkulatoren foreslår er kun veiledende, og er ikke det samme som at Nav har fattet et vedtak.",
    en: "The amount that the calculator suggests is only a guide, and is not the same as Nav deciding it for you.",
    // TODO: nynorsk er ikke oppdatert
    nn: "Summen bruker du til å avtale fostringstilskot med den andre forelderen. Dersom du har barn med fleire, vel du berre dei barna du har med den forelderen som du ønsker å avtale fostringstilskot med.",
  },
  brukGammelKalkulator: {
    overskrift: {
      nb: (
        <>
          I noen tilfeller bør du likevel bruke{" "}
          <Link
            href="https://tjenester.nav.no/bidragskalkulator/innledning"
            onClick={sporGåTilGammelKalkulatorKlikket}
          >
            den gamle kalkulatoren
          </Link>
          :
        </>
      ),
      en: (
        <>
          In some situations, you should still use{" "}
          <Link
            href="https://tjenester.nav.no/bidragskalkulator/innledning"
            onClick={sporGåTilGammelKalkulatorKlikket}
          >
            the old calculator
          </Link>
          :
        </>
      ),
      nn: (
        <>
          I nokre tilfelle bør du bruke{" "}
          <Link
            href="https://tjenester.nav.no/bidragskalkulator/innledning"
            onClick={sporGåTilGammelKalkulatorKlikket}
          >
            den gamle kalkulatoren
          </Link>
          :
        </>
      ),
    },
    situasjon1: {
      nb: "hvis den som skal betale barnebidrag, også betaler barnebidrag for barn med en annen forelder",
      en: "if the parent who is to pay child support also pays child support for other children",
      // TODO: nynorsk er ikke oppdatert
      nn: "dersom den som skal betale fostringstilskot, også betaler fostringstilskot for andre barn",
    },
    situasjon2: {
      nb: "hvis du ønsker å sjekke om du bør søke endring på barnebidrag som allerede er bestemt (fastsatt) av Nav",
      en: "if you want to check whether you should apply for a change in child support that has already been determined by Nav",
      // TODO: nynorsk er ikke oppdatert
      nn: "dersom du ønsker å sjekke om du bør søke endring på fostringstilskot som allereie er bestemt (fastsett) av Nav",
    },
  },
});
