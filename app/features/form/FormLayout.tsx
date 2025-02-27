import { Box, FormProgress, VStack } from "@navikt/ds-react";
import { Outlet, useNavigate } from "react-router";
import { useMultiStepForm } from "./MultiStepFormProvider";

// Define the steps for our form
export const formSteps = [
  { path: "/skjema/barn-og-inntekt", label: "Barn og inntekt" },
  { path: "/skjema/utgifter", label: "Utgifter" },
  { path: "/skjema/annet", label: "Annet" },
];

export default function FormLayout() {
  const { currentStep, setCurrentStep } = useMultiStepForm();
  const navigate = useNavigate();

  // Handle step change
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    navigate(formSteps[step - 1].path);
  };

  return (
    <VStack gap="8" className="my-8">
      <FormProgress
        activeStep={currentStep}
        onStepChange={handleStepChange}
        totalSteps={formSteps.length}
      >
        {formSteps.map((step, index) => (
          <FormProgress.Step
            key={step.path}
            completed={currentStep > index + 1}
            href={step.path}
          >
            {step.label}
          </FormProgress.Step>
        ))}
      </FormProgress>

      <Box
        padding="8"
        background="surface-default"
        borderRadius="medium"
        className="w-full"
      >
        <Outlet />
      </Box>
    </VStack>
  );
}
