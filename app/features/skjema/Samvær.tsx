import { Alert, BodyShort, Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { Samværsklasse } from "./beregning/schema";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";
import { FastBosted, type ManueltSkjema } from "./schema";
import { kalkulerSamværsklasse, SAMVÆR_STANDARDVERDI } from "./utils";

type SamværProps = {
  barnIndex: number;
};
export function Samvær({ barnIndex }: SamværProps) {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();
  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));
  const samvær = barnField.value("samvær") || SAMVÆR_STANDARDVERDI;
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
              {t(tekster.bosted.valg[bosted])}
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
      {bosted && alder && (
        <Samværsfradrag
          alder={Number(alder)}
          samværsklasse={kalkulerSamværsklasse(Number(samvær), bosted)}
          bostatus={bosted}
        />
      )}
    </>
  );
}

type SamværsfradragProps = {
  alder: number;
  samværsklasse: Samværsklasse;
  bostatus: "HOS_MEG" | "HOS_MEDFORELDER" | "DELT_FAST_BOSTED";
};
const Samværsfradrag = ({
  alder,
  samværsklasse,
  bostatus,
}: SamværsfradragProps) => {
  const personinformasjon = usePersoninformasjon();
  const { t } = useOversettelse();
  if (bostatus === "DELT_FAST_BOSTED") {
    return (
      <SamværsfradragInfo>
        {t(tekster.samværsfradrag.DELT_FAST_BOSTED)}
      </SamværsfradragInfo>
    );
  }
  if (samværsklasse === "SAMVÆRSKLASSE_0") {
    return (
      <SamværsfradragInfo>
        {t(tekster.samværsfradrag[bostatus].SAMVÆRSKLASSE_0)}
      </SamværsfradragInfo>
    );
  }
  // Vil aldri skje, siden samværsklasse aldri vil være "DELT_BOSTED" når bostatus er "HOS_MEG" eller "HOS_MEDFORELDER"
  // Dette løser kun en type-narrowing issue for TypeScript
  if (samværsklasse === "DELT_BOSTED") {
    return null;
  }

  const samværsfradrag = personinformasjon.samværsfradrag.find(
    (fradrag) => alder >= fradrag.alderFra && alder <= fradrag.alderTil,
  )?.beløpFradrag[samværsklasse];

  if (!samværsfradrag) {
    return null;
  }
  const samværsklasseNummer = Number(samværsklasse.split("_").pop());
  return (
    <SamværsfradragInfo>
      {t(
        tekster.samværsfradrag[bostatus].SAMVÆRSKLASSE_1_TIL_4(
          samværsfradrag.toLocaleString("no-NO", {
            style: "currency",
            currency: "NOK",
          }),
          samværsklasseNummer,
        ),
      )}
    </SamværsfradragInfo>
  );
};

type SamværsfradragInfoProps = {
  children: React.ReactNode;
};
const SamværsfradragInfo = ({ children }: SamværsfradragInfoProps) => {
  return (
    <Alert variant="info">
      <BodyShort size="small">{children}</BodyShort>
    </Alert>
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
      DELT_FAST_BOSTED: {
        nb: "Vi har avtale om fast bosted hos begge (delt fast bosted)",
        en: "We have an agreement on permanent residence with both of us (shared permanent residence)",
        nn: "Vi har avtale om fast bustad hos begge (delt fast bustad)",
      },
      HOS_MEG: {
        nb: "Barnet bor fast hos meg, og har samvær med medforelderen",
        en: "The child lives with me and has visitation with the other co-parent",
        nn: "Barnet bur fast hos meg, og har samvær med medforelderen",
      },
      HOS_MEDFORELDER: {
        nb: "Barnet bor fast hos medforelder, og har samvær med meg",
        en: "The child lives with the co-parent and has visitation with me",
        nn: "Barnet bur fast hos medforelder, og har samvær med meg",
      },
      hosDenAndre: (navn) => ({
        nb: `Barnet bor hos ${navn}`,
        en: `The child lives with ${navn}`,
        nn: `Barnet bur hos ${navn}`,
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
    HOS_MEG: {
      SAMVÆRSKLASSE_0: {
        nb: "Når barnet ikke har samvær med den andre forelderen, har forelderen ikke rett på fradrag for samvær.",
        en: "When the child does not have visitation with the other parent, the parent is not entitled to a deduction for visitation.",
        nn: "Når barnet ikkje har samvær med den andre forelderen, har forelderen ikkje rett på fradrag for samvær.",
      },
      SAMVÆRSKLASSE_1_TIL_4: (samværsfradrag, samværsklasse) => ({
        nb: `Når barnet har samvær med den andre forelderen, har den andre forelderen rett på fradrag for samvær, som varierer basert på hvilken samværsklasse samværet faller i. I samværsklasse ${samværsklasse} er fradraget ${samværsfradrag} per måned.`,

        en: `When the child has visitation with the other parent, the other parent is entitled to a deduction for visitation, which varies based on the visitation class. In visitation class ${samværsklasse}, the deduction is ${samværsfradrag} per month.`,
        nn: `Når barnet har samvær med den andre forelderen, har den andre forelderen rett på fradrag for samvær, som varierer basert på hvilken samværsklasse samværet faller i. I samværsklasse ${samværsklasse} er fradraget ${samværsfradrag} per måned.`,
      }),
      DELT_FAST_BOSTED: {
        nb: "Når barnet har delt fast bosted, har ikke faktisk samvær noen betydning for barnebidraget.",
        en: "When the child has shared permanent residence, actual visitation does not affect child support.",
        nn: "Når barnet har delt fast bustad, har ikkje faktisk samvær nokon betydning for barnebidraget.",
      },
    },
    HOS_MEDFORELDER: {
      SAMVÆRSKLASSE_0: {
        nb: "Når barnet ikke har samvær med deg, har du ikke rett på fradrag for samvær.",
        en: "When the child does not have visitation with you, you are not entitled to a deduction for visitation.",
        nn: "Når barnet ikkje har samvær med deg, har du ikkje rett på fradrag for samvær.",
      },
      SAMVÆRSKLASSE_1_TIL_4: (samværsfradrag, samværsklasse) => ({
        nb: `Når barnet har samvær med deg, har du rett på fradrag for samvær, som varierer basert på hvilken samværsklasse samværet faller i. I samværsklasse ${samværsklasse} er fradraget ${samværsfradrag} per måned.`,

        en: `When the child has visitation with you, you are entitled to a deduction for visitation, which varies based on the visitation class. In visitation class ${samværsklasse}, the deduction is ${samværsfradrag} per month.`,
        nn: `Når barnet har samvær med deg, har du rett på fradrag for samvær, som varierer basert på hvilken samværsklasse samværet faller i. I samværsklasse ${samværsklasse} er fradraget ${samværsfradrag} per måned.`,
      }),
      DELT_FAST_BOSTED: {
        nb: "Når barnet har delt fast bosted, har ikke faktisk samvær noen betydning for barnebidraget.",
        en: "When the child has shared permanent residence, actual visitation does not affect child support.",
        nn: "Når barnet har delt fast bustad, har ikkje faktisk samvær nokon betydning for barnebidraget.",
      },
    },
    DELT_FAST_BOSTED: {
      nb: "Når barnet har delt fast bosted, har ikke faktisk samvær noen betydning for barnebidraget.",
      en: "When the child has shared permanent residence, actual visitation does not affect child support.",
      nn: "Når barnet har delt fast bustad, har ikkje faktisk samvær nokon betydning for barnebidraget.",
    },
  },
});
