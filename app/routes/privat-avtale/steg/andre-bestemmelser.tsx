import { Radio, RadioGroup, Textarea } from "@navikt/ds-react";
import { parseFormData, useForm, validationError } from "@rvf/react-router";
import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import z from "zod";
import { RouteConfig } from "~/config/routeConfig";
import { hentSesjonsdata, oppdaterSesjonsdata } from "~/config/session.server";
import { lagSteg5Schema } from "~/features/privatAvtale/skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";
import {
  definerTekster,
  hentSpråkFraCookie,
  useOversettelse,
} from "~/utils/i18n";

const ER_ANDRE_BESTEMMELSER_ALTERNATIVER = ["true", "false"] as const;

export default function AndreBestemmelserSteg() {
  const { t, språk } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();

  const form = useForm({
    schema: lagSteg5Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      erAndreBestemmelser: loaderData?.steg5?.erAndreBestemmelser ?? "",
      andreBestemmelser: loaderData?.steg5?.andreBestemmelser ?? "",
    },
  });

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <RadioGroup
        {...form.getControlProps("erAndreBestemmelser")}
        error={form.field("erAndreBestemmelser").error()}
        legend={t(tekster.erAndreBestemmelser.label)}
        description={t(tekster.erAndreBestemmelser.beskrivelse)}
      >
        {ER_ANDRE_BESTEMMELSER_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                "har-andre-bestemmelser",
                t(tekster.erAndreBestemmelser.label),
              )}
            >
              {t(tekster.erAndreBestemmelser[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>

      {form.value("erAndreBestemmelser") === "true" && (
        <Textarea
          {...form.field("andreBestemmelser").getInputProps({
            label: t(tekster.andreBestemmelser.label),
            onBlur: sporPrivatAvtaleSpørsmålBesvart(
              "andre-bestemmelser-beskrivelse",
              t(tekster.andreBestemmelser.label),
            ),
          })}
          error={form.field("andreBestemmelser").error()}
        />
      )}
    </Form>
  );
}

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

  return redirect(
    RouteConfig.PRIVAT_AVTALE.STEG_6_VEDLEGG,
    await oppdaterSesjonsdata(request, {
      steg5: {
        erAndreBestemmelser: resultat.data.erAndreBestemmelser.toString(),
        andreBestemmelser: resultat.data.erAndreBestemmelser
          ? resultat.data.andreBestemmelser
          : "",
      },
    }),
  );
};

const Steg5SessionSchema = z.object({
  steg5: z.object({
    erAndreBestemmelser: z.enum(["true", "false"]),
    andreBestemmelser: z.string().max(1000),
  }),
});

const tekster = definerTekster({
  erAndreBestemmelser: {
    label: {
      nb: "Er det andre bestemmelser tilknyttet avtalen?",
      nn: "Er det knytt andre bestemmingar til avtalen?",
      en: "Are there any other conditions that apply to the agreement?",
    },
    beskrivelse: {
      nb: "Her kan det blant annet gis opplysninger om hvordan barnebidraget skal betales, dersom det ikke skal betales igjennom Skatteetaten v/Nav Innkreving.",
      nn: "Her kan det leggjast inn opplysningar om til dømes korleis barnebidraget skal betalast, dersom det ikkje skal betalast gjennom Skatteetaten v/Nav Innkrevjing.",
      en: "Here you can include information about how the child support is to be paid, if not through the Tax Administration/Nav Collection.",
    },
    true: {
      nb: "Ja",
      nn: "Ja",
      en: "Yes",
    },
    false: {
      nb: "Nei",
      nn: "Nei",
      en: "No",
    },
  },
  andreBestemmelser: {
    label: {
      nb: "Andre bestemmelser tilknyttet avtalen",
      nn: "Andre bestemmingar knytt til avtalen",
      en: "Other conditions that apply to the agreement",
    },
  },
});
