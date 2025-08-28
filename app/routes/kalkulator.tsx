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
import { hentManuellBidragsutregning } from "~/features/skjema/beregning/api.server";
import { IntroPanel } from "~/features/skjema/IntroPanel";
import { ManueltBidragsskjema } from "~/features/skjema/manuell/ManueltBidragsskjema";
import { ManueltResultatpanel } from "~/features/skjema/manuell/ManueltResultatpanel";
import { hentKalkulatorgrunnlagsdata } from "~/features/skjema/personinformasjon/api.server";
import {
  type ManueltSkjema,
  type ManueltSkjemaValidert,
  lagManueltSkjema,
} from "~/features/skjema/schema";
import { MANUELT_SKJEMA_STANDARDVERDI } from "~/features/skjema/utils";
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
  return hentManuellBidragsutregning(request);
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

export default function ManuellBarnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);
  const { t } = useOversettelse();
  const [erEndretSidenUtregning, settErEndretSidenUtregning] = useState(false);

  const { språk } = useOversettelse();

  const form = useForm<ManueltSkjema, ManueltSkjemaValidert>({
    schema: lagManueltSkjema(språk),
    submitSource: "state",
    method: "post",
    defaultValues: MANUELT_SKJEMA_STANDARDVERDI,
    onSubmitSuccess: () => {
      resultatRef.current?.focus({ preventScroll: true });
      resultatRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      settErEndretSidenUtregning(false);
    },
    onInvalidSubmit: () => {
      sporHendelse({
        hendelsetype: "skjema validering feilet",
        skjemaId: "barnebidragskalkulator-under-18",
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
  });

  useEffect(() => {
    const unsubscribe = form.subscribe.value(() => {
      settErEndretSidenUtregning(true);
    });
    return () => unsubscribe();
  }, [form]);

  const skjemarespons =
    !actionData || isValidationErrorResponse(actionData) ? null : actionData;

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
          <ManueltBidragsskjema form={form} />

          {isValidationErrorResponse(actionData) && (
            <div className="mt-6">
              <Alert variant="error">
                <BodyLong ref={resultatRef} tabIndex={-1}>
                  {actionData.fieldErrors.root}
                </BodyLong>
              </Alert>
            </div>
          )}
          {skjemarespons && !erEndretSidenUtregning && (
            <ManueltResultatpanel data={skjemarespons} ref={resultatRef} />
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
      nb: "Barnebidragskalkulatoren hjelper deg å regne ut hvor stort et barnebidrag er.",
      en: "The child support calculator helps you calculate how much child support you are entitled to.",
      nn: "Fostringstilskotskalkulatoren hjelper deg å rekne ut hvor stort eit fostringstilskot er.",
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
