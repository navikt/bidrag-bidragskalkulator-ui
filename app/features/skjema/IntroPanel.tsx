import { BodyLong, GuidePanel, Link } from "@navikt/ds-react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function IntroPanel() {
  const { t } = useOversettelse();

  return (
    <GuidePanel poster>
      <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
      <BodyLong spacing>{t(tekster.innhold2)}</BodyLong>
      <BodyLong>{t(tekster.innhold3)}</BodyLong>
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
    en: "The sum can be used to make an agreement with the other parent. If you have children with multiple parents, you only select the children you have with the parent you want to agree on child support with.",
    nn: "Summen bruker du til å avtale fostringstilskot med den andre forelderen. Dersom du har barn med fleire, velger du berre dei barna du har med den forelderen som du ønsker å avtale fostringstilskot med.",
  },
  innhold3: {
    nb: (
      <>
        Hvis den som skal betale barnebidrag, også betaler barnebidrag for andre
        barn, må du bruke{" "}
        <Link
          href="https://tjenester.nav.no/bidragskalkulator/innledning"
          onClick={sporGåTilGammelKalkulatorKlikket}
        >
          den gamle kalkulatoren
        </Link>
        .
      </>
    ),
    en: (
      <>
        If the person required to pay child support is already paying child
        support for other children, you must use{" "}
        <Link
          href="https://tjenester.nav.no/bidragskalkulator/innledning"
          onClick={sporGåTilGammelKalkulatorKlikket}
        >
          the old calculator
        </Link>
        .
      </>
    ),
    nn: (
      <>
        Dersom den som skal betale barnebidrag, allereie betalar barnebidrag for
        andre barn, må du bruke{" "}
        <Link
          href="https://tjenester.nav.no/bidragskalkulator/innledning"
          onClick={sporGåTilGammelKalkulatorKlikket}
        >
          den gamle kalkulatoren
        </Link>
        .
      </>
    ),
  },
});
