import { Heading, HGrid, TextField, VStack } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import FormNavigation from "./FormNavigation";
import { useMultiStepForm } from "./MultiStepFormProvider";

// Define validation schema for Step 2
const Step2Schema = z.object({
  address: z.string().min(1, "Adresse er påkrevd"),
  postalCode: z
    .string()
    .min(4, "Postnummer må være minst 4 siffer")
    .max(4, "Postnummer kan ikke være mer enn 4 siffer"),
  city: z.string().min(1, "Sted er påkrevd"),
});

const validator = withZod(Step2Schema);

export default function Step2() {
  const { formData, updateFormData } = useMultiStepForm();

  // Initialize form with RVF
  const form = useForm({
    validator,
    defaultValues: {
      address: formData.address || "",
      postalCode: formData.postalCode || "",
      city: formData.city || "",
    },
  });

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const address = formData.get("address") as string;
    const postalCode = formData.get("postalCode") as string;
    const city = formData.get("city") as string;

    updateFormData({
      address,
      postalCode,
      city,
    });
  };

  return (
    <form {...form.getFormProps()} onSubmit={handleSubmit}>
      <VStack gap="4">
        <Heading size="medium" level="2">
          Adresseinformasjon
        </Heading>

        <TextField
          {...form.field("address").getInputProps()}
          label="Adresse"
          description="Skriv inn din adresse"
          error={form.field("address").error()}
          required
        />

        <HGrid columns={2} gap="4">
          <TextField
            {...form.field("postalCode").getInputProps()}
            label="Postnummer"
            description="Skriv inn ditt postnummer"
            error={form.field("postalCode").error()}
            required
          />

          <TextField
            {...form.field("city").getInputProps()}
            label="Sted"
            description="Skriv inn ditt sted"
            error={form.field("city").error()}
            required
          />
        </HGrid>

        <FormNavigation />
      </VStack>
    </form>
  );
}
