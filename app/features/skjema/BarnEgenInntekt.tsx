import { Radio, RadioGroup, Stack } from "@navikt/ds-react";
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

  const harEgenInntekt = barnField.value().harEgenInntekt;

  return (
    <div className="space-y-2">
      <RadioGroup
        {...barnField.getControlProps("harEgenInntekt")}
        legend={t(tekster.egenInntekt.spørsmål)}
      >
        <Stack
          gap="space-0 space-24"
          direction={{ xs: "column", sm: "row" }}
          wrap={false}
        >
          <Radio value="true">{t(tekster.felles.ja)}</Radio>
          <Radio value="false">{t(tekster.felles.nei)}</Radio>
        </Stack>
      </RadioGroup>

      {harEgenInntekt === "true" && (
        <>
          <FormattertTallTextField
            {...barnField.field("inntektPerMåned").getControlProps()}
            label={t(tekster.egenInntekt.beløp)}
            error={barnField.field("inntektPerMåned").error()}
            description={t(tekster.egenInntekt.hjelpetekst)}
            htmlSize={10}
          />
        </>
      )}
    </div>
  );
}

const tekster = definerTekster({
  egenInntekt: {
    spørsmål: {
      nb: "Har barnet egen inntekt?",
      en: "Does the child have their own income?",
      nn: "Har barnet eigen inntekt?",
    },
    beløp: {
      nb: "Hvor mye tjener barnet per måned?",
      en: "How much does the child earn per month?",
      nn: "Kor mykje tener barnet per månad?",
    },
    hjelpetekst: {
      nb: "Hvis barnet har årsinntekt over 59 100 kr, påvirker det beregningen. Ved inntekt over 176 000 kr regnes barnet som selvforsørget og bidrag beregnes ikke.",
      en: "If the child has an annual income over 59,100 kr, it affects the calculation. With income over 176,000 kr, the child is considered self-sufficient and support is not calculated.",
      nn: "Dersom barnet har årsinntekt over 59 100 kr, påverkar det utrekninga. Ved inntekt over 176 000 kr blir barnet rekna som sjølvforsørga og bidrag blir ikkje utrekna.",
    },
  },
  felles: {
    ja: { nb: "Ja", en: "Yes", nn: "Ja" },
    nei: { nb: "Nei", en: "No", nn: "Nei" },
  },
});
