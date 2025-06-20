import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FastBosted, type ManueltSkjema } from "./schema";
import { kalkulerSamværsklasse, SAMVÆR_STANDARDVERDI } from "./utils";

type SamværProps = {
  barnIndex: number;
};
export function Samvær({ barnIndex }: SamværProps) {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();
  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const bosted = barnField.value("bosted");
  const borHosMeg = bosted === "HOS_MEG";
  const borHosMedforelder = bosted === "HOS_MEDFORELDER";

  const samvær = barnField.value("samvær") || SAMVÆR_STANDARDVERDI;
  const samværsklasse = bosted
    ? kalkulerSamværsklasse(Number(samvær), bosted)
    : "";
  let samværsgradBeskrivelse =
    samvær === "1"
      ? t(tekster.samvær.enNatt)
      : t(tekster.samvær.netter(samvær));

  if (samværsklasse && (borHosMedforelder || borHosMeg)) {
    samværsgradBeskrivelse += ` (${t(
      tekster.samvær.samværsklasser[samværsklasse],
    )})`;
  }

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
    </>
  );
}

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
    samværsklasser: {
      DELT_BOSTED: {
        nb: "Delt bosted",
        en: "Shared residence",
        nn: "Delt bustad",
      },
      SAMVÆRSKLASSE_0: {
        nb: "samværsklasse 0",
        en: "visitation class 0",
        nn: "samværsklasse 0",
      },
      SAMVÆRSKLASSE_1: {
        nb: "samværsklasse 1",
        en: "visitation class 1",
        nn: "samværsklasse 1",
      },
      SAMVÆRSKLASSE_2: {
        nb: "samværsklasse 2",
        en: "visitation class 2",
        nn: "samværsklasse 2",
      },
      SAMVÆRSKLASSE_3: {
        nb: "samværsklasse 3",
        en: "visitation class 3",
        nn: "samværsklasse 3",
      },
      SAMVÆRSKLASSE_4: {
        nb: "samværsklasse 4",
        en: "visitation class 4",
        nn: "samværsklasse 4",
      },
    },
  },
});
