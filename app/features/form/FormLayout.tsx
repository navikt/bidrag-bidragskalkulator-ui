import { Box, FormProgress, VStack } from "@navikt/ds-react";
import { Outlet } from "react-router";
import { formSteps, useStepNavigation } from "./steps";

export default function FormLayout() {
  const { currentStep, handleStepChange } = useStepNavigation();

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
