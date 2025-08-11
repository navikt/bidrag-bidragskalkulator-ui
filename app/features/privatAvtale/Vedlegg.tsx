import { definerTekster, useOversettelse } from "~/utils/i18n";

import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormScope } from "@rvf/react";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";
import { sporPrivatAvtaleSpørsmålBesvart } from "./utils";

const AVTALEN_HAR_VEDLEGG_ALTERNATIVER = ["true", "false"] as const;

export const Vedlegg = () => {
  const privatAvtaleFormContext = usePrivatAvtaleForm();
  const { t } = useOversettelse();

  const form = useFormScope(privatAvtaleFormContext.form.scope("steg5"));

  return (
    <div className="space-y-6">
      <RadioGroup
        {...form.getControlProps("harVedlegg")}
        error={form.field("harVedlegg").error()}
        legend={t(tekster.harVedlegg.label)}
      >
        {AVTALEN_HAR_VEDLEGG_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                t(tekster.harVedlegg.label),
              )}
            >
              {t(tekster.harVedlegg[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>
    </div>
  );
};

const tekster = definerTekster({
  harVedlegg: {
    label: {
      nb: "Har du noen annen dokumentasjon du ønsker å legge ved?",
      nn: "Har du nokon annan dokumentasjon som du ønsker å legge ved?",
      en: "Do you have any other documentation you would like to submit?",
    },
    true: {
      nb: "Jeg legger det ved dette skjemaet",
      nn: "Eg legg det ved dette skjemaet",
      en: "I am attaching it to this form",
    },
    false: {
      nb: "Nei, jeg har ingen ekstra dokumentasjon jeg vil legge ved",
      nn: "Nei, eg har ingen ekstra dokumentasjon eg vil legge ved",
      en: "No, I have no additional documentation to attach",
    },
  },
});
