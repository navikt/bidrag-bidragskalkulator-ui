import { Heading, VStack } from "@navikt/ds-react";
import FormNavigation from "./FormNavigation";
import { useScopedForm } from "./MultiStepFormProvider";

export default function Step2() {
  const form = useScopedForm("inntektOgBarn");
  const handleSubmit = () => {
    console.log("submit step 2");
    form.submit();
  };
  return (
    <form
      {...form.getFormProps({
        onSubmit: handleSubmit,
      })}
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
