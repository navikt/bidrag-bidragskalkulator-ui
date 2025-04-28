import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { usePersoninformasjon } from "./personinformasjon/usePersoninformasjon";
import type { FastBosted, InnloggetSkjema } from "./schema";
import { finnBarnBasertPåIdent, SAMVÆR_STANDARDVERDI } from "./utils";

const BOSTED_OPTIONS: FastBosted[] = [
  "DELT_FAST_BOSTED",
  "IKKE_DELT_FAST_BOSTED",
];

export const BostedOgSamvær = () => {
  const personinformasjon = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<InnloggetSkjema>();

  const barnArray = useFieldArray(form.scope("barn"));

  return (
    <>
      {barnArray.map((key, barnField) => {
        const barnInfo = finnBarnBasertPåIdent(
          barnField.value("ident"),
          personinformasjon,
        );

        const samvær = barnField.value("samvær") ?? SAMVÆR_STANDARDVERDI;

        const samværsgradBeskrivelse =
          samvær === "1"
            ? t(tekster.samvær.enNatt)
            : t(tekster.samvær.netter(samvær));

        const borHosEnForelder =
          barnField.value("bosted") === "IKKE_DELT_FAST_BOSTED";

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
              {BOSTED_OPTIONS.map((bosted) => {
                return (
                  <Radio value={bosted} key={bosted}>
                    {t(tekster.bosted.valg[bosted])}
                  </Radio>
                );
              })}
            </RadioGroup>

            {borHosEnForelder && (
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
                      tekster.samvær.beskrivelser.halvpartenAvTidenHosDeg,
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
      DELT_FAST_BOSTED: {
        nb: "Vi har avtale om delt fast bosted",
        en: "We have an agreement on shared custody",
        nn: "Vi har avtale om delt bosted",
      },
      IKKE_DELT_FAST_BOSTED: {
        nb: "Vi har ikke avtale om delt fast bosted",
        en: "The child lives permanently with one of us",
        nn: "Barnet bur fast hos ein av oss",
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
