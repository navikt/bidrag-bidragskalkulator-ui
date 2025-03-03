import { Button, Heading, Select, TextField, VStack } from "@navikt/ds-react";
import { useFieldArray } from "@rvf/react-router";
import FormNavigation from "./FormNavigation";
import { useScopedForm } from "./MultiStepFormProvider";
import { samværsgrad } from "./samværsgrad";

export default function Step1() {
  const form = useScopedForm("inntektOgBarn");

  const barnFields = useFieldArray(form.scope("barn"));

  return (
    <form {...form.getFormProps()}>
      <VStack gap="4">
        <Heading size="medium" level="2">
          Barn og inntekt
        </Heading>
        {barnFields.map((key, item, index) => (
          <div key={key} className="border p-4 rounded-md space-y-4">
            <Heading size="small" level="2">
              Barn {index + 1}
            </Heading>
            <div className="flex gap-4">
              <TextField
                {...item.field("alder").getInputProps()}
                label="Barnets alder"
                className="flex-1"
                type="number"
                error={item.field("alder").error()}
              />

              <Select
                {...item.field("samværsgrad").getInputProps()}
                className="flex-1"
                label="Tid hos forelder 1"
                error={item.field("samværsgrad").error()}
              >
                <option value="">Velg prosent</option>
                {samværsgrad.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {barnFields.length() > 1 && (
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => barnFields.remove(index)}
                  >
                    Fjern barn
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => barnFields.push({ alder: "", samværsgrad: "" })}
          >
            Legg til barn
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <TextField
            {...form.field("inntektForelder1").getInputProps()}
            label="Inntekt forelder 1 (kr/år)"
            type="number"
            error={form.field("inntektForelder1").error()}
          />
          <TextField
            {...form.field("inntektForelder2").getInputProps()}
            label="Inntekt forelder 2 (kr/år)"
            type="number"
            error={form.field("inntektForelder2").error()}
          />
        </div>
        <FormNavigation />
      </VStack>
    </form>
  );
}
