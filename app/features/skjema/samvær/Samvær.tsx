import { BodyShort, Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FastBostedSchema, type BarnebidragSkjema } from "../schema";
import { SAMVÆR_STANDARDVERDI, sporKalkulatorSpørsmålBesvart } from "../utils";
import { SamværOgFerierInfo } from "./SamværOgFerierInfo";
import { Samværsfradraginfo } from "./Samværsfradraginfo";

type SamværProps = {
  barnIndex: number;
};

export function Samvær({ barnIndex }: SamværProps) {
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();
  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));
  const samvær = barnField.value("samvær") || SAMVÆR_STANDARDVERDI;
  const samværsgradBeskrivelse =
    samvær === "1"
      ? t(tekster.samvær.enNatt)
      : t(tekster.samvær.netter(samvær));

  const bosted = barnField.value("bosted");
  const borHosMeg = bosted === "HOS_MEG";
  const borHosMedforelder = bosted === "HOS_MEDFORELDER";

  const sporSamvær = (verdi: string) => {
    if (verdi) {
      sporHendelse({
        hendelsetype: "skjema spørsmål besvart",
        skjemaId: "barnebidragskalkulator-under-18",
        spørsmålId: "barn-samvær",
        spørsmål: t(tekster.samvær.label),
      });
    }
  };

  return (
    <>
      <BodyShort weight="semibold" className="mt-7" spacing>
        {t(tekster.tittel)}
      </BodyShort>
      <RadioGroup
        {...barnField.getControlProps("bosted", {
          onChange: () => {
            barnField.field("samvær").setValue(SAMVÆR_STANDARDVERDI);
          },
        })}
        error={barnField.field("bosted").error()}
        legend={t(tekster.bosted.label)}
        description={t(tekster.bosted.valg.beskrivelse)}
      >
        {FastBostedSchema.options.map((bosted) => {
          return (
            <Radio
              value={bosted}
              key={bosted}
              onChange={sporKalkulatorSpørsmålBesvart(
                "barn-fast-bosted",
                t(tekster.bosted.label),
              )}
            >
              {t(tekster.bosted.valg[bosted])}
            </Radio>
          );
        })}
      </RadioGroup>

      {(borHosMeg || borHosMedforelder) && (
        <Slider
          {...barnField.field("samvær").getControlProps({
            onChange: sporSamvær,
          })}
          label={t(tekster.samvær.label)}
          error={barnField.field("samvær").error()}
          min={0}
          max={30}
          step={1}
          list={[
            {
              label: t(tekster.samvær.beskrivelser.ingenSamvær),
              value: 0,
            },
            {
              label: t(tekster.samvær.beskrivelser.alleNetterSamvær),
              value: 30,
            },
          ]}
          valueDescription={samværsgradBeskrivelse}
        />
      )}

      <Samværsfradraginfo />
      <SamværOgFerierInfo />
    </>
  );
}
const tekster = definerTekster({
  tittel: {
    nb: "Barnets faste bosted og samvær",
    en: "",
    nn: "",
  },
  bosted: {
    label: {
      nb: "Har dere avtale om delt fast bosted for dette barnet?",
      // TODO: oppdatert teksten
      en: "Do you have an agreement on shared permanent residence for this child?",
      nn: "Har de avtale om delt fast bustad for dette barnet?",
    },
    valg: {
      velg: {
        nb: "Har dere avtale om delt fast bosted for dette barnet?",
        en: "",
        nn: "",
      },
      beskrivelse: {
        nb: "Delt fast bosted er en avtale etter barnelovens §36 om at barnet skal bo fast hos begge foreldrene. Avtalen går ut fra at foreldrene deler likt både på samvær og kostnader. Hvis den ene tjener mer enn den andre, kan det bli aktuelt med barnebidrag.",
        en: "",
        nn: "",
      },
      DELT_FAST_BOSTED: {
        nb: "Ja, vi har signert avtale om delt fast bosted ",
        en: "",
        nn: "",
      },
      HOS_MEG: {
        nb: (
          <>
            Nei, vi har vanlig samværsavtale hvor{" "}
            <span style={{ fontWeight: "bold" }}>barnet bor fast hos meg </span>
            og har samvær med den andre forelderen
          </>
        ),
        en: (
          <>
            No, we have a regular custody arrangement where{" "}
            <span style={{ fontWeight: "bold" }}>the child lives with me </span>
            and has visitation with the other parent
          </>
        ),
        nn: (
          <>
            Nei, vi har vanleg samværsavtale der{" "}
            <span style={{ fontWeight: "bold" }}>barnet bur hjå meg </span> og
            har samvær med den andre forelderen
          </>
        ),
      },
      HOS_MEDFORELDER: {
        nb: (
          <>
            Nei, vi har vanlig samværsavtale hvor{" "}
            <span style={{ fontWeight: "bold" }}>
              barnet bor fast hos den andre forelderen{" "}
            </span>
            og har samvær med meg
          </>
        ),
        en: (
          <>
            No, we have a regular custody arrangement where{" "}
            <span style={{ fontWeight: "bold" }}>
              the child lives with the other parent{" "}
            </span>
            and has visitation with me
          </>
        ),
        nn: (
          <>
            Nei, vi har vanleg samværsavtale der{" "}
            <span style={{ fontWeight: "bold" }}>
              barnet bur hjå den andre forelderen{" "}
            </span>
            og har samvær med meg
          </>
        ),
      },
    },
  },
  samvær: {
    label: {
      nb: "Hvor mange netter er barnet hos deg i måneden?",
      en: "",
      nn: "",
    },
    netter: (antall) => ({
      nb: `Barnet bor ${antall} netter hos meg`,
      //TODO: sjekk teksten
      en: `The child lives ${antall} nights with me`,
      nn: `Barnet bur ${antall} netter hos meg`,
    }),
    enNatt: {
      nb: "Barnet bor 1 natt hos meg",
      //TODO: sjekk teksten
      en: "1 night with me",
      nn: "1 natt hos meg",
    },
    beskrivelser: {
      ingenNetterHosDeg: {
        nb: "Ingen netter hos meg",
        en: "No nights with me",
        nn: "Ingen netter hos meg",
      },
      ingenSamvær: {
        nb: "0 netter hos meg",
        //TODO: sjekk teksten
        en: "0 nights with me",
        nn: "0 netter hos meg",
      },
      alleNetterSamvær: {
        nb: "30 netter hos meg",
        //TODO: sjekk teksten
        en: "30 days with me",
        nn: "30 netter hos meg",
      },
    },
  },
});
