import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { FormattertTallTextField } from "./FormattertTallTextField";

import type { InnloggetSkjema } from "./schema";

export const Inntektsopplysninger = () => {
  const form = useFormContext<InnloggetSkjema>();
  const { t } = useOversettelse();

  return (
    <div className="flex flex-col gap-4">
      <FormattertTallTextField
        {...form.field("inntektDeg").getControlProps()}
        label={t(tekster.hvaErInntektenDin)}
        description={t(tekster.hvaErInntektenDinBeskrivelse)}
        error={form.field("inntektDeg").error()}
        htmlSize={18}
      />

      <FormattertTallTextField
        {...form.field("inntektMotpart").getControlProps()}
        label={t(tekster.hvaErInntektenTilDenAndreForelderen)}
        description={t(tekster.hvaErInntektenTilDenAndreForelderenBeskrivelse)}
        error={form.field("inntektMotpart").error()}
        htmlSize={18}
      />
    </div>
  );
};

const tekster = definerTekster({
  hvaErInntektenDin: {
    nb: "Hva er inntekten din?",
    en: "What is your income?",
    nn: "Kva er inntekta di?",
  },
  hvaErInntektenTilDenAndreForelderen: {
    nb: `Hva er inntekten til den andre forelderen?`,
    en: `What is the other parent's income?`,
    nn: `Kva er inntekta til den andre forelderen?`,
  },
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Rekn ut fostringstilskot",
  },
  hvaErInntektenDinBeskrivelse: {
    nb: "Oppgi all inntekt per år før skatt.",
    en: "Enter all annual income before taxes.",
    nn: "Oppgje all inntekt per år før skatt.",
  },
  hvaErInntektenTilDenAndreForelderenBeskrivelse: {
    nb: "Oppgi all inntekt per år før skatt",
    en: "Enter all annual income before taxes.",
    nn: "Oppgje all inntekt per år før skatt",
  },
});
