import { Alert, FormSummary, Heading, VStack } from "@navikt/ds-react";
import FormNavigation from "./FormNavigation";
import {
  useFullForm,
  validateFormForSubmission,
} from "./MultiStepFormProvider";
import { samværsgrad } from "./samværsgrad";

export default function Step3() {
  const form = useFullForm();
  const formData = form.value();
  const formValidation = validateFormForSubmission(formData);

  const validationError = !formValidation.success
    ? "Vennligst fyll ut alle påkrevde felt før du sender inn skjemaet."
    : null;

  return (
    <form {...form.getFormProps()}>
      <VStack gap="4">
        <Heading size="medium" level="2">
          Oppsummering
        </Heading>

        {validationError && <Alert variant="error">{validationError}</Alert>}

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">Barn og inntekt</FormSummary.Heading>
          </FormSummary.Header>
          <FormSummary.Answers>
            {formData.inntektOgBarn.barn?.map((barn, index) => (
              <FormSummary.Answer key={index}>
                <FormSummary.Label>Barn {index + 1}</FormSummary.Label>
                <FormSummary.Value>
                  <FormSummary.Answers>
                    <FormSummary.Answer>
                      <FormSummary.Label>Alder</FormSummary.Label>
                      <FormSummary.Value>
                        {barn.alder === "" ? "-" : barn.alder}
                      </FormSummary.Value>
                    </FormSummary.Answer>
                    <FormSummary.Answer>
                      <FormSummary.Label>Samværsgrad</FormSummary.Label>
                      <FormSummary.Value>
                        {barn.samværsgrad === ""
                          ? "-"
                          : samværsgrad.find(
                              (s) => s.value === barn.samværsgrad
                            )?.label}
                      </FormSummary.Value>
                    </FormSummary.Answer>
                  </FormSummary.Answers>
                </FormSummary.Value>
              </FormSummary.Answer>
            ))}
            <FormSummary.Answer>
              <FormSummary.Label>Inntekt, forelder 1</FormSummary.Label>
              <FormSummary.Value>
                {formData.inntektOgBarn.inntektForelder1 === ""
                  ? "-"
                  : formData.inntektOgBarn.inntektForelder1}
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Inntekt, forelder 2</FormSummary.Label>
              <FormSummary.Value>
                {formData.inntektOgBarn.inntektForelder2 === ""
                  ? "-"
                  : formData.inntektOgBarn.inntektForelder2}
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormNavigation submitDisabled={false} />
      </VStack>
    </form>
  );
}
