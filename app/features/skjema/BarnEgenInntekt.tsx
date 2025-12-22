import { useFormContext, useFormScope } from "@rvf/react";
import { FormattertTallTextField } from "~/components/ui/FormattertTallTextField";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { BarnebidragSkjema } from "./schema";

type Props = {
  barnIndex: number;
};

export default function BarnEgenInntekt({ barnIndex }: Props) {
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();
  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  if (barnField.value().alder === "") {
    return null;
  }

  return (
    <div className="space-y-2">
      <FormattertTallTextField
        {...barnField.field("inntektPerMåned").getControlProps()}
        label={t(tekster.egenInntekt.beløp(barnField.value().alder))}
        error={barnField.field("inntektPerMåned").error()}
        htmlSize={10}
      />
    </div>
  );
}

const tekster = definerTekster({
  egenInntekt: {
    beløp: (år) => ({
      nb: `Hva er Barn ${år} år sin årsinntekt?`,
      en: ``,
      nn: ``,
    }),
  },
});
