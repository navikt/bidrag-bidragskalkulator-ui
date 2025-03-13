import { BodyLong, GuidePanel, Heading, Link } from "@navikt/ds-react";

export function IntroPanel() {
  return (
    <GuidePanel poster>
      <Heading spacing size="small">
        Hva kan du bruke barnebidragskalkulatoren til?
      </Heading>
      <BodyLong spacing>
        Barnebidraget avtaler du med den andre forelderen eller søker Nav om
        hjelp til å fastsette.
      </BodyLong>
      <BodyLong spacing>
        Denne kalkulatoren hjelper deg å regne ut hva du skal betale eller motta
        i barnebidrag. Du fyller inn noen få opplysninger, og får et forenklet
        forslag til barnebidrag.
      </BodyLong>
      <BodyLong>
        Forslaget er basert på noen få opplysninger, som gjør det enkelt å få en
        omtrentlig sum. Om du ønsker en mer presis kalkulering, kan du bruke den{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          gamle bidragskalkulatoren
        </Link>{" "}
        for å legge inn flere opplysninger og få en riktigere sum.
      </BodyLong>
    </GuidePanel>
  );
}
