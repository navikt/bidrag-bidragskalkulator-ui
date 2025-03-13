import { validationError } from "@rvf/react-router";
import { env } from "~/config/env.server";
import { kalkulerBidragstype, kalkulerSamværsklasse } from "./utils";
import { responseSchema, validator } from "./validator";

export async function handleFormSubmission(formData: FormData) {
  const result = await validator.validate(formData);

  if (result.error) {
    return validationError(result.error, result.submittedData);
  }

  const requestData = {
    ...result.data,
    barn: result.data.barn.map((barn) => ({
      alder: barn.alder,
      samværsklasse: kalkulerSamværsklasse(barn.samværsgrad),
      bidragstype: kalkulerBidragstype(
        result.data.inntektForelder1,
        result.data.inntektForelder2,
        barn.samværsgrad
      ),
    })),
  };

  try {
    const response = await fetch(
      `${env.SERVER_URL}/api/v1/beregning/barnebidrag`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      return {
        error: "Det oppstod en feil under beregningen. Vennligst prøv igjen.",
      };
    }
    const json = await response.json();
    const parsed = responseSchema.safeParse(json);

    if (!parsed.success) {
      return {
        error:
          "Vi mottok et ugyldig svar fra beregningsmotoren. Vennligst prøv igjen.",
      };
    }

    return parsed.data;
  } catch (error) {
    console.error(error);
    return {
      error: "Det oppstod en feil under beregningen. Vennligst prøv igjen.",
    };
  }
}
