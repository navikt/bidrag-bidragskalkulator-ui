import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import {
  FormProvider,
  isValidationErrorResponse,
  useForm,
} from "@rvf/react-router";
import { useEffect, useRef, useState } from "react";
import type { ActionFunctionArgs, MetaArgs } from "react-router";
import { useActionData, useRouteLoaderData } from "react-router";
import { BetaNotis } from "~/features/BetaNotis";
import { Barnebidragsskjema } from "~/features/skjema/Barnebidragsskjema";
import { hentBarnebidragsutregning } from "~/features/skjema/beregning/api.server";
import { hentKalkulatorgrunnlagsdata } from "~/features/skjema/grunnlagsdata/api.server";
import { IntroPanel } from "~/features/skjema/IntroPanel";
import { Resultatpanel } from "~/features/skjema/Resultatpanel";
import {
  lagBarnebidragSkjema,
  type BarnebidragSkjema,
  type BarnebidragSkjemaValidert,
} from "~/features/skjema/schema";
import {
  BARNEBIDRAG_SKJEMA_STANDARDVERDI,
  sporSkjemaseksjonFullført,
} from "~/features/skjema/utils";
import { UxsignalsWidget } from "~/features/UxsignalsWidget";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, oversett, Språk, useOversettelse } from "~/utils/i18n";

export function meta({ matches }: MetaArgs) {
  const rootData = matches.find((match) => match.pathname === "/")
    ?.loaderData as {
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
  return hentBarnebidragsutregning(request);
}

export async function loader() {
  return hentKalkulatorgrunnlagsdata();
}

export const useKalkulatorgrunnlagsdata = () => {
  const loaderData = useRouteLoaderData<typeof loader>("routes/kalkulator");
  if (!loaderData) {
    throw new Error("Kunne ikke finne kalkulatorgrunnlagsdata.");
  }
  return loaderData;
};

export default function Barnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);
  const resultatOgUXSignalWidgetRef = useRef<HTMLDivElement>(null);
  const { t } = useOversettelse();
  const [erEndretSidenUtregning, settErEndretSidenUtregning] = useState(false);

  const { språk } = useOversettelse();

  const form = useForm<BarnebidragSkjema, BarnebidragSkjemaValidert>({
    schema: lagBarnebidragSkjema(språk),
    submitSource: "state",
    method: "post",
    defaultValues: BARNEBIDRAG_SKJEMA_STANDARDVERDI,
    onSubmitSuccess: () => {
      setTimeout(() => {
        resultatOgUXSignalWidgetRef.current?.focus({ preventScroll: true });
        resultatOgUXSignalWidgetRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        resultatRef.current?.focus();
      }, 1);
      settErEndretSidenUtregning(false);
    },
    onInvalidSubmit: () => {
      const errors = form.formState.fieldErrors;
      const feltMedFeil = Object.keys(errors);

      feltMedFeil.forEach((feil) => {
        sporHendelse({
          hendelsetype: "skjema validering feilet",
          skjemaId: "barnebidragskalkulator-under-18",
          feltMedFeil: feil,
        });
      });

      sporHendelse({
        hendelsetype: "skjema validering feilet",
        skjemaId: "barnebidragskalkulator-under-18",
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
    onSubmitFailure: () => {
      if (erValideringsfeil) {
        resultatRef.current?.focus();
      }
    },
  });

  useEffect(() => {
    const unsubscribe = form.subscribe.value((values) => {
      settErEndretSidenUtregning(true);
      sporSkjemaseksjonFullført(values);
    });
    return () => unsubscribe();
  }, [form]);

  const skjemarespons =
    !actionData || isValidationErrorResponse(actionData) ? null : actionData;
  const visResultat = skjemarespons && !erEndretSidenUtregning;
  const erValideringsfeil = isValidationErrorResponse(actionData);

  useEffect(() => {
    if (skjemarespons) {
      const harFeil = "error" in skjemarespons;

      if (harFeil) {
        sporHendelse({
          hendelsetype: "skjema innsending feilet",
          skjemaId: "barnebidragskalkulator-under-18",
          feil: skjemarespons.error,
        });
      } else {
        sporHendelse({
          hendelsetype: "skjema fullført",
          skjemaId: "barnebidragskalkulator-under-18",
        });
      }
    }
  }, [skjemarespons]);

  return (
    <>
      <FormProvider scope={form.scope()}>
        <BetaNotis />
        <div className="max-w-xl mx-auto mt-8 flex flex-col gap-4 mb-16">
          <Heading size="xlarge" level="1" spacing align="center">
            {t(tekster.overskrift)}
          </Heading>

          <IntroPanel />
          <Barnebidragsskjema form={form} />

          {erValideringsfeil && (
            <div className="mt-6">
              <Alert variant="error">
                <BodyLong ref={resultatRef} tabIndex={-1}>
                  {actionData.fieldErrors.root}
                </BodyLong>
              </Alert>
            </div>
          )}
          {visResultat && (
            <div className="space-y-4" ref={resultatOgUXSignalWidgetRef}>
              <Resultatpanel data={skjemarespons} ref={resultatRef} />
              <UxsignalsWidget />
            </div>
          )}
        </div>
      </FormProvider>
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
      nb: "Barnebidragskalkulatoren hjelper deg å regne ut hva du skal betale eller motta i barnebidrag.",
      en: "The child support calculator helps you calculate how much you should pay or receive in child support.",
      nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut kva du skal betale eller motta i fostringstilskot.",
    },
  },
  brødsmuler: {
    steg1: {
      label: {
        nb: "Barnebidrag",
        nn: "Fostringstilskot",
        en: "Child support",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag",
        nn: "https://www.nav.no/barnebidrag",
        en: "https://www.nav.no/barnebidrag/en",
      },
    },
    steg2: {
      label: {
        nb: "Kalkulator",
        nn: "Kalkulator",
        en: "Calculator",
      },
      url: {
        nb: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
        nn: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
        en: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
      },
    },
  },
  overskrift: {
    nb: <>Barnebidrags&shy;kalkulator</>,
    en: "Child support calculator",
    nn: <>Fostringstilskots&shy;kalkulator</>,
  },
});

export const handle = {
  brødsmuler: [tekster.brødsmuler.steg1, tekster.brødsmuler.steg2],
};
