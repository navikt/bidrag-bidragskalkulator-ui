import {
  FormProvider,
  useForm,
  useFormContext,
  useFormScope,
} from "@rvf/react";
import { withZod } from "@rvf/zod";
import type { ReactNode } from "react";
import { z } from "zod";
import { usePersistedState } from "~/hooks/usePersistedState";

// Helper schema for handling empty string or number
const numberOrEmptyString = z.union([z.literal(""), z.coerce.number()]);

// Schema for validating non-empty values
const validatedNumber = (options: {
  min?: number;
  max?: number;
  errorMessage?: string;
}) =>
  numberOrEmptyString.refine(
    (val) =>
      val === "" ||
      (typeof val === "number" &&
        val >= (options.min ?? 0) &&
        val <= (options.max ?? Infinity)),
    (val) => ({
      message:
        options.errorMessage ??
        `Verdi må være mellom ${options.min ?? 0} og ${
          options.max ?? "uendelig"
        }`,
    })
  );

const formSchema = z.object({
  inntektOgBarn: z.object({
    inntektForelder1: numberOrEmptyString.refine(
      (val) => val === "" || (typeof val === "number" && val >= 0),
      { message: "Inntekt må være et positivt tall" }
    ),
    inntektForelder2: numberOrEmptyString.refine(
      (val) => val === "" || (typeof val === "number" && val >= 0),
      { message: "Inntekt må være et positivt tall" }
    ),
    barn: z.array(
      z.object({
        alder: validatedNumber({
          min: 0,
          max: 26,
          errorMessage: "Alder må være mellom 0 og 26 år",
        }),
        samværsgrad: validatedNumber({
          min: 0,
          max: 100,
          errorMessage: "Samværsgrad må være mellom 0 og 100",
        }),
      })
    ),
  }),
});

type FormData = z.infer<typeof formSchema>;
const validator = withZod(formSchema);

const initialFormData: FormData = {
  inntektOgBarn: {
    inntektForelder1: "",
    inntektForelder2: "",
    barn: [
      {
        alder: "",
        samværsgrad: "",
      },
    ],
  },
};

// Schema for final validation before submission
const submissionSchema = z.object({
  inntektOgBarn: z.object({
    inntektForelder1: z.coerce
      .number({
        required_error: "Du må fylle ut inntekten",
        invalid_type_error: "Inntekt må være et tall",
      })
      .min(0, "Inntekt må være et positivt tall"),
    inntektForelder2: z.coerce
      .number({
        required_error: "Du må fylle ut inntekten",
        invalid_type_error: "Inntekt må være et tall",
      })
      .min(0, "Inntekt må være et positivt tall"),
    barn: z.array(
      z.object({
        alder: z.coerce
          .number({
            required_error: "Alder er påkrevd",
            invalid_type_error: "Alder må være et tall",
          })
          .min(0, "Alder må være et positivt tall")
          .max(26, "Alder må være mindre enn 26"),
        samværsgrad: z.coerce
          .number({
            required_error: "Samværsgrad er påkrevd",
            invalid_type_error: "Samværsgrad må være et tall",
          })
          .min(0, "Samværsgrad må være en gyldig verdi")
          .max(100, "Samværsgrad må være en gyldig verdi"),
      })
    ),
  }),
});

export function MultiStepFormProvider({ children }: { children: ReactNode }) {
  const [persistedFormData, persistFormData] = usePersistedState(
    "bidragskalkulator-skjemadata",
    initialFormData
  );
  const form = useForm({
    validator,
    defaultValues: persistedFormData,
    handleSubmit: (data) => {
      const validatedFormData = formSchema.safeParse(data);
      if (validatedFormData.success) {
        persistFormData(validatedFormData.data);
      } else {
        console.error(
          "Could not persist form data due to validation error",
          validatedFormData.error
        );
      }
    },
  });

  return <FormProvider scope={form.scope()}>{children}</FormProvider>;
}

/**
 * Custom hook to use the form context
 *
 * @param scope - The scope of the form to use
 * @returns The form context
 */
export function useScopedForm(scope: keyof FormData) {
  const form = useFormContext<FormData>();
  return useFormScope(form.scope(scope));
}

export function useFullForm() {
  const form = useFormContext<FormData>();
  return form;
}

// Add a function to validate the form for submission
export function validateFormForSubmission(formData: FormData) {
  const result = submissionSchema.safeParse(formData);
  return {
    success: result.success,
    errors: result.success ? undefined : result.error.format(),
  };
}
