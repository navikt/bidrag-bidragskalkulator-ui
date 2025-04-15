import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormContext, useFieldArray } from "@rvf/react";
import { useOversettelse, definerTekster } from "~/utils/i18n";
import type { InnloggetForm } from "./schema";
import { usePersoninformasjon } from "./usePersoninformasjon";
import {
  finnBarnBasertPåIdent,
  finnMotpartBasertPåIdent,
  SAMVÆR_FORHÅNDSVALGT_VERDI,
} from "./utils";
import { Slider } from "~/components/ui/slider";

export const BostedOgSamvær = () => {
  const personinformasjon = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<InnloggetForm>();
  const motpart = finnMotpartBasertPåIdent(
    form.value("motpartIdent"),
    personinformasjon
  );
  const barnArray = useFieldArray(form.scope("barn"));

  return (
    <>
      {barnArray.map((key, barnField) => {
        const barnInfo = finnBarnBasertPåIdent(
          barnField.value("ident"),
          personinformasjon
        );

        const samvær =
          barnField.field("samvær").value() ?? SAMVÆR_FORHÅNDSVALGT_VERDI;

        const samværsgradBeskrivelse =
          samvær === "1"
            ? t(tekster.samvær.enNatt)
            : t(tekster.samvær.netter(samvær));

        return (
          <div
            key={key}
            className="border p-4 rounded-md space-y-4 focus:outline-none focus-visible:outline-1"
          >
            <h3 className="font-bold text-xl">{`${barnInfo?.fulltNavn} (${barnInfo?.alder})`}</h3>
            <RadioGroup
              {...barnField.field("bosted").getInputProps()}
              error={barnField.field("bosted").error()}
              legend={t(tekster.bosted.label(`${barnInfo?.fornavn}`))}
            >
              <Radio value="HOS_FORELDER_1">
                {t(tekster.bosted.valg.hosDeg)}
              </Radio>
              <Radio value="DELT_BOSTED">
                {t(tekster.bosted.valg.deltBosted)}
              </Radio>
              <Radio value="HOS_FORELDER_2">
                {t(tekster.bosted.valg.hosDenAndre(motpart?.fornavn ?? ""))}
              </Radio>
            </RadioGroup>

            {["HOS_FORELDER_1", "HOS_FORELDER_2"].includes(
              barnField.field("bosted").value()
            ) && (
              <Slider
                {...barnField.field("samvær").getControlProps()}
                label={t(tekster.samvær.label)}
                description={t(tekster.samvær.beskrivelse)}
                error={barnField.field("samvær").error()}
                min={0}
                max={30}
                step={1}
                list={[
                  {
                    label: t(tekster.samvær.beskrivelser.ingenNetterHosDeg),
                    value: 0,
                  },
                  {
                    label: t(
                      tekster.samvær.beskrivelser.halvpartenAvTidenHosDeg
                    ),
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
          </div>
        );
      })}
    </>
  );
};

const tekster = definerTekster({
  bosted: {
    label: (navn) => ({
      nb: `Hvor skal ${navn} bo fast?`,
      en: `Where will ${navn} have a permanent address?`,
      nn: `Kvar skal ${navn} bo fast?`,
    }),
    valg: {
      velg: {
        nb: "Velg hvor barnet skal bo",
        en: "Select where the child will live",
        nn: "Velg kvar barnet skal bo",
      },
      hosDeg: {
        nb: "Barnet bor hos deg",
        en: "The child lives with you",
        nn: "Barnet bor hos deg",
      },
      deltBosted: {
        nb: "Vi har avtale om delt bosted",
        en: "We have an agreement on shared custody",
        nn: "Vi har avtale om delt bosted",
      },
      hosDenAndre: (navn) => ({
        nb: `Barnet bor hos ${navn}`,
        en: `The child lives with ${navn}`,
        nn: `Barnet bor hos ${navn}`,
      }),
    },
  },
  samvær: {
    label: {
      nb: "Hvor mye vil barnet være sammen med deg?",
      en: "How much will the child stay with you?",
      nn: "Kor mykje vil barnet være saman med deg?",
    },
    beskrivelse: {
      nb: "Estimer hvor mange netter barnet vil være hos deg i snitt per måned",
      en: "Estimate how many nights the child will stay with you on average per month",
      nn: "Estimer kor mange netter barnet vil være hos deg i snitt per måned",
    },
    netter: (antall) => ({
      nb: `${antall} netter`,
      en: `${antall} nights`,
      nn: `${antall} netter`,
    }),
    enNatt: {
      nb: "1 natt",
      en: "1 night",
      nn: "1 natt",
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
});
