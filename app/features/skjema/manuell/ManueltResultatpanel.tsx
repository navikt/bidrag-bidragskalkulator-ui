import {
  Alert,
  BodyLong,
  Button,
  ExpansionCard,
  Heading,
  Link,
  List,
  VStack,
} from "@navikt/ds-react";
import {
  ExpansionCardContent,
  ExpansionCardHeader,
  ExpansionCardTitle,
} from "@navikt/ds-react/ExpansionCard";
import { ListItem } from "@navikt/ds-react/List";
import { useFormContext } from "@rvf/react";
import { Link as RouterLink } from "react-router";
import { sporHendelse, sporHendelseEnGang } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import { type ManuellBidragsutregning } from "../beregning/schema";
import type { ManueltSkjema } from "../schema";

type ManueltResultatpanelProps = {
  data: ManuellBidragsutregning | { error: string };
  ref: React.RefObject<HTMLDivElement | null>;
};

export const ManueltResultatpanel = ({
  data,
  ref,
}: ManueltResultatpanelProps) => {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();

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

  const { barn, medforelder } = form.value();

  const navigasjonState = {
    medforelder: {
      navn: medforelder.navn,
    },
    barn: data.resultater.map((resultat) => ({
      alder: resultat.alder,
      navn:
        barn.find((b) => Number(b.alder) === Number(resultat.alder))?.navn ??
        "",
      sum: resultat.sum,
      bidragstype: resultat.bidragstype,
    })),
  };

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
      <BodyLong spacing>
        {t(tekster.hvordanAvtale(form.field("medforelder.navn").value()))}
      </BodyLong>

      <Button
        as={RouterLink}
        to="/privat-avtale"
        state={navigasjonState}
        variant="primary"
        className="mb-6"
        onClick={() =>
          sporHendelse({
            hendelsetype: "lag privat avtale klikket",
            bidragstype,
          })
        }
      >
        {t(tekster.lagPrivatAvtale.tekst)}
      </Button>

      <BodyLong spacing>{t(tekster.hvisManIkkeKommerTilEnighet)}</BodyLong>

      <VStack gap="3">
        <ExpansionCard
          aria-labelledby="detaljer"
          size="small"
          onToggle={(open) => {
            sporHendelseEnGang({
              hendelsetype: open
                ? "beregningsdetaljer utvidet"
                : "beregningsdetaljer kollapset",
              skjemaId: "barnebidragskalkulator-under-18",
              skjemanavn: "Kalkulator barnebidrag under 18 år",
            });
          }}
        >
          <ExpansionCardHeader>
            <ExpansionCardTitle as="h3" size="small" id="detaljer">
              {t(tekster.detaljer.overskrift)}
            </ExpansionCardTitle>
          </ExpansionCardHeader>
          <ExpansionCardContent>
            <BodyLong spacing>{t(tekster.detaljer.utregningPerBarn)}</BodyLong>
            <List>
              {data.resultater.map((resultat, index) => {
                const barn = form.field(`barn[${index}]`);
                return (
                  <ListItem key={index}>
                    {resultat.bidragstype === "MOTTAKER"
                      ? t(
                          tekster.detaljer.motta(
                            barn.value().navn,
                            resultat.sum,
                          ),
                        )
                      : t(
                          tekster.detaljer.betale(
                            barn.value().navn,
                            resultat.sum,
                          ),
                        )}
                  </ListItem>
                );
              })}
            </List>
          </ExpansionCardContent>
        </ExpansionCard>

        <ExpansionCard aria-labelledby="hva-dekkes" size="small">
          <ExpansionCardHeader>
            <ExpansionCardTitle as="h3" size="small" id="hva-dekkes">
              {t(tekster.bidragetSkalDekke.tittel)}
            </ExpansionCardTitle>
          </ExpansionCardHeader>

          <ExpansionCardContent>
            <BodyLong spacing>
              {t(tekster.bidragetSkalDekke.beskrivelse1)}
            </BodyLong>

            <BodyLong>{t(tekster.bidragetSkalDekke.listeIntro)}</BodyLong>
            <List>
              <ListItem>{t(tekster.bidragetSkalDekke.liste1)}</ListItem>
              <ListItem>{t(tekster.bidragetSkalDekke.liste2)}</ListItem>
              <ListItem>{t(tekster.bidragetSkalDekke.liste3)}</ListItem>
            </List>

            <BodyLong spacing>
              {t(tekster.bidragetSkalDekke.beskrivelse2)}
            </BodyLong>

            <BodyLong>
              <Link
                href={t(tekster.bidragetSkalDekke.lesMerLenke)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(tekster.bidragetSkalDekke.lesMer)}
              </Link>
            </BodyLong>
          </ExpansionCardContent>
        </ExpansionCard>
      </VStack>
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
  hvordanAvtale: (navn) => ({
    nb: `Den endelige summen på barnebidraget avtaler du med ${navn || "den andre forelderen"}. Da står dere fritt til å endre avtalen på et senere tidspunkt, om ting som inntekt eller samvær skulle endre seg. Om du vil, kan du opprette en slik avtale her:`,
    en: `The final amount of child support is agreed upon with ${navn || "the other parent"}. You are free to change the agreement at a later time if things like income or custody change. If you want, you can create such an agreement here:`,
    nn: `Den endelege summen på fostringstilskotet er noko du avtalar med ${navn || "den andre forelderen"}. Du står fritt til å endre avtalen på eit seinare tidspunkt, viss ting som inntekt eller samvær endrar seg. Om du vil, kan du opprette ein slik avtale her:`,
  }),
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
      nn: "Fostringstilskotet over er ei oppsummering av kva du skal betale eller motta per månad for kvart av barna. For kvart barn ser rekninga slik ut:",
    },
    motta: (navn, kostnad) => ({
      nb: (
        <>
          For {navn} skal du motta{" "}
          <strong>{formatterSum(kostnad as number)}</strong> i barnebidrag per
          måned.
        </>
      ),
      en: (
        <>
          For {navn}, you should receive{" "}
          <strong>{formatterSum(kostnad as number)}</strong> in child support
          per month.
        </>
      ),
      nn: (
        <>
          For {navn} skal du motta{" "}
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
    lenke: {
      nb: "https://www.nav.no/fyllut/nav550060?sub=paper",
      en: "https://www.nav.no/fyllut/nav550060?lang=en&sub=paper",
      nn: "https://www.nav.no/fyllut/nav550060?lang=nn-NO&sub=paper",
    },
    tekst: {
      nb: "Lag privat avtale",
      en: "Make a private agreement",
      nn: "Lag ein privat avtale",
    },
    nyFane: {
      nb: "Åpnes i ny fane",
      en: "Opens in a new tab",
      nn: "Opnast i ny fane",
    },
  },
  bidragetSkalDekke: {
    tittel: {
      nb: "Hva barnebidraget skal dekke",
      en: "What the child support should cover",
      nn: "Kva fostringstilskotet skal dekke",
    },
    beskrivelse1: {
      nb: "Når dere inngår en privat avtale om barnebidrag, bestemmer dere selv hva barnebidraget skal dekke. Som et minimum må barnebidraget dekke kostnadene ved å forsørge barnet i hverdagen, også kalt underholdskostnadene.",
      en: "When you enter into a private agreement on child support, you decide for yourselves what the support should cover. As a minimum, the support must cover the costs of caring for the child in everyday life, also known as maintenance costs.",
      nn: "Når de inngår ein privat avtale om fostringstilskot, bestemmer de sjølve kva fostringstilskotet skal dekke. Som eit minimum må fostringstilskotet dekke kostnadane ved å forsørgje barnet i kvardagen, også kalla underhaldskostnadar.",
    },
    listeIntro: {
      nb: "Dette inkluderer:",
      en: "This includes:",
      nn: "Dette inkluderer:",
    },
    liste1: {
      nb: "forbruksutgifter (klær, sko, mat og drikke, fritidsaktiviteter med mer)",
      en: "consumer expenses (clothing, shoes, food & drinks, leisure activities, etc)",
      nn: "forbruksutgifter (klede, sko, mat og drikke, fritidsaktivitetar med meir)",
    },
    liste2: {
      nb: "boutgifter (barnets andel av boutgiftene)",
      en: "housing costs (the child’s share of housing costs)",
      nn: "buutgifter (barnet sin del av buutgiftene)",
    },
    liste3: {
      nb: "tilsynsutgifter (barnehage, skolefritidsordning, dagmamma)",
      en: "child-care costs (kindergarten, after-school programme (SFO), nanny)",
      nn: "tilsynsutgifter (barnehage, skulefritidsordning, dagmamma)",
    },
    beskrivelse2: {
      nb: "Det er underholdkostnadene Nav tar utgangspunkt i når vi fastsetter barnebidraget.",
      en: "It is the maintenance costs that Nav uses as a basis when determining the support.",
      nn: "Det er underhaldskostnadene Nav tek utgangspunkt i når vi fastset fostringstilskotet.",
    },
    lesMer: {
      nb: "Les mer om hva barnebidraget skal dekke",
      en: "Read more about what child support should cover",
      nn: "Les meir om kva fostringstilskotet skal dekke",
    },
    lesMerLenke: {
      nb: "https://www.nav.no/barnebidrag#hva",
      en: "https://www.nav.no/barnebidrag/en#what",
      nn: "https://www.nav.no/barnebidrag#hva",
    },
  },
});
