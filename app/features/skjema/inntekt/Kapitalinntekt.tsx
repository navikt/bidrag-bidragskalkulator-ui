import { Checkbox } from "@navikt/ds-react";
import { useFormContext } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema } from "../schema";

type Props = {
  part: "deg" | "medforelder";
};

export default function Kapitalinntekt({ part }: Props) {
  const form = useFormContext<BarnebidragSkjema>();
  const { t } = useOversettelse();

  const harKapitalinntektOver10k = form.value(
    `${part}.harKapitalinntektOver10k`,
  );

  return (
    <div>
      <Checkbox
        value="true"
        checked={harKapitalinntektOver10k === "true"}
        onChange={(e) =>
          form.setValue(
            `${part}.harKapitalinntektOver10k`,
            e.target.checked ? "true" : "undefined",
          )
        }
      >
        {t(tekster.checkbox[part])}
      </Checkbox>
      {harKapitalinntektOver10k === "true" && (
        <FormattertTallTextField
          {...form.field(`${part}.kapitalinntekt`).getControlProps()}
          className="pl-8"
          label={t(tekster.textField[part])}
          error={form.field(`${part}.kapitalinntekt`).error()}
          htmlSize={18}
        />
      )}
    </div>
  );
}

const tekster = definerTekster({
  checkbox: {
    deg: {
      nb: "Jeg har netto positiv kapitalinntekt over 10 000 kroner per år",
      en: "I have net positive capital income of over NOK 10,000 per year",
      nn: "Eg har netto positiv kapitalinntekt over 10 000 kroner per år",
    },
    medforelder: {
      nb: "Den andre forelderen har netto positiv kapitalinntekt over 10 000 kroner per år",
      en: "The other parent has net positive capital income of over NOK 10,000 per year",
      nn: "Den andre forelderen har netto positiv kapitalinntekt over 10 000 kroner per år",
    },
  },
  textField: {
    deg: {
      nb: "Hva er din netto positive kapitalinntekt per år?",
      en: "What is your net positive capital income per year?",
      nn: "Hva er din netto positive kapitalinntekt per år?",
    },
    medforelder: {
      nb: "Hva er den andre forelderen sin netto positive kapitalinntekt per år?",
      en: "What is the other parent's net positive capital income per year?",
      nn: "Hva er den andre forelderen sin netto positive kapitalinntekt per år?",
    },
  },
});
