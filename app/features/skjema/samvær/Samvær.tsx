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
              description={
                bosted === "DELT_FAST_BOSTED"
                  ? t(tekster.bosted.valg.DELT_FAST_BOSTED_BESKRIVELSE)
                  : ""
              }
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
      nb: "Hvor bor barnet?",
      en: "Where is the child living?",
      nn: "Kor bur barnet?",
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
      DELT_FAST_BOSTED_BESKRIVELSE: {
        nb: "Delt fast bosted handler om hvor barnet bor, ikke om samvær. En avtale om delt fast bosted innebærer at barnet bor fast hos begge foreldrene. Velg «Ja» hvis dere har en skriftlig avtale om dette. Hvis du er usikker på om dere har en slik avtale, bør du sjekke det. Delt fast bosted gir en annen beregning i kalkulatoren enn en vanlig samværsavtale.",
        // TODO: oppdatert teksten
        en: "Shared permanent residence is about where the child lives, not about visitation. An agreement on shared permanent residence means that the child has permanent residence with both parents. Select 'Yes' if you have a written agreement about this. If you are unsure whether you have such an agreement, you should check. Shared permanent residence gives a different calculation in the calculator than a regular visitation agreement.",
        nn: "Delt fast bustad handlar om kvar barnet bur, ikkje om samvær. Ein avtale om delt fast bustad inneber at barnet bur fast hos begge foreldra. Vel «Ja» dersom de har ein skriftleg avtale om dette. Dersom du er usikker på om de har ein slik avtale, bør du sjekke det. Delt fast bustad gir ei anna utrekning i kalkulatoren enn ei vanleg samværsavtale.",
      },
      HAR_SAMVÆRSAVTALE: {
        nb: "Barnet bor fast hos meg, og har samvær med den andre forelderen",
        en: "The child has permanent residence with me and has visitation with their other parent",
        nn: "Barnet bur fast hos meg, og har samvær med den andre forelderen",
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
