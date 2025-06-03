import { BodyLong, GuidePanel } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function IntroPanel() {
  const { t } = useOversettelse();

  return (
    <GuidePanel poster>
      <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
      <BodyLong>{t(tekster.innhold)}</BodyLong>
    </GuidePanel>
  );
}

const tekster = definerTekster({
  innhold1: {
    nb: "Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
    en: "The child support calculator helps you calculate how much you should pay or receive in child support.",
    nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
  },
  innhold: {
    nb: "Summen bruker du til å avtale barnebidrag med den andre forelderen. Hvis du har barn med flere, velger du kun de barna du har med den forelderen som du ønsker å avtale barnebidrag med.",
    en: "The sum can be used to make an agreement with the other parent. If you have children with multiple parents, you only select the children you have with the parent you want to agree on child support with.",
    nn: "Summen bruker du til å avtale fostringstilskot med den andre forelderen. Dersom du har barn med fleire, velger du berre dei barna du har med den forelderen som du ønsker å avtale fostringstilskot med.",
  },
});
