import FormLayout from "~/features/form/FormLayout";
import { MultiStepFormProvider } from "~/features/form/MultiStepFormProvider";

export default function FormRoute() {
  return (
    <MultiStepFormProvider>
      <FormLayout />
    </MultiStepFormProvider>
  );
}
