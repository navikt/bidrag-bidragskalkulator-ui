import {
  Alert,
  BodyLong,
  Button,
  ExpansionCard,
  Heading,
  Link,
  List,
} from "@navikt/ds-react";
import {
  ExpansionCardContent,
  ExpansionCardHeader,
  ExpansionCardTitle,
} from "@navikt/ds-react/ExpansionCard";
import { ListItem } from "@navikt/ds-react/List";
import { useRef } from "react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import type { SkjemaResponse } from "./validator";
type ResultDisplayProps = {
  data: SkjemaResponse | null;
  ref: React.RefObject<HTMLDivElement | null>;
};

export const ResultDisplay = ({ data, ref }: ResultDisplayProps) => {
  const { t } = useOversettelse();
  const beregningsdetaljerAntallSporingerRef = useRef(0);
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

  const totalSum = data.resultater.reduce((sum, neste) => {
    if (neste.bidragstype === "PLIKTIG") {
      return sum + neste.sum;
    }
    return sum - neste.sum;
  }, 0);

  return (
    <div ref={ref} tabIndex={-1}>
      <Alert variant="info">
        <Heading size="small" spacing>
          {totalSum > 0
            ? t(tekster.overskrift.betale(Math.abs(totalSum)))
            : t(tekster.overskrift.motta(Math.abs(totalSum)))}
        </Heading>
        {totalSum === 0 && <BodyLong spacing>{t(tekster.nullBidrag)}</BodyLong>}
        <BodyLong spacing>{t(tekster.hvordanAvtale)}</BodyLong>
        <div className="flex gap-4 justify-start mb-6">
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
        <BodyLong spacing>{t(tekster.callToActionGammelKalkulator)}</BodyLong>
        <ExpansionCard
          aria-labelledby="detaljer"
          size="small"
          onToggle={(open) => {
            // Vi ønsker å unngå å spore at man åpner og lukker og åpner og lukker osv.
            if (beregningsdetaljerAntallSporingerRef.current > 2) {
              return;
            }
            beregningsdetaljerAntallSporingerRef.current++;
            open
              ? sporHendelse("beregningsdetaljer utvidet")
              : sporHendelse("beregningsdetaljer kollapset");
          }}
        >
          <ExpansionCardHeader>
            <ExpansionCardTitle as="h3" size="small" id="detaljer">
              {t(tekster.detaljer.overskrift)}
            </ExpansionCardTitle>
          </ExpansionCardHeader>
          <ExpansionCardContent>
            {data.resultater.length > 1 && (
              <>
                <BodyLong spacing>
                  {t(tekster.detaljer.utregningPerBarn)}
                </BodyLong>
                <List>
                  {data.resultater.map((resultat, index) => (
                    <ListItem key={index}>
                      {resultat.bidragstype === "MOTTAKER"
                        ? t(
                            tekster.detaljer.motta(
                              resultat.barnetsAlder,
                              resultat.sum
                            )
                          )
                        : t(
                            tekster.detaljer.betale(
                              resultat.barnetsAlder,
                              resultat.sum
                            )
                          )}
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            <BodyLong spacing>
              {t(tekster.detaljer.underholdskostnadBeskrivelse)}
            </BodyLong>
            <List>
              {data.resultater.map((resultat, index) => (
                <ListItem key={index}>
                  {t(
                    tekster.detaljer.underholdskostnadPerBarn(
                      resultat.barnetsAlder,
                      resultat.underholdskostnad
                    )
                  )}
                </ListItem>
              ))}
            </List>
            <BodyLong spacing>
              {t(tekster.detaljer.underholdskostnadSplitt)}
            </BodyLong>
          </ExpansionCardContent>
        </ExpansionCard>
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
  overskrift: {
    betale: (sum) => ({
      nb: `Du skal betale ${formatterSum(
        sum as number
      )} i barnebidrag per måned.`,
      en: `You should pay ${formatterSum(
        sum as number
      )} in child support per month.`,
      nn: `Du skal betale ${formatterSum(
        sum as number
      )} i fostringstilskot per måned.`,
    }),
    motta: (sum) => ({
      nb: `Du skal motta ${formatterSum(
        sum as number
      )} i barnebidrag per måned.`,
      en: `You should receive ${formatterSum(
        sum as number
      )} in child support per month.`,
      nn: `Du skal motta ${formatterSum(
        sum as number
      )} i fostringstilskot per måned.`,
    }),
  },
  nullBidrag: {
    nb: "Det betyr at du ikke skal betale noe i barnebidrag. Det kan være fordi dere har delt samvær likt mellom dere, ofte i kombinasjon at differansen mellom inntektene deres er lav.",
    en: "This means that you should not pay any child support. This may be because you and the other parent have shared custody equally, often in combination with a low difference in income.",
    nn: "Det betyr at du ikke skal betale noe i fostringstilskot. Det kan være fordi du og den andre forelderen har delt samvær likt mellom dere, ofte i kombinasjon at differansen mellom inntektene deres er lav.",
  },
  hvordanAvtale: {
    nb: "Barnebidraget avtaler du med den andre forelderen eller søker Nav om hjelp til å fastsette.",
    en: "The child support is agreed upon with the other parent or sought by Nav to determine.",
    nn: "Fostringstilskotet avtaler du med den andre forelderen eller søkjer Nav om hjelp til å fastsettje.",
  },
  detaljer: {
    overskrift: {
      nb: "Hvordan bidraget er beregnet",
      en: "How the child support is calculated",
      nn: "Korleis fostringstilskotet er rekna ut",
    },
    underholdskostnadBeskrivelse: {
      nb: `Det viktigste grunnlaget for beregningen er hva et barn koster – også kjent som underholdskostnader. Disse summene hentes fra SIFOs referansebudsjetter, og oppdateres hvert år. Kostnaden i deres tilfelle er:`,
      en: `The most important basis for the calculation is what a child costs – also known as child support costs. These amounts are taken from SIFOs reference budgets and are updated annually. The cost in their case is:`,
      nn: `Det viktigaste grunnlaget for beregningen er kva eit barn kostar – også kjent som underholdskostnadar. Disse summane hentes frå SIFOs referansebudsjettar, og oppdateres kvart år. Kostnaden i deires tilfelle er:`,
    },
    underholdskostnadPerBarn: (alder, kostnad) => ({
      nb: (
        <>
          {alder}-åringen koster{" "}
          <strong>{formatterSum(kostnad as number)}</strong> kroner i måneden.
        </>
      ),
      en: (
        <>
          The {alder}-year-old costs{" "}
          <strong>{formatterSum(kostnad as number)}</strong> per month.
        </>
      ),
      nn: (
        <>
          {alder}-åringen kostar{" "}
          <strong>{formatterSum(kostnad as number)}</strong> kroner i måneden.
        </>
      ),
    }),
    underholdskostnadSplitt: {
      nb: "Dette er summen som skal deles mellom deg og den andre forelderen. Hvordan det splittes opp, avhenger av inntekt og samvær, i tillegg til en rekke andre forhold.",
      en: "This is the amount that should be divided between you and the other parent. How it is split depends on income and custody, in addition to a number of other factors.",
      nn: "Dette er summen som skal delast mellom deg og den andre forelderen. Kvifor det splittast, avheng av inntekt og samvær, i tillegg til ein rekkje andre forhold.",
    },
    utregningPerBarn: {
      nb: "Barnebidraget over er en summering av hva du skal betale eller motta per måned for hvert av barna. Per barn ser beregningen slik ut:",
      en: "The child support above is a summary of what you should pay or receive per month for each of the children. For each child, the calculation looks like this:",
      nn: "Barnebidraget over er ein summering av kva du skal betale eller motta per månad for kvar av barna. For kvar av barna ser beregningen slik ut:",
    },
    motta: (alder, kostnad) => ({
      nb: (
        <>
          For {alder}-åringen skal du motta{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i barnebidrag per
          måned.
        </>
      ),
      en: (
        <>
          For the {alder}-year-old, you should receive{" "}
          <strong>{formatterSum(kostnad as number)}</strong> in child support
          per month.
        </>
      ),
      nn: (
        <>
          For {alder}-åringen skal du motta{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i fostringstilskot
          per måned.
        </>
      ),
    }),
    betale: (alder, kostnad) => ({
      nb: (
        <>
          For {alder}-åringen skal du betale{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i barnebidrag per
          måned.
        </>
      ),
      en: (
        <>
          For the {alder}-year-old, you should pay{" "}
          <strong>{formatterSum(kostnad as number)}</strong> in child support
          per month.
        </>
      ),
      nn: (
        <>
          For {alder}-åringen skal du betale{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i fostringstilskot
          per måned.
        </>
      ),
    }),
  },
  callToActionGammelKalkulator: {
    nb: (
      <>
        Forslaget er basert på noen få opplysninger, som gjør det enkelt å få en
        omtrentlig sum. Om du ønsker en mer presis kalkulering, kan du bruke{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          den gamle bidragskalkulatoren
        </Link>{" "}
        til å legge inn flere opplysninger og få en riktigere sum.
      </>
    ),
    en: (
      <>
        The proposal is based on a few pieces of information, making it easy to
        get an approximate sum. If you want a more precise calculation, you can
        use the{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          old child support calculator
        </Link>{" "}
        to enter more information and get a more accurate sum.
      </>
    ),
    nn: (
      <>
        Forslaget er basert på nokon få opplysningar, som gjør det enkelt å få
        ein omtrentleg sum. Om du ynskjer ein meir presis kalkulering, kan du
        bruke{" "}
        <Link href="https://tjenester.nav.no/bidragskalkulator/innledning?0">
          den gamle bidragskalkulatoren
        </Link>{" "}
        til å leggje inn fleire opplysningar og få ein riktigare sum.
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
