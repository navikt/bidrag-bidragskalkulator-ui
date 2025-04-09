import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { isValidationErrorResponse } from "@rvf/react-router";
import { useRef } from "react";
import type { ActionFunctionArgs, MetaArgs } from "react-router";
import { useActionData } from "react-router";
import { handleFormSubmission } from "~/features/form/api.server";
import { BidragsForm } from "~/features/form/BidragsForm";
import { IntroPanel } from "~/features/form/IntroPanel";
import { Resultatpanel } from "~/features/form/Resultatpanel";
import { useBidragsform } from "~/features/form/useBidragsForm";
import type { SkjemaResponse } from "~/features/form/validator";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";

export function meta({ matches }: MetaArgs) {
  const rootData = matches.find((match) => match.pathname === "/")?.data as {
    språk: Språk;
  };

  const språk = rootData?.språk ?? Språk.NorwegianBokmål;

  return [
    { title: oversett(språk, tekster.meta.tittel) },
    {
      name: "description",
      content: oversett(språk, tekster.meta.beskrivelse),
    },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  return handleFormSubmission(
    await request.formData(),
    request.headers.get("Cookie")
  );
}

export default function Barnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);
  const { t } = useOversettelse();
  const { form, erEndretSidenUtregning } = useBidragsform(resultatRef);

  const getResultData = () => {
    if (!actionData || isValidationErrorResponse(actionData)) {
      return null;
    }

    return actionData as SkjemaResponse;
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-4 mt-8">
        <Heading size="xlarge" level="1" spacing align="center">
          {t(tekster.overskrift)}
        </Heading>

        <IntroPanel />

        <BidragsForm form={form} />

        {isValidationErrorResponse(actionData) && (
          <div className="mt-6">
            <Alert variant="error">
              <BodyLong ref={resultatRef} tabIndex={-1}>
                {actionData.fieldErrors.root}
              </BodyLong>
            </Alert>
          </div>
        )}
      </div>
      {actionData && !erEndretSidenUtregning && (
        <div className="max-w-3xl mx-auto p-4 mt-8">
          <Resultatpanel
            data={getResultData()}
            formData={form.value()}
            ref={resultatRef}
          />
        </div>
      )}
    </>
  );
}

const tekster = definerTekster({
  meta: {
    tittel: {
      nb: "Barnebidragskalkulator",
      en: "Child support calculator",
      nn: "Fostringstilskotskalkulator",
    },
    beskrivelse: {
      nb: "Barnebidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
      en: "The child support calculator helps you calculate how much child support you are entitled to.",
      nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut hvor stort eit fostringstilskot er.",
    },
  },
  overskrift: {
    nb: <>Barnebidrags&shy;kalkulator</>,
    en: "Child support calculator",
    nn: <>Fostringstilskots&shy;kalkulator</>,
  },
});
