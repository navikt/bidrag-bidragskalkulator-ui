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
    nb: "Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
    en: "The child support calculator helps you calculate how much you should pay or receive in child support.",
    nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
  },
  innhold2: {
    nb: "Summen bruker du til å avtale barnebidrag med den andre forelderen. Hvis du har barn med flere, velger du kun de barna du har med den forelderen som du ønsker å avtale barnebidrag med.",
    en: "The amount can be used to make an agreement with the other parent. If you have children with more than one parent, you only select the children you have with the parent you want to agree on child support with.",
    nn: "Summen bruker du til å avtale fostringstilskot med den andre forelderen. Dersom du har barn med fleire, vel du berre dei barna du har med den forelderen som du ønsker å avtale fostringstilskot med.",
  },
  brukGammelKalkulator: {
    overskrift: {
      nb: (
        <>
          I noen tilfeller bør du bruke{" "}
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
      nb: "hvis den som skal betale barnebidrag, også betaler barnebidrag for andre barn",
      en: "if the parent who is to pay child support also pays child support for other children",
      nn: "dersom den som skal betale fostringstilskot, også betaler fostringstilskot for andre barn",
    },
    situasjon2: {
      nb: "hvis du ønsker å sjekke om du bør søke endring på barnebidrag som allerede er bestemt (fastsatt) av Nav",
      en: "if you want to check whether you should apply for a change in child support that has already been determined by Nav",
      nn: "dersom du ønsker å sjekke om du bør søke endring på fostringstilskot som allereie er bestemt (fastsett) av Nav",
    },
  },
});
