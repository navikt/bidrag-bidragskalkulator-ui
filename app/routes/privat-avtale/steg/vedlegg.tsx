import {
  definerTekster,
  hentSpråkFraCookie,
  useOversettelse,
} from "~/utils/i18n";

import { Radio, RadioGroup } from "@navikt/ds-react";
import { parseFormData, useForm, validationError } from "@rvf/react-router";
import {
  Form,
  redirectDocument,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import z from "zod";
import { RouteConfig } from "~/config/routeConfig";
import { hentSesjonsdata, oppdaterSesjonsdata } from "~/config/session.server";
import { lagSteg5Schema } from "~/features/privatAvtale/skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";

const AVTALEN_HAR_VEDLEGG_ALTERNATIVER = ["true", "false"] as const;

export default function VedleggStep() {
  const { t, språk } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();
  const form = useForm<
    { harVedlegg: "true" | "false" | "" },
    z.infer<typeof lagSteg5Schema>
  >({
    schema: lagSteg5Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      harVedlegg: loaderData?.steg5?.harVedlegg ?? "",
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
                "har-vedlegg",
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
    harVedlegg: z.enum(["true", "false"]),
  }),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return hentSesjonsdata(request, Steg5SessionSchema);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const resultat = await parseFormData(request, lagSteg5Schema(språk));

  if (resultat.error) {
    return validationError(resultat.error, resultat.submittedData);
  }

  return redirectDocument(
    RouteConfig.PRIVAT_AVTALE.STEG_6_OPPSUMMERING_OG_AVTALE,
    await oppdaterSesjonsdata(request, {
      steg5: { harVedlegg: resultat.data.harVedlegg.toString() },
    }),
  );
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
