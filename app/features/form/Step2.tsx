import { Heading, VStack } from "@navikt/ds-react";
import FormNavigation from "./FormNavigation";
import { useScopedForm } from "./MultiStepFormProvider";

export default function Step2() {
  const form = useScopedForm("inntektOgBarn");
  
  return (
    <form
      {...form.getFormProps()}
    >
      <VStack gap="4">
        <Heading size="medium" level="2">
          Steg 2
        </Heading>
        <FormNavigation />
      </VStack>
    </form>
  );
}
