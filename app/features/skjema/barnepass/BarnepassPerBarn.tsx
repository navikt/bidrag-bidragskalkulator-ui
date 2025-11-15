import { Select } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import {
  BarnepassSituasjonSchema,
  MAKS_ALDER_BARNETILSYNSUTGIFT,
  type BarnebidragSkjema,
} from "../schema";

type Props = {
  barnIndex: number;
};

export const BarnepassPerBarn = ({ barnIndex }: Props) => {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));
  const alder = barnField.value().alder;

  const barnepassSituasjon = barnField.value().barnepassSituasjon || "";

  const visSpørsmålOmBarnetilsynsutgift =
    barnField.field("alder").touched() &&
    Number(alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT;

  if (!visSpørsmålOmBarnetilsynsutgift) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Select
        {...barnField.getInputProps("barnepassSituasjon")}
        label={t(tekster.barnepass.label)}
        error={barnField.field("barnepassSituasjon").error()}
      >
        <option value="">{t(tekster.barnepass.velg)}</option>
        {BarnepassSituasjonSchema.options.map((type) => (
          <option value={type} key={type}>
            {t(tekster.barnepass.valg[type])}
          </option>
        ))}
      </Select>

      {barnepassSituasjon === "BETALER_SELV" && (
        <FormattertTallTextField
          {...barnField.getControlProps("barnetilsynsutgift")}
          label={t(tekster.utgift.label)}
          error={barnField.field("barnetilsynsutgift").error()}
          htmlSize={12}
        />
      )}
    </div>
  );
};

const tekster = definerTekster({
  barnepass: {
    label: {
      nb: "Barnepass",
      en: "Childcare",
      nn: "Barnepass",
    },
    velg: {
      nb: "Velg...",
      en: "Choose...",
      nn: "Vel...",
    },
    valg: {
      INGEN: {
        nb: "Har ikke barnepass",
        en: "No childcare",
        nn: "Har ikkje barnepass",
      },
      STØNAD_HELTID: {
        nb: "Stønad fra Nav - heltid",
        en: "Nav support - full-time",
        nn: "Stønad frå Nav - heiltid",
      },
      STØNAD_DELTID: {
        nb: "Stønad fra Nav - deltid",
        en: "Nav support - part-time",
        nn: "Stønad frå Nav - deltid",
      },
      BETALER_SELV: {
        nb: "Betaler selv (uten stønad)",
        en: "Pay myself (no support)",
        nn: "Betaler sjølv (utan stønad)",
      },
    },
  },
  utgift: {
    label: {
      nb: "Beløp per måned",
      en: "Amount per month",
      nn: "Beløp per månad",
    },
  },
});
