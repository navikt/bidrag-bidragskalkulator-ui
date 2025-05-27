import { PersonCrossIcon, PlusIcon } from "@navikt/aksel-icons";
import { Button, Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { useFieldArray, useFormContext } from "@rvf/react";
import { Slider } from "~/components/ui/slider";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { FastBosted, ManueltSkjema } from "../schema";
import { SAMVÆR_STANDARDVERDI } from "../utils";

const BOSTED_OPTIONS: FastBosted[] = [
  "DELT_FAST_BOSTED",
  "IKKE_DELT_FAST_BOSTED",
];

export const ManuellBarnSkjema = () => {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();

  const barnArray = useFieldArray(form.scope("barn"));

  const handleLeggTilBarn = () => {
    barnArray.push({
      alder: "",
      bosted: "",
      samvær: SAMVÆR_STANDARDVERDI,
    });
    sporHendelse("barn lagt til", { antall: barnArray.length() + 1 });
  };

  return (
    <>
      {barnArray.map((key, barnField, index) => {
        const samvær = barnField.value("samvær") ?? SAMVÆR_STANDARDVERDI;

        const samværsgradBeskrivelse =
          samvær === "1"
            ? t(tekster.samvær.enNatt)
            : t(tekster.samvær.netter(samvær));

        const borHosEnForelder =
          barnField.value("bosted") === "IKKE_DELT_FAST_BOSTED";

        const overskrift =
          barnArray.length() > 1
            ? t(tekster.overskrift.flereBarn(index + 1))
            : t(tekster.overskrift.ettBarn);

        const handleFjernBarn = () => {
          barnArray.remove(index);
          sporHendelse("barn fjernet", { antall: barnArray.length() - 1 });
        };

        return (
          <div
            key={key}
            className="border p-4 rounded-md space-y-4 focus:outline-none focus-visible:outline-1"
          >
            <h3 className="font-bold text-xl">{overskrift}</h3>
            <TextField
              {...barnField.field("alder").getInputProps()}
              label={t(tekster.alder.label)}
              error={barnField.field("alder").error()}
              htmlSize={8}
              inputMode="numeric"
              autoComplete="off"
            />
            <RadioGroup
              {...barnField.field("bosted").getInputProps()}
              error={barnField.field("bosted").error()}
              legend={t(tekster.bosted.label)}
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
            {barnArray.length() > 1 && (
              <Button
                type="button"
                size="small"
                variant="secondary"
                onClick={handleFjernBarn}
                icon={<PersonCrossIcon />}
              >
                {t(tekster.fjernBarn)}
              </Button>
            )}
          </div>
        );
      })}
      <div>
        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={handleLeggTilBarn}
          icon={<PlusIcon />}
        >
          {t(tekster.leggTilBarn)}
        </Button>
      </div>
    </>
  );
};

const tekster = definerTekster({
  overskrift: {
    flereBarn: (nummer) => ({
      nb: `Barn ${nummer}`,
      en: `Child ${nummer}`,
      nn: `Barn ${nummer}`,
    }),
    ettBarn: {
      nb: "Barn",
      en: "Child",
      nn: "Barn",
    },
  },

  alder: {
    label: {
      nb: "Hvor gammelt er barnet?",
      en: "How old is the child?",
      nn: "Hvor gammalt er barnet?",
    },
  },
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
        nb: "Vi har avtale om delt fast bosted",
        en: "We have an agreement on shared custody",
        nn: "Vi har avtale om delt bustad",
      },
      IKKE_DELT_FAST_BOSTED: {
        nb: "Vi har ikke avtale om delt fast bosted",
        en: "The child lives permanently with one of us",
        nn: "Barnet bur fast hos ein av oss",
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
  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
  leggTilBarn: {
    nb: "Legg til barn",
    en: "Add child",
    nn: "Legg til barn",
  },
});
