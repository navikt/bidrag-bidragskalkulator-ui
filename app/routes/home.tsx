import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { isValidationErrorResponse } from "@rvf/react-router";
import { useRef } from "react";
import type { ActionFunctionArgs } from "react-router";
import { useActionData } from "react-router";
import { handleFormSubmission } from "~/features/form/api.server";
import { BidragsForm } from "~/features/form/BidragsForm";
import { IntroPanel } from "~/features/form/IntroPanel";
import { ResultDisplay } from "~/features/form/ResultDisplay";
import type { FormResponse } from "~/features/form/validator";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Barnebidragskalkulator" },
    {
      name: "description",
      content:
        "Barnebidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
    },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  return handleFormSubmission(await request.formData());
}

export default function Barnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);

  const getResultData = () => {
    if (!actionData || isValidationErrorResponse(actionData)) {
      return null;
    }

    return actionData as FormResponse;
  };

  return (
    <div className="max-w-xl mx-auto p-4 mt-8">
      <Heading size="xlarge" level="1" spacing align="center">
        Barnebidragskalkulator
      </Heading>

      <IntroPanel />

      <BidragsForm />

      {isValidationErrorResponse(actionData) && (
        <div className="mt-6">
          <Alert variant="error">
            <BodyLong>{actionData.fieldErrors.root}</BodyLong>
          </Alert>
        </div>
      )}

      <ResultDisplay data={getResultData()} ref={resultatRef} />
    </div>
  );
}
