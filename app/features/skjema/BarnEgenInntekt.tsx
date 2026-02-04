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

  if (barnField.value().fødselsår === "") {
    return null;
  }

  return (
    <div className="space-y-2">
      <FormattertTallTextField
        {...barnField.field("inntektPerMåned").getControlProps()}
        label={t(
          tekster.egenInntekt.beløp(barnField.value().fødselsår),
        )}
        error={barnField.field("inntektPerMåned").error()}
        htmlSize={10}
      />
    </div>
  );
}

const tekster = definerTekster({
  egenInntekt: {
    beløp: (fødselsår) => ({
      nb: `Hva er årsinntekten til barnet født ${fødselsår}?`,
      en: `What is the annual income of the child born ${fødselsår}?`,
      nn: `Kva er årsinntekta til barnet fødd ${fødselsår}?`,
    }),
  },
});
