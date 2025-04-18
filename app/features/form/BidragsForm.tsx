import { Button } from "@navikt/ds-react";
import { useFieldArray, type FormApi } from "@rvf/react-router";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BarnForm } from "./BarnForm";
import { FormattertTallTextField } from "./FormattertTallTextField";

type BidragsFormProps = {
  form: FormApi<{
    barn: {
      alder: string;
      bostatus: string;
      samværsgrad: string;
    }[];
    inntektForelder1: string;
    inntektForelder2: string;
  }>;
};

export function BidragsForm({ form }: BidragsFormProps) {
  const { t } = useOversettelse();

  const barnFields = useFieldArray(form.scope("barn"));

  return (
    <form {...form.getFormProps()} className="space-y-4 mt-6">
      {barnFields.map((key, barn, index) => (
        <BarnForm
          key={key}
          barn={barn}
          index={index}
          kanFjernes={barnFields.length() > 1}
          onFjern={() => {
            barnFields.remove(index);
            setTimeout(() => {
              // Dette er den gamle lengden – den blir ikke oppdatert av en eller annen grunn
              const antallBarnFørSletting = barnFields.length();
              if (antallBarnFørSletting > 1) {
                const sisteIndex = antallBarnFørSletting - 2;
                finnFokuserbartInputPåBarn(sisteIndex)?.focus();
              }
            }, 0);
          }}
        />
      ))}

      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => {
          barnFields.push({ alder: "", samværsgrad: "15", bostatus: "" });

          setTimeout(() => {
            const nyttBarnIndex = barnFields.length();
            finnFokuserbartInputPåBarn(nyttBarnIndex)?.focus();
          }, 0);
        }}
      >
        {t(tekster.leggTilBarn)}
      </Button>

      <div className="flex flex-col gap-4">
        <FormattertTallTextField
          {...form.field("inntektForelder1").getControlProps()}
          label={t(tekster.hvaErInntektenDin)}
          description={t(tekster.hvaErInntektenDinBeskrivelse)}
          error={form.field("inntektForelder1").error()}
          htmlSize={18}
        />
        <FormattertTallTextField
          {...form.field("inntektForelder2").getControlProps()}
          label={t(tekster.hvaErInntektenTilDenAndreForelderen)}
          description={t(
            tekster.hvaErInntektenTilDenAndreForelderenBeskrivelse
          )}
          error={form.field("inntektForelder2").error()}
          htmlSize={18}
        />
      </div>

      <Button type="submit" loading={form.formState.isSubmitting}>
        {t(tekster.beregnBarnebidraget)}
      </Button>
    </form>
  );
}

const tekster = definerTekster({
  leggTilBarn: {
    nb: "Legg til barn",
    en: "Add child",
    nn: "Legg til barn",
  },
  hvaErInntektenDin: {
    nb: "Hva er inntekten din?",
    en: "What is your income?",
    nn: "Kva er inntekta di?",
  },
  hvaErInntektenTilDenAndreForelderen: {
    nb: "Hva er inntekten til den andre forelderen?",
    en: "What is the other parent's income?",
    nn: "Kva er inntekta til den andre forelderen?",
  },
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Beregn fostringstilskotet",
  },
  hvaErInntektenDinBeskrivelse: {
    nb: "Oppgi all inntekt per år før skatt.",
    en: "Enter all annual income before taxes.",
    nn: "Oppgi all inntekt per år før skatt.",
  },
  hvaErInntektenTilDenAndreForelderenBeskrivelse: {
    nb: "Oppgi all inntekt per år før skatt",
    en: "Enter all annual income before taxes.",
    nn: "Oppgi all inntekt per år før skatt",
  },
});

// Dette er en hjelpefunksjon for å finne det første fokuserbare input-elementet på et barn
// Man burde egentlig brukt refs til det, men jeg klarer ikke å forstå hvordan man skal få det til med
// react-validated-form
const finnFokuserbartInputPåBarn = (index: number) => {
  return document.querySelector(
    `input[name="barn[${index}].alder"]`
  ) as HTMLInputElement;
};
