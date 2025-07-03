import { TextField } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
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
        className="max-w-80"
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
