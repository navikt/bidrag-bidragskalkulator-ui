import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import {
  FormProvider,
  isValidationErrorResponse,
  useForm,
} from "@rvf/react-router";
import { useEffect, useRef, useState } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { BetaNotis } from "~/features/BetaNotis";
import { hentManuellBidragsutregning } from "~/features/skjema/beregning/api.server";
import { IntroPanel } from "~/features/skjema/IntroPanel";
import { ManueltBidragsskjema } from "~/features/skjema/manuell/ManueltBidragsskjema";
import { ManueltResultatpanel } from "~/features/skjema/manuell/ManueltResultatpanel";
import { hentManuellPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
import {
  type ManueltSkjema,
  type ManueltSkjemaValidert,
  lagManueltSkjema,
} from "~/features/skjema/schema";
import { hentManueltSkjemaStandardverdi } from "~/features/skjema/utils";
import { sporHendelse } from "~/utils/analytics";
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
  return hentManuellBidragsutregning(request);
}

export async function loader({ request }: LoaderFunctionArgs) {
  return medToken(request, hentManuellPersoninformasjon);
}

export default function ManuellBarnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);
  const { t } = useOversettelse();
  const personinformasjon = useLoaderData<typeof loader>();
  const [erEndretSidenUtregning, settErEndretSidenUtregning] = useState(false);

  const { språk } = useOversettelse();

  const form = useForm<ManueltSkjema, ManueltSkjemaValidert>({
    schema: lagManueltSkjema(språk),
    submitSource: "state",
    method: "post",
    defaultValues: hentManueltSkjemaStandardverdi(personinformasjon),
    onSubmitSuccess: () => {
      resultatRef.current?.focus({ preventScroll: true });
      resultatRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      settErEndretSidenUtregning(false);
      sporHendelse({
        hendelsetype: "skjema fullført",
        skjemaId: "barnebidragskalkulator-under-18",
        skjemanavn: "Kalkulator barnebidrag under 18 år",
      });
    },
    onInvalidSubmit: () => {
      sporHendelse({
        hendelsetype: "skjema validering feilet",
        skjemaId: "barnebidragskalkulator-under-18",
        skjemanavn: "Kalkulator barnebidrag under 18 år",
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
    onSubmitFailure: (error) => {
      sporHendelse({
        hendelsetype: "skjema innsending feilet",
        skjemaId: "barnebidragskalkulator-under-18",
        skjemanavn: "Kalkulator barnebidrag under 18 år",
        feil: String(error),
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

  return (
    <>
      <FormProvider scope={form.scope()}>
        <BetaNotis />
        <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
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
        </div>
        {skjemarespons && !erEndretSidenUtregning && (
          <div className="max-w-3xl mx-auto p-4 mt-8">
            <ManueltResultatpanel data={skjemarespons} ref={resultatRef} />
          </div>
        )}
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
  overskrift: {
    nb: <>Barnebidrags&shy;kalkulator</>,
    en: "Child support calculator",
    nn: <>Fostringstilskots&shy;kalkulator</>,
  },
  ingenBarn: {
    info: {
      nb: "Vi finner ingen barn å beregne bidrag for.",
      en: "We cannot find any children to calculate support for.",
      nn: "Vi finn ingen barn å rekne bidrag for.",
    },
  },
});
