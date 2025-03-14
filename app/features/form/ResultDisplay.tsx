import { Alert, BodyLong, Button, Heading, Link } from "@navikt/ds-react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import type { FormResponse } from "./validator";
type ResultDisplayProps = {
  data: FormResponse | null;
  ref: React.RefObject<HTMLDivElement | null>;
};

export const ResultDisplay = ({ data, ref }: ResultDisplayProps) => {
  const { t } = useOversettelse();
  if (!data) {
    return null;
  }

  if ("error" in data) {
    return (
      <div className="mt-6">
        <Alert variant="error">
          <Heading size="small" spacing>
            {t(tekster.noeGikkFeil)}
          </Heading>
          <BodyLong>{data.error}</BodyLong>
        </Alert>
      </div>
    );
  }

  const totalSum = data.resultater.reduce((sum, neste) => sum + neste.sum, 0);

  return (
    <div className="mt-6" ref={ref}>
      <Alert variant="info">
        <Heading size="small" spacing>
          {t(tekster.overskrift(totalSum))}
        </Heading>
        {totalSum === 0 && <BodyLong spacing>{t(tekster.nullBidrag)}</BodyLong>}
        <BodyLong spacing>{t(tekster.innhold1)}</BodyLong>
        <BodyLong spacing>{t(tekster.innhold2)}</BodyLong>
        <BodyLong spacing>{t(tekster.innhold3)}</BodyLong>
        <div className="flex justify-end gap-4">
          <Button
            as="a"
            href="https://www.nav.no/fyllut/nav550060?sub=paper"
            variant="primary"
          >
            {t(tekster.lagPrivatAvtale)}
          </Button>
          <Button
            as="a"
            href="https://www.nav.no/start/soknad-barnebidrag-bidragsmottaker"
            variant="secondary"
          >
            {t(tekster.søkNavOmFastsetting)}
          </Button>
        </div>
      </Alert>
    </div>
  );
};

const tekster = definerTekster({
  noeGikkFeil: {
    nb: "Noe gikk feil under beregningen",
    en: "Something went wrong during the calculation",
    nn: "Nokon gjekk feil under rekningen",
  },
  overskrift: (sum) => ({
    nb: `Bidraget er ${formatterSum(sum as number)} i måneden.`,
    en: `The child support is ${formatterSum(sum as number)} per month.`,
    nn: `Fostringstilskotet er ${formatterSum(sum as number)} per måned.`,
  }),
  nullBidrag: {
    nb: "Det betyr at du ikke skal betale noe i barnebidrag. Det kan være fordi dere har delt samvær likt mellom dere, ofte i kombinasjon at differansen mellom inntektene deres er lav.",
    en: "This means that you should not pay any child support. This may be because you and the other parent have shared custody equally, often in combination with a low difference in income.",
    nn: "Det betyr at du ikke skal betale noe i fostringstilskot. Det kan være fordi du og den andre forelderen har delt samvær likt mellom dere, ofte i kombinasjon at differansen mellom inntektene deres er lav.",
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
        Om du ønsker en mer presis kalkulering, kan du bruke den{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          gammel bidragskalkulatoren
        </Link>{" "}
        til å legge inn flere opplysninger og få en riktigere sum.
      </>
    ),
    nn: (
      <>
        Om du ynskjer ein meir presis kalkulering, kan du bruke den{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          gamle bidragskalkulatoren
        </Link>{" "}
        til å leggje inn fleire opplysningar og få ein riktigare sum.
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
  },
  lagPrivatAvtale: {
    nb: "Lag privat avtale",
    en: "Make a private agreement",
    nn: "Lag ein privat avtale",
  },
  søkNavOmFastsetting: {
    nb: "Søk Nav om fastsetting",
    en: "Ask Nav for determination",
    nn: "Søk Nav om fastsettelse",
  },
});
