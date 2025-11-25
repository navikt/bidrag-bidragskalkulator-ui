import { useFormContext } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import JaNeiRadio from "~/components/ui/JaNeiRadio";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema, Bidragstype } from "../schema";
import type { NavYtelse } from "../Ytelser";

type Props = {
  valgteYtelser: NavYtelse[];
  harDeltBosted: boolean;
  bidragstype: Bidragstype;
};

export default function Kontantstøtte({
  valgteYtelser,
  harDeltBosted,
  bidragstype,
}: Props) {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const barn = form.value("barn");

  // Finn alle barn som er 1 år (eller mellom MIN og MAKS kontantstøtte-alder)
  const barnMedKontantstøtte = barn.filter(
    (b) => Number(b.alder) === 1, // Kun 1 år gamle barn
  );

  // Kontantstøtte
  const mottarKontantstøtte = valgteYtelser.includes("kontantstøtte");

  // VIKTIG: Logikken er nå snudd riktig vei
  const harDeltBostedOgMottarKontantstøtte =
    mottarKontantstøtte && harDeltBosted;
  const harIkkeDeltBostedOgMottarKontantstøtte =
    mottarKontantstøtte && !harDeltBosted;

  const delerKontantstøtte =
    harDeltBostedOgMottarKontantstøtte &&
    form.value("ytelser.kontantstøtte.deler") === "true";

  // Generer label dynamisk basert på antall barn
  const genererKontantstøtteLabel = () => {
    if (barnMedKontantstøtte.length === 0) return "";

    if (barnMedKontantstøtte.length === 1) {
      return t(tekster[bidragstype].kontantstøtte.etBarn);
    }

    // Flere barn med samme alder (f.eks. tvillinger)
    return t(tekster[bidragstype].kontantstøtte.flereBarn);
  };

  if (!mottarKontantstøtte) return null;

  return (
    <>
      {/* Når barnet IKKE har delt bosted → spør direkte om beløp */}
      {harIkkeDeltBostedOgMottarKontantstøtte && (
        <FormattertTallTextField
          {...form.field("ytelser.kontantstøtte.beløp").getControlProps()}
          label={genererKontantstøtteLabel()}
          error={form.field("ytelser.kontantstøtte.beløp").error()}
          htmlSize={15}
          className="pl-8"
        />
      )}

      {/* Når barnet HAR delt bosted → spør først om de deler, deretter beløp */}
      {harDeltBostedOgMottarKontantstøtte && (
        <>
          <JaNeiRadio
            {...form.field("ytelser.kontantstøtte.deler").getInputProps()}
            legend={t(tekster[bidragstype].kontantstøtte.deltFastBosted)}
            error={form.field("ytelser.kontantstøtte.deler").error()}
            className="pl-8"
          />

          {delerKontantstøtte && (
            <FormattertTallTextField
              {...form.field("ytelser.kontantstøtte.beløp").getControlProps()}
              label={genererKontantstøtteLabel()}
              error={form.field("ytelser.kontantstøtte.beløp").error()}
              htmlSize={15}
              className="pl-8"
            />
          )}
        </>
      )}
    </>
  );
}

const tekster = definerTekster({
  MOTTAKER: {
    kontantstøtte: {
      etBarn: {
        nb: "Hvor mye mottar du i kontantstøtte for Barn 1 år per måned?",
        en: "How much cash-for-care benefit do you receive for Child 1 year per month?",
        nn: "Kor mykje mottar du i kontantstøtte for Barn 1 år per månad?",
      },
      flereBarn: {
        nb: "Hvor mye mottar du i kontantstøtte for Barn 1 år per måned?",
        en: "How much cash-for-care benefit do you receive for Children 1 year per month?",
        nn: "Kor mykje mottar du i kontantstøtte for Barn 1 år per månad?",
      },
      deltFastBosted: {
        nb: "Deler du og den andre forelderen kontantstøtten for dette barnet?",
        en: "Do you and the other parent share the cash-for-care benefit for this child?",
        nn: "Deler du og den andre forelderen kontantstøtta for dette barnet?",
      },
    },
  },
  PLIKTIG: {
    kontantstøtte: {
      etBarn: {
        nb: "Hvor mye mottar bidragsmottaker i kontantstøtte for Barn 1 år per måned?",
        en: "How much cash-for-care benefit does the support recipient receive for Child 1 year per month?",
        nn: "Kor mykje mottar bidragsmottakar i kontantstøtte for Barn 1 år per månad?",
      },
      flereBarn: {
        nb: "Hvor mye mottar bidragsmottaker i kontantstøtte for Barn 1 år per måned?",
        en: "How much cash-for-care benefit does the support recipient receive for Children 1 year per month?",
        nn: "Kor mykje mottar bidragsmottakar i kontantstøtte for Barn 1 år per månad?",
      },
      deltFastBosted: {
        nb: "Deler du og den andre forelderen kontantstøtten for dette barnet?",
        en: "Do you and the other parent share the cash-for-care benefit for this child?",
        nn: "Deler du og den andre forelderen kontantstøtta for dette barnet?",
      },
    },
  },
});
