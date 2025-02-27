import {
  Checkbox,
  FormSummary,
  Heading,
  Textarea,
  VStack,
} from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import FormNavigation from "./FormNavigation";
import { useMultiStepForm } from "./MultiStepFormProvider";

// Define validation schema for Step 3
const Step3Schema = z.object({
  comments: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "Du må godta vilkårene for å fortsette",
  }),
});

const validator = withZod(Step3Schema);

export default function Step3() {
  const { formData, updateFormData, resetForm } = useMultiStepForm();

  // Initialize form with RVF
  const form = useForm({
    validator,
    defaultValues: {
      comments: formData.comments || "",
      agreeToTerms: formData.agreeToTerms || false,
    },
  });

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const comments = formData.get("comments") as string;
    // Check if the checkbox is checked
    const agreeToTermsValue = formData.get("agreeToTerms");
    const agreeToTerms =
      agreeToTermsValue === "on" || agreeToTermsValue === "true";

    updateFormData({
      comments,
      agreeToTerms,
    });

    // In a real application, you would submit the form data to an API here
    console.log("Form submitted:", formData);

    // Reset the form after submission
    setTimeout(() => {
      alert("Skjema sendt inn!");
      resetForm();
    }, 500);
  };

  // Function for the submit button
  const handleFinalSubmit = () => {
    // This will be called when the user clicks the submit button
    // The actual form submission is handled by the form's onSubmit handler
  };

  return (
    <form {...form.getFormProps()} onSubmit={handleSubmit}>
      <VStack gap="6">
        <Heading size="medium" level="2">
          Oppsummering og innsending
        </Heading>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">
              Personlig informasjon
            </FormSummary.Heading>
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>Navn</FormSummary.Label>
              <FormSummary.Value>
                {formData.firstName} {formData.lastName}
              </FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>E-post</FormSummary.Label>
              <FormSummary.Value>{formData.email}</FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <FormSummary>
          <FormSummary.Header>
            <FormSummary.Heading level="3">
              Adresseinformasjon
            </FormSummary.Heading>
          </FormSummary.Header>
          <FormSummary.Answers>
            <FormSummary.Answer>
              <FormSummary.Label>Adresse</FormSummary.Label>
              <FormSummary.Value>{formData.address}</FormSummary.Value>
            </FormSummary.Answer>
            <FormSummary.Answer>
              <FormSummary.Label>Postnummer og sted</FormSummary.Label>
              <FormSummary.Value>
                {formData.postalCode} {formData.city}
              </FormSummary.Value>
            </FormSummary.Answer>
          </FormSummary.Answers>
        </FormSummary>

        <Textarea
          {...form.field("comments").getInputProps()}
          label="Kommentarer eller tilleggsinformasjon"
          description="Legg til eventuelle kommentarer eller tilleggsinformasjon"
          error={form.field("comments").error()}
          maxLength={500}
        />

        <Checkbox
          {...form.field("agreeToTerms").getInputProps()}
          error={form.field("agreeToTerms").error() ? true : undefined}
        >
          Jeg bekrefter at informasjonen over er korrekt og samtykker til
          behandling av mine personopplysninger
        </Checkbox>

        <FormNavigation onSubmit={handleFinalSubmit} submitDisabled={false} />
      </VStack>
    </form>
  );
}
