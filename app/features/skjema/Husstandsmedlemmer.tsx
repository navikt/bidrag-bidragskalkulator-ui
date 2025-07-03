import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";

import { Radio, RadioGroup, Stack } from "@navikt/ds-react";
import type { ManueltSkjema } from "./schema";

const BOR_MED_ANNEN_VOKSEN_ALTERNATIVER = ["true", "false"] as const;

type Props = {
  part: "deg" | "medforelder";
};

export const Husstandsmedlemmer = ({ part }: Props) => {
  const form = useFormContext<ManueltSkjema>();
  const { t } = useOversettelse();
  const medforelderNavnField = form.field("medforelder.navn");
  const medforelderNavn = medforelderNavnField.touched()
    ? medforelderNavnField.value()
    : "";

  return (
    <div className="border p-4 rounded-md">
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-5">
          {t(tekster[part].tittel(medforelderNavn))}
        </legend>
        <RadioGroup
          {...form.field(`${part}.borMedAnnenVoksen`).getInputProps()}
          error={form.field(`${part}.borMedAnnenVoksen`).error()}
          legend={t(tekster[part].borMedAnnenVoksen.label(medforelderNavn))}
        >
          <Stack gap="0 6" direction={{ xs: "column", sm: "row" }} wrap={false}>
            {BOR_MED_ANNEN_VOKSEN_ALTERNATIVER.map((alternativ) => {
              return (
                <Radio value={alternativ} key={alternativ}>
                  {t(tekster[part].borMedAnnenVoksen[alternativ])}
                </Radio>
              );
            })}
          </Stack>
        </RadioGroup>

        <FormattertTallTextField
          {...form.field(`${part}.antallBarnBorFast`).getControlProps()}
          label={t(tekster[part].antallBarnBorFast.label(medforelderNavn))}
          error={form.field(`${part}.antallBarnBorFast`).error()}
          description={t(
            tekster[part].antallBarnBorFast.beskrivelse(medforelderNavn),
          )}
          htmlSize={8}
        />

        <FormattertTallTextField
          {...form.field(`${part}.antallBarnDeltBosted`).getControlProps()}
          label={t(tekster[part].antallBarnDeltBosted.label(medforelderNavn))}
          error={form.field(`${part}.antallBarnDeltBosted`).error()}
          description={t(
            tekster[part].antallBarnDeltBosted.beskrivelse(medforelderNavn),
          )}
          htmlSize={8}
        />
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  deg: {
    tittel: () => ({
      nb: "Om deg",
      nn: "Om deg",
      en: "About you",
    }),
    antallBarnBorFast: {
      label: () => ({
        nb: "Antall barn som bor fast hos deg",
        nn: "Antal barn som bur fast hjå deg",
        en: "Number of children living with you",
      }),
      beskrivelse: () => ({
        nb: "Oppgi antall barn under 18 som bor fast hos deg. Felles barn med den du ønsker å avtale barnebidrag med, skal ikke telles med her.",
        nn: "Oppgi antall barn under 18 som bur fast hjå deg. Felles barn med den du ønskjer å avtale barnebidrag med, skal ikkje teljast med her.",
        en: "Enter the number of children under 18 who live with you. Shared children with the other parent should not be included here.",
      }),
    },
    antallBarnDeltBosted: {
      label: () => ({
        nb: "Antall barn med delt bosted hos deg",
        nn: "Antal barn med delt bustad hjå deg",
        en: "Number of children with shared custody living with you",
      }),
      beskrivelse: () => ({
        nb: "Oppgi antall barn under 18 som har delt bosted hos deg. Felles barn med den du ønsker å avtale barnebidrag med, skal ikke telles med her.",
        nn: "Oppgi antall barn under 18 som har delt bustad hjå deg. Felles barn med den du ønskjer å avtale barnebidrag med, skal ikkje teljast med her.",
        en: "Enter the number of children under 18 who have shared custody living with you. Shared children with the other parent should not be included here.",
      }),
    },
    borMedAnnenVoksen: {
      label: () => ({
        nb: "Bor du med en annen voksen?",
        nn: "Bur du med ein annan vaksen?",
        en: "Do you live with another adult?",
      }),
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
    tittel: (navn) => ({
      nb: `Om ${navn || "den andre forelderen"}`,
      nn: `Om ${navn || "den andre forelderen"}`,
      en: `About ${navn || "the other parent"}`,
    }),
    antallBarnBorFast: {
      label: (navn) => ({
        nb: `Antall barn som bor fast hos ${navn || "den andre forelderen"}`,
        nn: `Antal barn som bur fast hjå ${navn || "den andre forelderen"}`,
        en: `Number of children living with ${navn || "the other parent"}`,
      }),
      beskrivelse: (navn) => ({
        nb: `Oppgi antall barn under 18 som bor fast hos ${navn || "den andre forelderen"}. Felles barn med den du ønsker å avtale barnebidrag med, skal ikke telles med her.`,
        nn: `Oppgi antall barn under 18 som bur fast hjå ${navn || "den andre forelderen"}. Felles barn med den du ønskjer å avtale barnebidrag med, skal ikkje teljast med her.`,
        en: `Enter the number of children under 18 who live with ${navn || "the other parent"}. Shared children with you should not be included here.`,
      }),
    },
    antallBarnDeltBosted: {
      label: (navn) => ({
        nb: `Antall barn med delt bosted hos ${navn || "den andre forelderen"}`,
        nn: `Antal barn med delt bustad hjå ${navn || "den andre forelderen"}`,
        en: `Number of children with shared custody living with ${navn || "the other parent"}`,
      }),
      beskrivelse: (navn) => ({
        nb: `Oppgi antall barn under 18 som har delt bosted hos ${navn || "den andre forelderen"}. Felles barn med den du ønsker å avtale barnebidrag med, skal ikke telles med her.`,
        nn: `Oppgi antall barn under 18 som har delt bustad hjå ${navn || "den andre forelderen"}. Felles barn med den du ønskjer å avtale barnebidrag med, skal ikkje teljast med her.`,
        en: `Enter the number of children under 18 who have shared custody living with ${navn || "the other parent"}. Shared children with you should not be included here.`,
      }),
    },
    borMedAnnenVoksen: {
      label: (navn) => ({
        nb: `Bor ${navn || "den andre forelderen"} med en annen voksen?`,
        nn: `Bur ${navn || "den andre forelderen"} med ein annan vaksen?`,
        en: `Does ${navn || "the other parent"} live with another adult?`,
      }),
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
