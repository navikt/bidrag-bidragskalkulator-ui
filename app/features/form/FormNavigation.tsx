import { Button, HStack } from "@navikt/ds-react";
import { useStepNavigation } from "./steps";

interface FormNavigationProps {
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

export default function FormNavigation({
  onSubmit,
  submitDisabled = false,
}: FormNavigationProps) {
  const { isFirstStep, isLastStep, handlePrevious, handleNext } =
    useStepNavigation();

  return (
    <HStack gap="4" justify="end" className="mt-8">
      {!isFirstStep && (
        <Button variant="secondary" onClick={handlePrevious} type="button">
          Tilbake
        </Button>
      )}

      <Button
        variant="primary"
        onClick={isLastStep ? onSubmit : handleNext}
        type="submit"
        disabled={submitDisabled}
      >
        {isLastStep ? "Send inn" : "Neste"}
      </Button>
    </HStack>
  );
}
