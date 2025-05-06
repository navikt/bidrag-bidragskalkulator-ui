import { BodyLong, GuidePanel } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";

export function IntroPanel() {
  const { t } = useOversettelse();
  const personinformasjon = usePersoninformasjon();

  const forhåndsvalgtMotpart =
    personinformasjon.barnerelasjoner.length === 1
      ? (personinformasjon.barnerelasjoner[0].motpart ?? undefined)
      : undefined;

  return (
    <GuidePanel poster>
      <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
      <BodyLong>
        {forhåndsvalgtMotpart
          ? t(tekster.innhold2MedNavn(forhåndsvalgtMotpart.fornavn))
          : t(tekster.innhold2)}
      </BodyLong>
    </GuidePanel>
  );
}

const tekster = definerTekster({
  innhold1: {
    nb: "Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
    en: "The child support calculator helps you calculate how much you should pay or receive in child support.",
    nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
  },
  innhold2: {
    nb: "Summen kan du bruke til å lage en avtale med den andre forelderen.",
    en: "The sum can be used to make an agreement with the other parent.",
    nn: "Du kan bruke summen til å lage ein avtale med den andre forelderen.",
  },
  innhold2MedNavn: (navn) => ({
    nb: `Summen kan du bruke til å lage en avtale med ${navn}.`,
    en: `The sum can be used to make an agreement with ${navn}.`,
    nn: `Du kan bruke summen til å lage ein avtale med ${navn}.`,
  }),
});
