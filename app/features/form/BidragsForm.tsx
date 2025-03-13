import { Button, TextField } from "@navikt/ds-react";
import { useFieldArray, useForm } from "@rvf/react-router";
import { useRef } from "react";
import { sporHendelse } from "~/utils/analytics";
import { BarnForm } from "./BarnForm";
import { validator } from "./validator";

export function BidragsForm() {
  const form = useForm({
    validator,
    method: "post",
    defaultValues: {
      barn: [{ alder: "", samværsgrad: "15" }],
      inntektForelder1: "",
      inntektForelder2: "",
    },
    onSubmitSuccess: () => {
      resultatRef.current?.scrollIntoView({ behavior: "smooth" });
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
  const resultatRef = useRef<HTMLDivElement>(null);

  return (
    <form {...form.getFormProps()} className="space-y-4 mt-6">
      {barnFields.map((key, item, index) => (
        <BarnForm
          key={key}
          item={item}
          index={index}
          canRemove={barnFields.length() > 1}
          onRemove={() => barnFields.remove(index)}
        />
      ))}

      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => barnFields.push({ alder: "", samværsgrad: "15" })}
      >
        Legg til barn
      </Button>

      <div className="flex flex-col gap-4">
        <TextField
          {...form.field("inntektForelder1").getInputProps()}
          label="Hva er inntekten din?"
          type="number"
          error={form.field("inntektForelder1").error()}
          className="max-w-sm"
        />
        <TextField
          {...form.field("inntektForelder2").getInputProps()}
          label="Hva er inntekten til den andre forelderen?"
          type="number"
          error={form.field("inntektForelder2").error()}
          className="max-w-sm"
        />
      </div>

      <Button type="submit" loading={form.formState.isSubmitting}>
        Beregn barnebidraget
      </Button>
    </form>
  );
}
