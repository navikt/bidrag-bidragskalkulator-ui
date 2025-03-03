import { useLocation, useNavigate } from "react-router";

export const formSteps = [
  { path: "/skjema/barn-og-inntekt", label: "Barn og inntekt" },
  { path: "/skjema/utgifter", label: "Utgifter" },
  { path: "/skjema/annet", label: "Annet" },
];

export const useCurrentStep = () => {
  const location = useLocation();
  return formSteps.findIndex((step) => step.path === location.pathname) + 1;
};

export const useStepNavigation = () => {
  const currentStep = useCurrentStep();
  const navigate = useNavigate();
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === formSteps.length;

  const handlePrevious = () => {
    if (!isFirstStep) {
      navigate(formSteps[currentStep - 2].path);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      navigate(formSteps[currentStep].path);
    }
  };

  const handleStepChange = (step: number) => {
    if (step >= 1 && step <= formSteps.length) {
      navigate(formSteps[step - 1].path);
    } else {
      console.error("Invalid step index provided", step);
    }
  };

  return {
    currentStep,
    handlePrevious,
    handleNext,
    handleStepChange,
    isLastStep,
    isFirstStep,
  };
};
