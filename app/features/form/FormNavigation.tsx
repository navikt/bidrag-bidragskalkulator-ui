import { Button, HStack } from "@navikt/ds-react";
import { useNavigate } from "react-router";
import { useMultiStepForm } from "./MultiStepFormProvider";
import { formSteps } from "./FormLayout";

interface FormNavigationProps {
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

export default function FormNavigation({
  onSubmit,
  submitDisabled = false,
}: FormNavigationProps) {
  const { currentStep, setCurrentStep } = useMultiStepForm();
  const navigate = useNavigate();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === formSteps.length;

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(formSteps[prevStep - 1].path);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(formSteps[nextStep - 1].path);
    }
  };

  return (
    <HStack gap="4" justify="end" className="mt-8">
      {!isFirstStep && (
        <Button variant="secondary" onClick={handlePrevious} type="button">
          Tilbake
        </Button>
      )}

      {!isLastStep ? (
        <Button variant="primary" onClick={handleNext} type="submit">
          Neste
        </Button>
      ) : (
        <Button
          variant="primary"
          onClick={onSubmit}
          type="submit"
          disabled={submitDisabled}
        >
          Send inn
        </Button>
      )}
    </HStack>
  );
} 