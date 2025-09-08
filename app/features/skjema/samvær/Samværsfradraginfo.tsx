import { BodyLong, BodyShort, List, ReadMore } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useKalkulatorgrunnlagsdata } from "~/routes/kalkulator";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import type { Samværsklasse } from "../beregning/schema";
import { SAMVÆRSKLASSE_GRENSER } from "../utils";

type SamværsfradraginfoProps = {
  alder: number | undefined;
  samværsklasse: Samværsklasse | undefined;
};

const samværsklassenumre = Object.values(SAMVÆRSKLASSE_GRENSER).map(
  (klasse) => klasse.klassenummer,
);

const getSamværsklasseNetterPeriode = (
  klassenummer: (typeof samværsklassenumre)[number],
) => {
  const { min, max } = SAMVÆRSKLASSE_GRENSER[`SAMVÆRSKLASSE_${klassenummer}`];

  return `${min}–${max}`;
};

export const Samværsfradraginfo = ({
  alder,
  samværsklasse,
}: SamværsfradraginfoProps) => {
  const { samværsfradrag } = useKalkulatorgrunnlagsdata();
  const { t } = useOversettelse();

  const samværsfradragForAlder =
    alder === undefined
      ? undefined
      : samværsfradrag.find(
          (fradrag) => alder >= fradrag.alderFra && alder <= fradrag.alderTil,
        );

  return (
    <ReadMore
      header={t(tekster.overskrift)}
      onOpenChange={(open) => {
        if (open) {
          sporHendelse({
            hendelsetype: "les mer utvidet",
            tekst: t(tekster.overskrift),
            id: "kalkulator-bosted-og-samvær",
          });
        }
      }}
    >
      <BodyLong className="mb-4">{t(tekster.beskrivelse)}</BodyLong>

      {alder === undefined && <BodyShort>{t(tekster.manglerAlder)}</BodyShort>}

      {samværsfradragForAlder && alder !== undefined && (
        <>
          <BodyShort className="mb-2">
            {t(tekster.fradragslistetittel(alder))}
          </BodyShort>

          <List>
            {samværsklassenumre.map((klasse) => {
              const erValgtSamværsklasse =
                samværsklasse === `SAMVÆRSKLASSE_${klasse}`;

              const beløpFradrag =
                klasse === 0
                  ? 0
                  : samværsfradragForAlder.beløpFradrag[
                      `SAMVÆRSKLASSE_${klasse}`
                    ];

              return (
                <ListItem key={klasse}>
                  <span
                    className={erValgtSamværsklasse ? "font-bold" : undefined}
                  >
                    {t(
                      tekster.fradragNetter(
                        getSamværsklasseNetterPeriode(klasse),
                        formatterSum(beløpFradrag),
                      ),
                    )}
                  </span>
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </ReadMore>
  );
};

const tekster = definerTekster({
  overskrift: {
    nb: "Hvorfor vi spør om bosted og samvær",
    en: "Why we ask about residence and visitation",
    nn: "Kvifor vi spør om bustad og samvær",
  },
  beskrivelse: {
    nb: "Når barnet bor fast hos én forelder og har samvær med den andre, kan den andre forelderen få fradrag i barnebidraget. Fradraget er avhengig av hvor gammelt barnet er, og hvor mye tid barnet tilbringer med hver forelder.",
    en: "When the child has a permanent residence with one parent and visitation with the other, the other parent can receive a deduction in child support. The deduction depends on the age of the child and how much time the child spends with each parent.",
    nn: "Når barnet bur fast hos éin forelder og har samvær med den andre, kan den andre forelderen få fradrag i barnebidraget. Fradraget er avhengig av kor gammalt barnet er, og kor mykje tid barnet tilbringer med kvar forelder.",
  },
  manglerAlder: {
    nb: "Fyll inn alderen på barnet for å se fradraget for samvær.",
    en: "Fill in the child's age to see the deduction for visitation.",
    nn: "Fyll inn kor gammalt barnet er for å sjå fradraget for samvær.",
  },
  fradragslistetittel: (alder) => ({
    nb: `Fradrag per måned for samvær med barn på ${alder} år:`,
    en: `Deductions per month for visitation with child ${alder} years old:`,
    nn: `Fradrag per månad for samvær med barn på ${alder} år:`,
  }),
  fradragNetter: (netter, beløp) => ({
    nb: `${netter} netter: ${beløp}`,
    en: `${netter} nights: ${beløp}`,
    nn: `${netter} netter: ${beløp}`,
  }),
});
