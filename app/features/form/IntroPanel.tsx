import { BodyLong, GuidePanel, Heading } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

export function IntroPanel() {
  const { t } = useOversettelse();
  return (
    <GuidePanel poster>
      <Heading spacing size="small">
        {t(tekster.overskrift)}
      </Heading>
      <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
      <BodyLong spacing>{t(tekster.innhold2)}</BodyLong>
    </GuidePanel>
  );
}

const tekster = definerTekster({
  overskrift: {
    nb: <>Hva kan du bruke barnebidrags&shy;kalkulatoren til?</>,
    en: "What can the child support calculator be used for?",
    nn: <>Kva kan du bruke fostringstilskots&shy;kalkulatoren til?</>,
  },
  innhold1: {
    nb: "Barnebidraget avtaler du med den andre forelderen eller søker Nav om hjelp til å fastsette. Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
    en: "The child support is agreed upon with the other parent or sought by Nav to determine. The child support calculator helps you calculate how much you should pay or receive in child support.",
    nn: "Fostringstilskotet avtaler du med den andre forelderen eller søkjer Nav om hjelp til å fastsettje. Fostringstilskotskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i fostringstilskot.",
  },
  innhold2: {
    nb: "Forslaget er basert på noen få opplysninger, som gjør det enkelt å få en omtrentlig sum.",
    en: "The proposal is based on a few pieces of information, making it easy to get an approximate sum.",
    nn: "Forslaget er basert på nokon få opplysningar, som gjør det enkelt å få ein omtrentleg sum.",
  },
});
