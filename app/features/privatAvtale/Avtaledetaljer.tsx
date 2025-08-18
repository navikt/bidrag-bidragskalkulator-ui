import { definerTekster, useOversettelse } from "~/utils/i18n";

import { Radio, RadioGroup } from "@navikt/ds-react";
import { useFormScope } from "@rvf/react";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";
import { sporPrivatAvtaleSpørsmålBesvart } from "./utils";

const NY_AVTALE_ALTERNATIVER = ["true", "false"] as const;
const INNKREVING_ALTERNATIVER = ["false", "true"] as const;

export const Avtaledetaljer = () => {
  const privatAvtaleFormContext = usePrivatAvtaleForm();
  const { t } = useOversettelse();

  const form = useFormScope(
    privatAvtaleFormContext.form.scope("steg3.avtaledetaljer"),
  );

  return (
    <div className="space-y-6">
      <RadioGroup
        {...form.getControlProps("nyAvtale")}
        error={form.field("nyAvtale").error()}
        legend={t(teksterAvtaledetaljer.nyAvtale.label)}
      >
        {NY_AVTALE_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                t(teksterAvtaledetaljer.nyAvtale.label),
              )}
            >
              {t(teksterAvtaledetaljer.nyAvtale[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>

      <RadioGroup
        {...form.getControlProps("medInnkreving")}
        error={form.field("medInnkreving").error()}
        legend={t(teksterAvtaledetaljer.medInnkreving.label)}
      >
        {INNKREVING_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                t(teksterAvtaledetaljer.medInnkreving.label),
              )}
            >
              {t(teksterAvtaledetaljer.medInnkreving[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export const teksterAvtaledetaljer = definerTekster({
  tittel: {
    nb: "Litt om avtalen",
    nn: "Litt om avtalen",
    en: "About the agreement",
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
      nb: "Hvilken oppgjørsform ønskes?",
      nn: "Kva type oppgjer ønskjer de?",
      en: "Which form of settlement do you want?",
    },
    true: {
      nb: "Vi ønsker at bidraget skal betales gjennom Skatteetaten v/Nav Innkreving",
      nn: "Vi ønskjer at bidraget skal betalast gjennom Skatteetaten v/Nav Innkreving",
      en: "We want the support to be paid through the Tax Administration/Nav Collection",
    },
    false: {
      nb: "Vi ønsker å gjøre opp bidraget oss i mellom (privat)",
      nn: "Vi ønskjer å gjere opp bidraget oss imellom (privat)",
      en: "We want to settle the support between us (private)",
    },
  },
});
