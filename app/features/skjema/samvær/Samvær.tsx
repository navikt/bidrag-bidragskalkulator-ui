import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FastBostedSchema, type BarnebidragSkjema } from "../schema";
import {
  kalkulerSamværsklasse,
  SAMVÆR_STANDARDVERDI,
  sporKalkulatorSpørsmålBesvart,
} from "../utils";
import { FastBostedInfo } from "./FastBostedInfo";
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
  const harSamværsavtale = bosted === "HAR_SAMVÆRSAVTALE";
  const alder = barnField.value("alder");

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
      <RadioGroup
        {...barnField.getControlProps("bosted", {
          onChange: () => {
            barnField.field("samvær").setValue(SAMVÆR_STANDARDVERDI);
          },
        })}
        error={barnField.field("bosted").error()}
        legend={t(tekster.bosted.label)}
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

      {harSamværsavtale && (
        <Slider
          {...barnField.field("samvær").getControlProps({
            onChange: sporSamvær,
          })}
          label={t(tekster.samvær.label)}
          description={t(tekster.samvær.beskrivelse)}
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

      <FastBostedInfo />

      <Samværsfradraginfo
        alder={alder ? Number(alder) : undefined}
        samværsklasse={
          bosted ? kalkulerSamværsklasse(Number(samvær), bosted) : undefined
        }
      />

      <SamværOgFerierInfo />
    </>
  );
}

const tekster = definerTekster({
  bosted: {
    label: {
      nb: "Hvilken avtale har dere for hvordan barnet bor?",
      // TODO: oppdatert teksten
      en: "What agreement do you have for how the child lives?",
      nn: "Kva avtale har de for korleis barnet bur?",
    },
    valg: {
      velg: {
        nb: "Velg hvor barnet skal bo",
        en: "Select where the child will live",
        nn: "Velg kvar barnet skal bu",
      },
      DELT_FAST_BOSTED: {
        nb: "Vi har en skriftlig avtale om delt fast bosted",
        // TODO: oppdatert teksten
        en: "We have a written agreement on shared permanent residence",
        nn: "Vi har ein skriftleg avtale om delt fast bustad",
      },
      HAR_SAMVÆRSAVTALE: {
        nb: "Vi har en samværsavtale",
        // TODO: oppdatert teksten
        en: "e have a visitation agreement",
        nn: "Vi har ei samværsavtale",
      },
    },
  },
  samvær: {
    label: {
      nb: "Hvor mye bor barnet hos deg?",
      en: "How many nights is the child spending with you?",
      nn: "Kor mykje bur barnet hos deg?",
    },
    beskrivelse: {
      nb: "Estimer hvor mange netter barnet bor hos deg i snitt per måned.",
      en: "Estimate how many nights the child will stay with you on average per month",
      nn: "Estimer kor mange netter barnet vil vere hos deg i snitt per månad",
    },
    netter: (antall) => ({
      nb: `Barnet bor ${antall} netter hos deg`,
      //TODO: sjekk teksten
      en: `The child lives ${antall} nights with you`,
      nn: `Barnet bur ${antall} netter hos deg`,
    }),
    enNatt: {
      nb: "Barnet bor 1 natt hos deg",
      //TODO: sjekk teksten
      en: "1 night with you",
      nn: "1 natt hos deg",
    },
    beskrivelser: {
      ingenNetterHosDeg: {
        nb: "Ingen netter hos deg",
        en: "No nights with you",
        nn: "Ingen netter hos deg",
      },
      ingenSamvær: {
        nb: "0 netter hos deg",
        //TODO: sjekk teksten
        en: "0 nights with you",
        nn: "0 netter hos deg",
      },
      alleNetterSamvær: {
        nb: "30 netter hos deg",
        //TODO: sjekk teksten
        en: "30 days with you",
        nn: "30 netter hos deg",
      },
    },
  },
});
