import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

import { DatePicker } from "@navikt/ds-react";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

const year = new Date().getFullYear();

export const AvtalenGjelderFra = () => {
  const form = useFormContext<PrivatAvtaleSkjema>();
  const { t } = useOversettelse();

  return (
    <div className="border p-4 rounded-md">
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-5">{t(tekster.tittel)}</legend>

        <DatePicker.Standalone
          onSelect={console.info}
          dropdownCaption
          fromDate={new Date(`1 Oct ${year - 2}`)}
          toDate={new Date(`1 Oct ${year + 2}`)}
        />
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  tittel: {
    nb: "Litt om deg",
    nn: "Litt om deg",
    en: "About you",
  },
});
