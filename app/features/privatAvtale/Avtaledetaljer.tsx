import { definerTekster, useOversettelse } from "~/utils/i18n";

import { DatePicker, Radio, RadioGroup, useDatepicker } from "@navikt/ds-react";
import { tilÅrMånedDag } from "~/utils/dato";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";

const NY_AVTALE_ALTERNATIVER = ["true", "false"] as const;
const INNKREVING_ALTERNATIVER = ["false", "true"] as const;

export const Avtaledetaljer = () => {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();

  const { getControlProps, value, field, error } = form;

  const { fraDato } = value();

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: undefined,
    onDateChange: (dato) => {
      field("fraDato").setValue(dato ? tilÅrMånedDag(dato) : "");
    },
    defaultSelected: fraDato ? new Date(fraDato) : undefined,
  });

  return (
    <fieldset className="p-0 flex flex-col gap-6">
      <legend className="text-xl mb-5">{t(tekster.tittel)}</legend>

      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label={t(tekster.gjelderFra.label)}
          description={t(tekster.gjelderFra.beskrivelse)}
          error={error("fraDato")}
        />
      </DatePicker>

      <RadioGroup
        {...getControlProps("nyAvtale")}
        error={field("nyAvtale").error()}
        legend={t(tekster.nyAvtale.label)}
      >
        {NY_AVTALE_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio value={alternativ} key={alternativ}>
              {t(tekster.nyAvtale[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>

      <RadioGroup
        {...getControlProps("medInnkreving")}
        error={field("medInnkreving").error()}
        legend={t(tekster.medInnkreving.label)}
      >
        {INNKREVING_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio value={alternativ} key={alternativ}>
              {t(tekster.medInnkreving[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
};

const tekster = definerTekster({
  tittel: {
    nb: "Litt om avtalen",
    nn: "Litt om avtalen",
    en: "About the agreement",
  },
  gjelderFra: {
    label: {
      nb: "Hvilken dag avtalen skal gjelde fra",
      nn: "Kva dag avtalen skal gjelde frå",
      en: "The day the agreement should apply from",
    },
    beskrivelse: {
      nb: "Oppgi dato med format dd.mm.åååå",
      nn: "Oppgi dato med format dd.mm.åååå",
      en: "Provide the date in the format dd.mm.yyyy",
    },
  },
  nyAvtale: {
    label: {
      nb: "Er dette en ny avtale?",
      nn: "Er dette ein ny avtale?",
      en: "Is this a new agreement?",
    },
    true: {
      nb: "Ja",
      nn: "Ja",
      en: "Yes",
    },
    false: {
      nb: "Nei, dette er en endring av en eksisterende avtale",
      nn: "Nei, dette er en endring av en eksisterande avtale",
      en: "No, this is a change to an existing agreement",
    },
  },
  medInnkreving: {
    label: {
      nb: "Ønsket oppgjørsform",
      nn: "Ynskja oppgjerstype",
      en: "Settlement type",
    },
    true: {
      nb: "Vi ønsker at bidraget skal betales gjennom Skatteetaten v/Nav Innkreving",
      nn: "Vi ønskjer at bidraget skal betalast gjennom Skatteetaten v/Nav Innkreving",
      en: "We want the support to be paid through the Tax Administration via Nav Collection",
    },
    false: {
      nb: "Vi ønsker å gjøre opp bidraget oss i mellom (privat)",
      nn: "Vi ønskjer å gjere opp bidraget oss imellom (privat)",
      en: "We want to settle the support between us (private)",
    },
  },
});
