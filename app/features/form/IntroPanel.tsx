import { BodyLong, GuidePanel, Heading, Link } from "@navikt/ds-react";
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
      <BodyLong>{t(tekster.innhold3)}</BodyLong>
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
    nb: "Barnebidraget avtaler du med den andre forelderen eller søker Nav om hjelp til å fastsette.",
    en: "The child support is agreed upon with the other parent or sought by Nav to determine.",
    nn: "Fostringstilskotet avtaler du med den andre forelderen eller søkjer Nav om hjelp til å fastsettje.",
  },
  innhold2: {
    nb: "Forslaget er basert på noen få opplysninger, som gjør det enkelt å få en omtrentlig sum.",
    en: "The proposal is based on a few pieces of information, making it easy to get an approximate sum.",
    nn: "Forslaget er basert på nokon få opplysningar, som gjør det enkelt å få ein omtrentleg sum.",
  },
  innhold3: {
    nb: (
      <>
        Om du ønsker en mer presis kalkulering, kan du bruke{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          den gamle bidragskalkulatoren
        </Link>{" "}
        til å legge inn flere opplysninger og få en riktigere sum.
      </>
    ),
    en: (
      <>
        If you want a more precise calculation, you can use the{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          old child support calculator
        </Link>{" "}
        to enter more information and get a more accurate sum.
      </>
    ),
    nn: (
      <>
        Om du ynskjer ein meir presis kalkulering, kan du bruke den{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          gamle tilskotskalkulatoren
        </Link>{" "}
        til å leggje inn fleire opplysningar og få ein riktigare sum.
      </>
    ),
  },
});
