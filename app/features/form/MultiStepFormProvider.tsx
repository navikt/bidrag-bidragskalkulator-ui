import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { usePersistedState } from "~/hooks/usePersistedState";

// Define the type for our form data
export interface FormData {
  // Step 1 - Personal Information
  firstName: string;
  lastName: string;
  email: string;

  // Step 2 - Address Information
  address: string;
  postalCode: string;
  city: string;

  // Step 3 - Additional Information
  comments: string;
  agreeToTerms: boolean;

  // Add more fields as needed
  [key: string]: any;
}

// Define the context type
interface MultiStepFormContextType {
  formData: FormData;
  setFormData: (data: FormData) => void;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

// Create the context with a default undefined value
const MultiStepFormContext = createContext<
  MultiStepFormContextType | undefined
>(undefined);

// Initial empty form data
const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  comments: "",
  agreeToTerms: false,
};

// Provider component
export function MultiStepFormProvider({ children }: { children: ReactNode }) {
  // Use our custom hook for persisted state
  const [formData, setFormData] = usePersistedState<FormData>(
    "formData",
    initialFormData
  );
  const [currentStep, setCurrentStep] = usePersistedState<number>(
    "currentStep",
    1
  );

  // Function to update form data partially
  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prevData) => ({ ...prevData, ...newData }));
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
  };

  return (
    <MultiStepFormContext.Provider
      value={{
        formData,
        setFormData,
        updateFormData,
        resetForm,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
}

// Custom hook to use the form context
export function useMultiStepForm() {
  const context = useContext(MultiStepFormContext);
  if (context === undefined) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider"
    );
  }
  return context;
}
