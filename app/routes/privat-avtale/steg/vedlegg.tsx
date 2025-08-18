import { definerTekster, Språk, useOversettelse } from "~/utils/i18n";

import { Radio, RadioGroup } from "@navikt/ds-react";
import { parseFormData, useForm, validationError } from "@rvf/react-router";
import {
  Form,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import z from "zod";
import { RouteConfig } from "~/config/routeConfig";
import {
  commitSession,
  getSession,
  PRIVAT_AVTALE_SESSION_KEY,
} from "~/config/session.server";
import { lagSteg5Schema } from "~/features/privatAvtale/skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";

const AVTALEN_HAR_VEDLEGG_ALTERNATIVER = ["true", "false"] as const;

export default function VedleggStep() {
  const { t, språk } = useOversettelse();
  const form = useForm({
    schema: lagSteg5Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      harVedlegg: "",
    },
  });

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <RadioGroup
        {...form.getControlProps("harVedlegg")}
        error={form.field("harVedlegg").error()}
        legend={t(tekster.harVedlegg.label)}
      >
        {AVTALEN_HAR_VEDLEGG_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                t(tekster.harVedlegg.label),
              )}
            >
              {t(tekster.harVedlegg[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>
    </Form>
  );
}

const Steg5SessionSchema = z.object({
  steg5: z.object({
    harVedlegg: z.enum(["true", "false", ""]),
  }),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const data = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;
  const parsed = Steg5SessionSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const resultat = await parseFormData(
    request,
    lagSteg5Schema(Språk.NorwegianBokmål),
  );

  if (resultat.error) {
    return validationError(resultat.error, resultat.submittedData);
  }

  const session = await getSession(request.headers.get("Cookie"));
  const eksisterende = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? {};
  const oppdatert = { ...eksisterende, steg5: { ...resultat.data } };
  session.set(PRIVAT_AVTALE_SESSION_KEY, oppdatert);

  return redirect(RouteConfig.PRIVAT_AVTALE.STEG_6_OPPSUMMERING_OG_AVTALE, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

const tekster = definerTekster({
  harVedlegg: {
    label: {
      nb: "Har du noen annen dokumentasjon du ønsker å legge ved?",
      nn: "Har du nokon annan dokumentasjon som du ønsker å legge ved?",
      en: "Do you have any other documentation you would like to submit?",
    },
    true: {
      nb: "Jeg legger det ved dette skjemaet",
      nn: "Eg legg det ved dette skjemaet",
      en: "I am attaching it to this form",
    },
    false: {
      nb: "Nei, jeg har ingen ekstra dokumentasjon jeg vil legge ved",
      nn: "Nei, eg har ingen ekstra dokumentasjon eg vil legge ved",
      en: "No, I have no additional documentation to attach",
    },
  },
});
