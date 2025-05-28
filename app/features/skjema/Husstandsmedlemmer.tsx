import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";

import { Radio, RadioGroup } from "@navikt/ds-react";
import type { ManueltSkjema } from "./schema";

const BOR_MED_ANNEN_VOKSEN_ALTERNATIVER = ["true", "false"] as const;

export const Husstandsmedlemmer = () => {
  const form = useFormContext<ManueltSkjema>();
  const { t } = useOversettelse();

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-4 p-0">
        <legend className="sr-only">{t(tekster.deg.tittel)}</legend>
        <FormattertTallTextField
          {...form.field("deg.antallBarnBorFast").getControlProps()}
          label={t(tekster.deg.antallBarnBorFast.label)}
          error={form.field("deg.antallBarnBorFast").error()}
          htmlSize={8}
        />

        <FormattertTallTextField
          {...form.field("deg.antallBarnDeltBosted").getControlProps()}
          label={t(tekster.deg.antallBarnDeltBosted.label)}
          error={form.field("deg.antallBarnDeltBosted").error()}
          htmlSize={8}
        />

        <RadioGroup
          {...form.field("deg.borMedAnnenVoksen").getInputProps()}
          error={form.field("deg.borMedAnnenVoksen").error()}
          legend={t(tekster.deg.borMedAnnenVoksen.label)}
        >
          {BOR_MED_ANNEN_VOKSEN_ALTERNATIVER.map((alternativ) => {
            return (
              <Radio value={alternativ} key={alternativ}>
                {t(tekster.deg.borMedAnnenVoksen[alternativ])}
              </Radio>
            );
          })}
        </RadioGroup>
      </fieldset>

      <fieldset className="flex flex-col gap-4 p-0">
        <legend className="sr-only">{t(tekster.medforelder.tittel)}</legend>
        <FormattertTallTextField
          {...form.field("medforelder.antallBarnBorFast").getControlProps()}
          label={t(tekster.medforelder.antallBarnBorFast.label)}
          error={form.field("medforelder.antallBarnBorFast").error()}
          htmlSize={8}
        />

        <FormattertTallTextField
          {...form.field("medforelder.antallBarnDeltBosted").getControlProps()}
          label={t(tekster.medforelder.antallBarnDeltBosted.label)}
          error={form.field("medforelder.antallBarnDeltBosted").error()}
          htmlSize={8}
        />

        <RadioGroup
          {...form.field("medforelder.borMedAnnenVoksen").getInputProps()}
          error={form.field("medforelder.borMedAnnenVoksen").error()}
          legend={t(tekster.medforelder.borMedAnnenVoksen.label)}
        >
          {BOR_MED_ANNEN_VOKSEN_ALTERNATIVER.map((alternativ) => {
            return (
              <Radio value={alternativ} key={alternativ}>
                {t(tekster.medforelder.borMedAnnenVoksen[alternativ])}
              </Radio>
            );
          })}
        </RadioGroup>
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  deg: {
    tittel: {
      nb: "Din husstand",
      nn: "Din husstand",
      en: "Your household",
    },
    antallBarnBorFast: {
      label: {
        nb: "Antall barn under 18 år som bor fast hos deg",
        nn: "Antal barn under 18 år som bur fast hjå deg",
        en: "Number of children under 18 years living with you",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall barn under 18 år med delt bosted hos deg",
        nn: "Antal barn under 18 år med delt bustad hjå deg",
        en: "Number of children under 18 years with shared custody living with you",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor du med en annen voksen?",
        nn: "Bur du med ein annan vaksen?",
        en: "Do you live with another adult?",
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
  },
  medforelder: {
    tittel: {
      nb: "Den andre forelderens husstand",
      nn: "Den andre forelderens husstand",
      en: "Other parent's household",
    },
    antallBarnBorFast: {
      label: {
        nb: "Antall barn under 18 år som bor fast hos den andre forelderen",
        nn: "Antal barn under 18 år som bur fast hjå den andre forelderen",
        en: "Number of children under 18 years living with the other parent",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall barn under 18 år med delt bosted hos den andre forelderen",
        nn: "Antal barn under 18 år med delt bustad hjå den andre forelderen",
        en: "Number of children under 18 years with shared custody living with the other parent",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor den andre forelderen med en annen voksen?",
        nn: "Bur den andre forelderen med ein annan vaksen?",
        en: "Does the other parent live with another adult?",
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
  },
});
