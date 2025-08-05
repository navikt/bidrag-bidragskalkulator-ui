import { Alert, BodyLong, Heading } from "@navikt/ds-react";
import { isValidationErrorResponse, useForm } from "@rvf/react-router";
import { useEffect, useRef, useState } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from "react-router";
import { useActionData, useLoaderData } from "react-router";
import { medToken } from "~/features/autentisering/api.server";
import { hentBidragsutregning } from "~/features/skjema/beregning/api.server";
import { InnloggetBidragsskjema } from "~/features/skjema/InnloggetBidragsskjema";
import { IntroPanel } from "~/features/skjema/IntroPanel";
import { hentPersoninformasjon } from "~/features/skjema/personinformasjon/api.server";
import { Resultatpanel } from "~/features/skjema/Resultatpanel";
import {
  type InnloggetSkjema,
  type InnloggetSkjemaValidert,
  lagInnloggetSkjema,
} from "~/features/skjema/schema";
import { getInnloggetSkjemaStandardverdi } from "~/features/skjema/utils";
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
  return medToken(request, hentBidragsutregning);
}

export async function loader({ request }: LoaderFunctionArgs) {
  return medToken(request, hentPersoninformasjon);
}

export default function InnloggetBarnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);
  const { t } = useOversettelse();
  const personinformasjon = useLoaderData<typeof loader>();
  const [erEndretSidenUtregning, settErEndretSidenUtregning] = useState(false);

  const harBarn =
    personinformasjon.barnerelasjoner.flatMap((relasjon) => relasjon.fellesBarn)
      .length > 0;

  const { språk } = useOversettelse();

  const form = useForm<InnloggetSkjema, InnloggetSkjemaValidert>({
    schema: lagInnloggetSkjema(språk),
    submitSource: "state",
    method: "post",
    defaultValues: getInnloggetSkjemaStandardverdi(personinformasjon),
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
      });
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
    onSubmitFailure: (error) => {
      sporHendelse({
        hendelsetype: "skjema innsending feilet",
        skjemaId: "barnebidragskalkulator-under-18",
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
      <div className="max-w-xl mx-auto p-4 mt-8 flex flex-col gap-4">
        <Heading size="xlarge" level="1" spacing align="center">
          {t(tekster.overskrift)}
        </Heading>

        <IntroPanel />

        {harBarn && <InnloggetBidragsskjema form={form} />}

        {!harBarn && (
          <Alert variant="info">
            <div className="space-y-4">
              <BodyLong>{t(tekster.ingenBarn.info)}</BodyLong>
            </div>
          </Alert>
        )}

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
          <Resultatpanel data={skjemarespons} ref={resultatRef} />
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
  ingenBarn: {
    info: {
      nb: "Vi finner ingen barn å beregne bidrag for.",
      en: "We cannot find any children to calculate support for.",
      nn: "Vi finn ingen barn å rekne bidrag for.",
    },
  },
});
