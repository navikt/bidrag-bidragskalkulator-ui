import { Alert, BodyLong, Heading, Link } from "@navikt/ds-react";
import { isValidationErrorResponse, useForm } from "@rvf/react-router";
import { useEffect, useRef, useState } from "react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaArgs,
} from "react-router";
import {
  Link as ReactRouterLink,
  useActionData,
  useLoaderData,
} from "react-router";
import { hentBidragsutregning } from "~/features/innlogget/beregning/api.server";
import { InnloggetBidragsskjema } from "~/features/innlogget/InnloggetBidragsskjema";
import { IntroPanel } from "~/features/innlogget/IntroPanel";
import { hentPersoninformasjonAutentisert } from "~/features/innlogget/personinformasjon/api.server";
import { Resultatpanel } from "~/features/innlogget/Resultatpanel";
import {
  type InnloggetSkjema,
  type InnloggetSkjemaValidert,
  getInnloggetSkjema,
} from "~/features/innlogget/schema";
import { getInnloggetSkjemaStandardverdi } from "~/features/innlogget/utils";
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
  return hentBidragsutregning(request);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const respons = await hentPersoninformasjonAutentisert({
    request,
    navigerTilUrlEtterAutentisering: "/",
  });
  if (respons instanceof Response) {
    return respons;
  }

  return respons;
}

export default function InnloggetBarnebidragskalkulator() {
  const actionData = useActionData<typeof action>();
  const resultatRef = useRef<HTMLDivElement>(null);
  const { t } = useOversettelse();
  const personinformasjon = useLoaderData<typeof loader>();
  const [erEndretSidenUtregning, settErEndretSidenUtregning] = useState(false);

  const harMotpart = personinformasjon.barnerelasjoner.length > 0;

  const { språk } = useOversettelse();

  const form = useForm<InnloggetSkjema, InnloggetSkjemaValidert>({
    schema: getInnloggetSkjema(språk),
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
      sporHendelse("skjema fullført");
    },
    onInvalidSubmit: () => {
      sporHendelse("skjema validering feilet", {
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
    onSubmitFailure: (error) => {
      sporHendelse("skjema innsending feilet", { feil: String(error) });
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

        {harMotpart && <InnloggetBidragsskjema form={form} />}

        {!harMotpart && (
          <Alert variant="info">
            <div className="space-y-4">
              <BodyLong>{t(tekster.ingenMotpart.info)}</BodyLong>
              <Link as={ReactRouterLink} to="/">
                {t(tekster.ingenMotpart.lenke)}
              </Link>
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
  ingenMotpart: {
    info: {
      nb: "Vi finner ingen medforelder i systemet. Om du ønsker bruke kalkulatoren, kan du fylle ut skjema selv.",
      en: "We cannot find any co-parent in the system. If you want to use the calculator, you can fill out the form yourself.",
      nn: "Vi finn ingen medforelder i systemet. Om du ønskjer å bruke kalkulatoren, kan du fylle ut skjema sjølv.",
    },
    lenke: {
      nb: "Fyll ut skjema selv",
      en: "Fill out the form yourself",
      nn: "Fyll ut skjema sjølv",
    },
  },
});
