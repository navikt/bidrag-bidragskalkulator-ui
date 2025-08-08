import { TextField } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";
import type { ManueltSkjema } from "../schema";

export function MedforelderSkjema() {
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();
  return (
    <div className="border p-4 rounded-md space-y-4">
      <TextField
        {...form.field("medforelder.navn").getInputProps()}
        error={form.field("medforelder.navn").error()}
        label={t(tekster.navn.label)}
        description={t(tekster.navn.description)}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />
    </div>
  );
}
const tekster = definerTekster({
  navn: {
    label: {
      nb: "Hva heter den andre forelderen?",
      en: "Name of the other parent",
      nn: "Kva heter den andre forelderen?",
    },
    description: {
      nb: "Skriv inn den andre forelderen sitt fulle navn",
      en: "Enter the other parent's full name",
      nn: "Skriv inn den andre forelderen sitt fulle namn",
    },
  },
});
