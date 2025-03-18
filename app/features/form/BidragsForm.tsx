import { Button } from "@navikt/ds-react";
import { useFieldArray, useForm } from "@rvf/react-router";
import { type RefObject } from "react";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BarnForm } from "./BarnForm";
import { FormattertTallTextField } from "./FormattertTallTextField";
import { lagValidatorMedSpråk } from "./validator";

type BidragsFormProps = {
  resultatRef: RefObject<HTMLDivElement>;
};

export function BidragsForm({ resultatRef }: BidragsFormProps) {
  const { t, språk } = useOversettelse();
  const validator = lagValidatorMedSpråk(språk);
  const form = useForm({
    validator,
    submitSource: "state",
    method: "post",
    defaultValues: {
      barn: [{ alder: "", samværsgrad: "15" }],
      inntektForelder1: "",
      inntektForelder2: "",
    },
    onSubmitSuccess: () => {
      resultatRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      sporHendelse("skjema fullført");
    },
    onInvalidSubmit: () => {
      sporHendelse("skjema validering feilet", {
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
    onSubmitFailure: (error) => {
      sporHendelse("skjema innsending feilet", { feil: String(error) });
    },
  });

  const barnFields = useFieldArray(form.scope("barn"));

  return (
    <form {...form.getFormProps()} className="space-y-4 mt-6">
      {barnFields.map((key, item, index) => (
        <BarnForm
          key={key}
          item={item}
          index={index}
          canRemove={barnFields.length() > 1}
          onRemove={() => {
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
          barnFields.push({ alder: "", samværsgrad: "15" });

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
          error={form.field("inntektForelder1").error()}
          className="max-w-sm"
        />
        <FormattertTallTextField
          {...form.field("inntektForelder2").getControlProps()}
          label={t(tekster.hvaErInntektenTilDenAndreForelderen)}
          error={form.field("inntektForelder2").error()}
          className="max-w-sm"
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
    nb: "Hva er inntekten din per år?",
    en: "What is your annual income?",
    nn: "Kva er inntekta di per år?",
  },
  hvaErInntektenTilDenAndreForelderen: {
    nb: "Hva er inntekten til den andre forelderen per år?",
    en: "What is the other parent's annual income?",
    nn: "Kva er inntekta til den andre forelderen per år?",
  },
  beregnBarnebidraget: {
    nb: "Beregn barnebidraget",
    en: "Calculate child support",
    nn: "Beregn fostringstilskotet",
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
