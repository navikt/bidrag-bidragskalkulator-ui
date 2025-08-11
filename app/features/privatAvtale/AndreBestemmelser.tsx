import { definerTekster, useOversettelse } from "~/utils/i18n";

import { Radio, RadioGroup, Textarea } from "@navikt/ds-react";
import { useFormScope } from "@rvf/react";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";
import { sporPrivatAvtaleSpørsmålBesvart } from "./utils";

const ER_ANDRE_BESTEMMELSER_ALTERNATIVER = ["true", "false"] as const;

export const AndreBestemmelser = () => {
  const privatAvtaleFormContext = usePrivatAvtaleForm();
  const { t } = useOversettelse();

  const form = useFormScope(privatAvtaleFormContext.form.scope("steg4"));

  return (
    <div className="space-y-6">
      <RadioGroup
        {...form.getControlProps("erAndreBestemmelser")}
        error={form.field("erAndreBestemmelser").error()}
        legend={t(tekster.erAndreBestemmelser.label)}
        description={t(tekster.erAndreBestemmelser.beskrivelse)}
      >
        {ER_ANDRE_BESTEMMELSER_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                t(tekster.erAndreBestemmelser.label),
              )}
            >
              {t(tekster.erAndreBestemmelser[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>

      {form.value("erAndreBestemmelser") === "true" && (
        <Textarea
          {...form.field("andreBestemmelser").getInputProps({
            label: t(tekster.andreBestemmelser.label),
          })}
          error={form.field("andreBestemmelser").error()}
        />
      )}
    </div>
  );
};

const tekster = definerTekster({
  erAndreBestemmelser: {
    label: {
      nb: "Er det andre bestemmelser tilknyttet avtalen?",
      nn: "Er det knytt andre bestemmingar til avtalen?",
      en: "Are there any other conditions that apply to the agreement?",
    },
    beskrivelse: {
      nb: "Her kan det blant annet gis opplysninger om hvordan bidraget skal betales, dersom det ikke skal betales igjennom Skatteetaten v/Nav Innkreving.",
      nn: "Her kan det leggjast inn opplysningar om til dømes korleis bidraget skal betalast, dersom det ikkje skal betalast gjennom Skatteetaten v/Nav Innkrevjing.",
      en: "Here you can include information about how the support is to be paid, if not through the Tax Administration/Nav Collection.",
    },
    true: {
      nb: "Ja",
      nn: "Ja",
      en: "Yes",
    },
    false: {
      nb: "Nei",
      nn: "Nei",
      en: "No",
    },
  },
  andreBestemmelser: {
    label: {
      nb: "Andre bestemmelser tilknyttet avtalen",
      nn: "Andre bestemmingar knytt til avtalen",
      en: "Other conditions that apply to the agreement",
    },
  },
});
