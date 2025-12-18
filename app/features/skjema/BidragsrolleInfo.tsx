import { BodyLong, InfoCard } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema } from "./schema";

export default function BidragsrolleInfo() {
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();
  const bidragstype = form.value("bidragstype");
  const barn = form.value("barn");

  if (bidragstype === "") {
    return null;
  }

  const beskrivelseFørsteDel =
    barn.length === 1
      ? t(tekster.beskrivelseDel1.ettBarn)
      : t(tekster.beskrivelseDel1.flereBarn);

  return (
    <InfoCard data-color="info">
      <InfoCard.Header>
        <InfoCard.Title>{t(tekster.header)}</InfoCard.Title>
      </InfoCard.Header>
      <InfoCard.Content>
        {
          <>
            <BodyLong spacing>{beskrivelseFørsteDel}</BodyLong>
            <BodyLong spacing>
              {t(tekster[bidragstype].beskrivelseDel2)}
            </BodyLong>
          </>
        }
      </InfoCard.Content>
    </InfoCard>
  );
}

const tekster = definerTekster({
  header: {
    nb: "Fordeling",
    en: "Distribution",
    nn: "Fordeling",
  },
  beskrivelseDel1: {
    ettBarn: {
      nb: (
        <>
          Basert på det du har lagt inn om bosted og samvær med{" "}
          <span className="font-bold">barnet</span>, samt din og den andre
          forelderen sin inntekt foreslår kalkulatoren at:
        </>
      ),
      en: (
        <>
          Based on what you have entered about the residence and visitation with{" "}
          <span className="font-bold">the child</span>, as well as your and the
          other parent&apos;s income, the calculator suggests that:
        </>
      ),
      nn: (
        <>
          Basert på det du har lagt inn om bustad og samvær med{" "}
          <span className="font-bold">barnet</span>, samt din og den andre
          forelderen sin inntekt føreslår kalkulatoren at:
        </>
      ),
    },
    flereBarn: {
      nb: (
        <>
          Basert på det du har lagt inn om bosted og samvær med{" "}
          <span className="font-bold">barna</span>, samt din og den andre
          forelderen sin inntekt foreslår kalkulatoren at:
        </>
      ),
      en: (
        <>
          Based on what you have entered about the residence and visitation with{" "}
          <span className="font-bold">the children</span>, as well as your and
          the other parent&apos;s income, the calculator suggests that:
        </>
      ),
      nn: (
        <>
          Basert på det du har lagt inn om bustad og samvær med{" "}
          <span className="font-bold">barna</span>, samt din og den andre
          forelderen sin inntekt føreslår kalkulatoren at:
        </>
      ),
    },
  },
  MOTTAKER: {
    beskrivelseDel2: {
      nb: (
        <>
          Det er du{" "}
          <span className="font-bold">som skal motta barnebidrag</span> og den
          andre forelderen som skal betale barnebidrag.
        </>
      ),
      en: (
        <>
          It is you <span className="font-bold">who will receive</span> the
          child support and the other parent who will pay the child support.
        </>
      ),
      nn: (
        <>
          Det er du{" "}
          <span className="font-bold">som skal motta barnebidrag</span> og den
          andre forelderen som skal betale barnebidrag.
        </>
      ),
    },
  },
  PLIKTIG: {
    beskrivelseDel2: {
      nb: (
        <>
          Det er den andre forelderen{" "}
          <span className="font-bold">som skal motta barnebidrag</span> og du
          som skal betale barnebidrag.
        </>
      ),
      en: (
        <>
          It is the other parent{" "}
          <span className="font-bold">who will receive</span> the child support
          and you who will pay the child support.
        </>
      ),
      nn: (
        <>
          Det er den andre forelderen{" "}
          <span className="font-bold">som skal motta barnebidrag</span> og du
          som skal betale barnebidrag.
        </>
      ),
    },
  },
});
