import { Heading, TextField, VStack } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import FormNavigation from "./FormNavigation";
import { useMultiStepForm } from "./MultiStepFormProvider";

// Define validation schema for Step 1
const Step1Schema = z.object({
  firstName: z.string().min(1, "Fornavn er påkrevd"),
  lastName: z.string().min(1, "Etternavn er påkrevd"),
  email: z.string().email("Ugyldig e-postadresse").min(1, "E-post er påkrevd"),
});

const validator = withZod(Step1Schema);

export default function Step1() {
  const { formData, updateFormData } = useMultiStepForm();

  // Initialize form with RVF
  const form = useForm({
    validator,
    defaultValues: {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
    },
  });

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;

    updateFormData({
      firstName,
      lastName,
      email,
    });
  };

  return (
    <form {...form.getFormProps()} onSubmit={handleSubmit}>
      <VStack gap="4">
        <Heading size="medium" level="2">
          Personlig informasjon
        </Heading>

        <TextField
          {...form.field("firstName").getInputProps()}
          label="Fornavn"
          description="Skriv inn ditt fornavn"
          error={form.field("firstName").error()}
          required
        />

        <TextField
          {...form.field("lastName").getInputProps()}
          label="Etternavn"
          description="Skriv inn ditt etternavn"
          error={form.field("lastName").error()}
          required
        />

        <TextField
          {...form.field("email").getInputProps()}
          label="E-post"
          description="Skriv inn din e-postadresse"
          type="email"
          error={form.field("email").error()}
          required
        />

        <FormNavigation />
      </VStack>
    </form>
  );
}
