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
import { sporHendelse, sporHendelseEnGang } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import type { ManuellBidragsutregning } from "../beregning/schema";

type ManueltResultatpanelProps = {
  data: ManuellBidragsutregning | { error: string };
  ref: React.RefObject<HTMLDivElement | null>;
};

export const ManueltResultatpanel = ({
  data,
  ref,
}: ManueltResultatpanelProps) => {
  const { t } = useOversettelse();

  if ("error" in data) {
    return (
      <Alert variant="error">
        <Heading level="2" size="small" spacing ref={ref} tabIndex={-1}>
          {t(tekster.noeGikkFeil)}
        </Heading>
        <BodyLong>{data.error}</BodyLong>
      </Alert>
    );
  }

  const totalSum = data.resultater.reduce((sum, neste) => {
    if (neste.bidragstype === "PLIKTIG") {
      return sum + neste.sum;
    }
    return sum - neste.sum;
  }, 0);

  const bidragstyper = data.resultater.map((resultat) => resultat.bidragstype);
  const isMottaker = bidragstyper.includes("MOTTAKER");
  const isPliktig = bidragstyper.includes("PLIKTIG");

  const bidragstype =
    isMottaker && isPliktig
      ? "MOTTAKER_OG_PLIKTIG"
      : isMottaker
        ? "MOTTAKER"
        : isPliktig
          ? "PLIKTIG"
          : "INGEN";

  return (
    <Alert variant="info">
      <Heading
        level="2"
        size="small"
        ref={ref}
        tabIndex={-1}
        className="focus:outline-0"
      >
        {totalSum > 0
          ? t(tekster.overskrift.betale(Math.abs(totalSum)))
          : t(tekster.overskrift.motta(Math.abs(totalSum)))}
      </Heading>
      {totalSum === 0 && <BodyLong spacing>{t(tekster.nullBidrag)}</BodyLong>}
      <BodyLong spacing>{t(tekster.hvordanAvtale)}</BodyLong>

      <Button
        as="a"
        href="https://www.nav.no/fyllut/nav550060?sub=paper"
        variant="primary"
        className="mb-6"
        onClick={() =>
          sporHendelse("lag privat avtale klikket", {
            bidragstype,
          })
        }
      >
        {t(tekster.lagPrivatAvtale)}
      </Button>

      <BodyLong spacing>{t(tekster.hvisManIkkeKommerTilEnighet)}</BodyLong>
      <ExpansionCard
        aria-labelledby="detaljer"
        size="small"
        onToggle={(open) => {
          sporHendelseEnGang(
            open
              ? "beregningsdetaljer utvidet"
              : "beregningsdetaljer kollapset",
          );
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
                      ? t(tekster.detaljer.motta(resultat.alder, resultat.sum))
                      : t(
                          tekster.detaljer.betale(resultat.alder, resultat.sum),
                        )}
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </ExpansionCardContent>
      </ExpansionCard>
    </Alert>
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
        sum as number,
      )} i barnebidrag per måned.`,
      en: `You should pay ${formatterSum(
        sum as number,
      )} in child support per month.`,
      nn: `Du skal betale ${formatterSum(
        sum as number,
      )} i fostringstilskot per månad.`,
    }),
    motta: (sum) => ({
      nb: `Du skal motta ${formatterSum(
        sum as number,
      )} i barnebidrag per måned.`,
      en: `You should receive ${formatterSum(
        sum as number,
      )} in child support per month.`,
      nn: `Du skal motta ${formatterSum(
        sum as number,
      )} i fostringstilskot per månad.`,
    }),
  },
  nullBidrag: {
    nb: "Det kan være fordi dere har delt nettene med barnet likt mellom dere, og fordi det er liten forskjell mellom inntektene deres.",
    en: "It may be because you have divided the nights with the child equally between you, and because there is a small difference between your incomes.",
    nn: "Det kan vere fordi dere har delt nettene med barnet likt mellom dere, og fordi det er liten forskjell mellom inntektene deres.",
  },
  hvordanAvtale: {
    nb: "Den endelige summen på barnebidraget avtaler du med den andre forelderen. Da står dere fritt til å endre avtalen på et senere tidspunkt, om ting som inntekt eller samvær skulle endre seg. Om du vil, kan du opprette en slik avtale her:",
    en: "The final amount of child support is agreed upon with the other parent. You are free to change the agreement at a later time if things like income or custody change. If you want, you can create such an agreement here:",
    nn: "Den endelege summen på fostringstilskotet er noko du avtalar med den andre forelderen. Du står fritt til å endre avtalen på eit seinare tidspunkt, viss ting som inntekt eller samvær endrar seg. Om du vil, kan du opprette ein slik avtale her:",
  },
  hvisManIkkeKommerTilEnighet: {
    nb: (
      <>
        Hvis dere ikke blir enige, kan dere søke Nav om hjelp til å fastsette
        barnebidraget. Dette gjør dere ved å søke om{" "}
        <Link href="https://www.nav.no/fyllut/nav540005" target="_blank">
          fastsetting av barnebidrag
        </Link>
        . Vær oppmerksom på at det koster 1314 kroner, og at
        saksbehandlingstiden er 5 måneder.
      </>
    ),
    en: (
      <>
        If you cannot agree, you can ask Nav for help to determine child
        support. This is done by applying for{" "}
        <Link href="https://www.nav.no/fyllut/nav540005" target="_blank">
          determination of child support
        </Link>
        . It costs 1314 kroner, and the processing time is 5 months.
      </>
    ),
    nn: (
      <>
        Om de ikkje blir einige, kan de søkje Nav om hjelp til å fastsetje
        forstringstilskotet. Det gjer de ved å søkje om{" "}
        <Link href="https://www.nav.no/fyllut/nav540005" target="_blank">
          fastsetjing av fostringstilskot
        </Link>
        . Ver merksam på at det kostar 1314 kroner, og at sakshandsamingstida er
        5 månadar.
      </>
    ),
  },
  detaljer: {
    overskrift: {
      nb: "Hvordan bidraget er beregnet",
      en: "How the child support is calculated",
      nn: "Korleis er fostringstilskotet rekna ut?",
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
          The {alder} year old costs{" "}
          <strong>{formatterSum(kostnad as number)}</strong> per month.
        </>
      ),
      nn: (
        <>
          {alder}-åringen kostar{" "}
          <strong>{formatterSum(kostnad as number)}</strong> kroner i månaden.
        </>
      ),
    }),
    underholdskostnadSplitt: {
      nb: "Dette er summen som skal deles mellom deg og den andre forelderen. Hvordan det splittes opp, avhenger av inntekt og samvær, i tillegg til en rekke andre forhold.",
      en: "This is the amount that should be divided between you and the other parent. How it is split depends on income and custody, in addition to a number of other factors.",
      nn: "Desse summane skal du og den andre forelderen dele mellom dykk. Korleis fordelinga mellom dykk blir, er avhengig av inntekt og samver, i tillegg til ei rekkje andre forhold. ",
    },
    utregningPerBarn: {
      nb: "Barnebidraget over er en summering av hva du skal betale eller motta per måned for hvert av barna. Per barn ser beregningen slik ut:",
      en: "The child support above is a summary of what you should pay or receive per month for each of the children. For each child, the calculation looks like this:",
      nn: "Det viktigaste grunnlaget for utrekninga er kva eit barn kostar, kjent som underhaldskostnadar. Desse summane er henta frå referansebudsjettet til SIFO, og dei blir oppdaterte kvart år. Kostnaden for borna dine er:",
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
          For the {alder} year old, you should receive{" "}
          <strong>{formatterSum(kostnad as number)}</strong> in child support
          per month.
        </>
      ),
      nn: (
        <>
          For {alder}-åringen skal du motta{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i fostringstilskot
          per månad.
        </>
      ),
    }),
    betale: (navn, kostnad) => ({
      nb: (
        <>
          For {navn} skal du betale{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i barnebidrag per
          måned.
        </>
      ),
      en: (
        <>
          For {navn}, you should pay{" "}
          <strong>{formatterSum(kostnad as number)}</strong> in child support
          per month.
        </>
      ),
      nn: (
        <>
          For {navn} skal du betale{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i fostringstilskot
          per månad.
        </>
      ),
    }),
  },
  lagPrivatAvtale: {
    nb: "Lag privat avtale",
    en: "Make a private agreement",
    nn: "Lag ein privat avtale",
  },
});
