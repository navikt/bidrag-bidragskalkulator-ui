import {
  BodyLong,
  BodyShort,
  List,
  Radio,
  RadioGroup,
  ReadMore,
} from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useFormContext, useFormScope } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import type { Samværsklasse } from "./beregning/schema";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";
import { FastBosted, type ManueltSkjema } from "./schema";
import {
  kalkulerSamværsklasse,
  SAMVÆR_STANDARDVERDI,
  SAMVÆRSKLASSE_GRENSER,
} from "./utils";

type SamværProps = {
  barnIndex: number;
};
export function Samvær({ barnIndex }: SamværProps) {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();
  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));
  const samvær = barnField.value("samvær") || SAMVÆR_STANDARDVERDI;
  const navnMedforelder = form.value("medforelder.navn");
  const samværsgradBeskrivelse =
    samvær === "1"
      ? t(tekster.samvær.enNatt)
      : t(tekster.samvær.netter(samvær));

  const bosted = barnField.value("bosted");
  const borHosMeg = bosted === "HOS_MEG";
  const borHosMedforelder = bosted === "HOS_MEDFORELDER";
  const alder = barnField.value("alder");

  return (
    <>
      <RadioGroup
        {...barnField.getControlProps("bosted", {
          onChange: () => {
            barnField.field("samvær").setValue(SAMVÆR_STANDARDVERDI);
          },
        })}
        error={barnField.field("bosted").error()}
        legend={t(tekster.bosted.label)}
      >
        {FastBosted.options.map((bosted) => {
          return (
            <Radio value={bosted} key={bosted}>
              {t(tekster.bosted.valg[bosted](navnMedforelder))}
            </Radio>
          );
        })}
      </RadioGroup>

      {borHosMeg && (
        <Slider
          {...barnField.field("samvær").getControlProps()}
          label={t(tekster.samvær.label)}
          description={t(tekster.samvær.beskrivelse)}
          error={barnField.field("samvær").error()}
          min={15}
          max={30}
          step={1}
          list={[
            {
              label: t(tekster.samvær.beskrivelser.halvpartenAvTidenHosDeg),
              value: 15,
            },
            {
              label: t(tekster.samvær.beskrivelser.alleNetterHosDeg),
              value: 30,
            },
          ]}
          valueDescription={samværsgradBeskrivelse}
        />
      )}
      {borHosMedforelder && (
        <Slider
          {...barnField.field("samvær").getControlProps()}
          label={t(tekster.samvær.label)}
          description={t(tekster.samvær.beskrivelse)}
          error={barnField.field("samvær").error()}
          min={0}
          max={15}
          step={1}
          list={[
            {
              label: t(tekster.samvær.beskrivelser.ingenNetterHosDeg),
              value: 0,
            },
            {
              label: t(tekster.samvær.beskrivelser.halvpartenAvTidenHosDeg),
              value: 15,
            },
          ]}
          valueDescription={samværsgradBeskrivelse}
        />
      )}

      <Samværsfradraginfo
        alder={alder ? Number(alder) : undefined}
        samværsklasse={
          bosted ? kalkulerSamværsklasse(Number(samvær), bosted) : undefined
        }
      />
    </>
  );
}

type SamværsfradraginfoProps = {
  alder?: number;
  samværsklasse?: Samværsklasse;
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

const Samværsfradraginfo = ({
  alder,
  samværsklasse,
}: SamværsfradraginfoProps) => {
  const personinformasjon = usePersoninformasjon();
  const { t } = useOversettelse();

  const samværsfradragForAlder =
    alder === undefined
      ? undefined
      : personinformasjon.samværsfradrag.find(
          (fradrag) => alder >= fradrag.alderFra && alder <= fradrag.alderTil,
        );

  return (
    <ReadMore header={t(tekster.samværsfradrag.overskrift)}>
      <BodyLong className="mb-4">
        {t(tekster.samværsfradrag.beskrivelse)}
      </BodyLong>

      {alder === undefined && (
        <BodyShort>{t(tekster.samværsfradrag.manglerAlder)}</BodyShort>
      )}

      {samværsfradragForAlder && alder !== undefined && (
        <>
          <BodyShort className="mb-2">
            {t(tekster.samværsfradrag.fradragslistetittel(alder))}
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
                      tekster.samværsfradrag.fradragNetter(
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
  bosted: {
    label: {
      nb: "Hvor skal barnet bo fast?",
      en: "Where will the child have a permanent address?",
      nn: "Kvar skal barnet bu fast?",
    },
    valg: {
      velg: {
        nb: "Velg hvor barnet skal bo",
        en: "Select where the child will live",
        nn: "Velg kvar barnet skal bu",
      },
      DELT_FAST_BOSTED: () => ({
        nb: "Vi har avtale om fast bosted hos begge (delt fast bosted)",
        en: "We have an agreement on permanent residence with both of us (shared permanent residence)",
        nn: "Vi har avtale om fast bustad hos begge (delt fast bustad)",
      }),
      HOS_MEG: (navn) => ({
        nb: `Barnet bor fast hos meg, og har samvær med ${navn || "den andre forelderen"}`,
        en: `The child lives with me and has visitation with ${navn || "the other co-parent"}`,
        nn: `Barnet bur fast hos meg, og har samvær med ${navn || "den andre forelderen"}`,
      }),
      HOS_MEDFORELDER: (navn) => ({
        nb: `Barnet bor fast hos ${navn || "den andre forelderen"}, og har samvær med meg`,
        en: `The child lives with ${navn || "the other co-parent"} and has visitation with me`,
        nn: `Barnet bur fast hos ${navn || "den andre forelderen"}, og har samvær med meg`,
      }),
    },
  },
  samvær: {
    label: {
      nb: "Hvor mye vil barnet være sammen med deg?",
      en: "How much will the child stay with you?",
      nn: "Kor mykje vil barnet vere saman med deg?",
    },
    beskrivelse: {
      nb: "Estimer hvor mange netter barnet vil være hos deg i snitt per måned",
      en: "Estimate how many nights the child will stay with you on average per month",
      nn: "Estimer kor mange netter barnet vil vere hos deg i snitt per månad",
    },
    netter: (antall) => ({
      nb: `${antall} netter hos deg`,
      en: `${antall} nights with you`,
      nn: `${antall} netter hos deg`,
    }),
    enNatt: {
      nb: "1 natt hos deg",
      en: "1 night with you",
      nn: "1 natt hos deg",
    },
    beskrivelser: {
      ingenNetterHosDeg: {
        nb: "Ingen netter hos deg",
        en: "No nights with you",
        nn: "Ingen netter hos deg",
      },
      halvpartenAvTidenHosDeg: {
        nb: "Halvparten av nettene hos deg",
        en: "Half the nights with you",
        nn: "Halvparten av nettene hos deg",
      },
      alleNetterHosDeg: {
        nb: "Alle netter hos deg",
        en: "All the nights with you",
        nn: "Alle netter hos deg",
      },
    },
  },
  samværsfradrag: {
    overskrift: {
      nb: "Hvorfor vi spør om bosted og samvær",
      en: "Why we ask about residence and visitation",
      nn: "Kvifor vi spør om bustad og samvær",
    },
    beskrivelse: {
      nb: "Når barnet bor fast hos én forelder og har samvær med den andre, kan den andre forelderen få fradrag i barnebidraget. Fradraget avhenger av barnets alder og hvor mye tid barnet tilbringer hos hver forelder.",
      en: "When the child has a permanent residence with one parent and visitation with the other, the other parent can receive a deduction in child support. The deduction depends on the age of the child and how much time the child spends with each parent.",
      nn: "Når barnet bur fast hos éin forelder og har samvær med den andre, kan den andre forelderen få fradrag i barnebidraget. Fradraget avhenger av barnets alder og kor mykje tid barnet tilbringer hos kvar forelder.",
    },
    manglerAlder: {
      nb: "Fyll ut barnets alder for å se fradraget for samvær.",
      en: "Fill in the child's age to see the deduction for visitation.",
      nn: "Fyll ut barnets alder for å sjå fradraget for samvær.",
    },
    fradragslistetittel: (alder) => ({
      nb: `Fradrag for samvær med barn ${alder} år:`,
      en: `Deductions for visitation with child ${alder} years old:`,
      nn: `Fradrag for samvær med barn ${alder} år:`,
    }),
    fradragNetter: (netter, beløp) => ({
      nb: `${netter} netter: ${beløp} per måned`,
      en: `${netter} nights: ${beløp} per month`,
      nn: `${netter} netter: ${beløp} per månad`,
    }),
  },
});
