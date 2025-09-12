import { Radio, RadioGroup } from "@navikt/ds-react";
import { parseFormData, useForm, validationError } from "@rvf/react-router";
import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { z } from "zod";
import { RouteConfig } from "~/config/routeConfig";
import { hentSesjonsdata, oppdaterSesjonsdata } from "~/config/session.server";
import { OppgjørsformSchema } from "~/features/privatAvtale/apiSchema";
import { lagSteg4Schema } from "~/features/privatAvtale/skjemaSchema";
import { teksterAvtaledetaljer } from "~/features/privatAvtale/tekster/avtaledetaljer";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";
import {
  definerTekster,
  hentSpråkFraCookie,
  useOversettelse,
} from "~/utils/i18n";

const NY_AVTALE_ALTERNATIVER = ["true", "false"] as const;
const INNKREVING_ALTERNATIVER = ["false", "true"] as const;

export default function AvtaledetaljerSteg() {
  const { t, språk } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();

  const form = useForm({
    schema: lagSteg4Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      avtaledetaljer: {
        nyAvtale: loaderData?.steg4?.avtaledetaljer?.nyAvtale ?? "",
        oppgjørsformIdag:
          loaderData?.steg4?.avtaledetaljer?.oppgjørsformIdag ?? "",
        medInnkreving: loaderData?.steg4?.avtaledetaljer?.medInnkreving ?? "",
      },
    },
  });

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <RadioGroup
        {...form.getControlProps("avtaledetaljer.nyAvtale")}
        error={form.field("avtaledetaljer.nyAvtale").error()}
        legend={t(tekster.nyAvtale.label)}
      >
        {NY_AVTALE_ALTERNATIVER.map((alternativ) => {
          return (
            <Radio
              value={alternativ}
              key={alternativ}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                "er-ny-avtale",
                t(tekster.nyAvtale.label),
              )}
            >
              {t(tekster.nyAvtale[alternativ])}
            </Radio>
          );
        })}
      </RadioGroup>

      {form.field("avtaledetaljer.nyAvtale").value() === "false" && (
        <RadioGroup
          {...form.getControlProps("avtaledetaljer.oppgjørsformIdag")}
          error={form.field("avtaledetaljer.oppgjørsformIdag").error()}
          legend={t(teksterAvtaledetaljer.oppgjørsformIdag.label)}
        >
          {OppgjørsformSchema.options.map((alternativ) => {
            return (
              <Radio
                value={alternativ}
                key={alternativ}
                onChange={sporPrivatAvtaleSpørsmålBesvart(
                  "oppgjørsform-idag",
                  t(teksterAvtaledetaljer.oppgjørsformIdag.label),
                )}
              >
                {t(teksterAvtaledetaljer.oppgjørsformIdag[alternativ])}
              </Radio>
            );
          })}
        </RadioGroup>
      )}

      <RadioGroup
        {...form.getControlProps("avtaledetaljer.medInnkreving")}
        error={form.field("avtaledetaljer.medInnkreving").error()}
        legend={t(tekster.medInnkreving.label)}
      >
        {INNKREVING_ALTERNATIVER.map((alternativ) => (
          <Radio
            value={alternativ}
            key={alternativ}
            onChange={sporPrivatAvtaleSpørsmålBesvart(
              "med-innkreving",
              t(tekster.medInnkreving.label),
            )}
          >
            {t(tekster.medInnkreving[alternativ])}
          </Radio>
        ))}
      </RadioGroup>
    </Form>
  );
}

const tekster = definerTekster({
  tittel: {
    nb: "Litt om avtalen",
    nn: "Litt om avtalen",
    en: "About the agreement",
  },

  nyAvtale: {
    label: {
      nb: "Er dette en ny avtale?",
      nn: "Er dette ein ny avtale?",
      en: "Is this a new agreement?",
    },
    true: {
      nb: "Ja",
      nn: "Ja",
      en: "Yes",
    },
    false: {
      nb: "Nei, dette er en endring av en eksisterende avtale",
      nn: "Nei, dette er en endring av en eksisterande avtale",
      en: "No, this is a change to an existing agreement",
    },
  },
  medInnkreving: {
    label: {
      nb: "Ønsket oppgjørsform",
      nn: "Ynskja oppgjerstype",
      en: "Settlement type",
    },
    true: {
      nb: "Vi ønsker at bidraget skal betales gjennom Skatteetaten v/Nav Innkreving",
      nn: "Vi ønsker at bidraget skal betalast gjennom Skatteetaten v/Nav Innkreving",
      en: "We want the support to be paid through the Tax Administration via Nav Collection",
    },
    false: {
      nb: "Vi ønsker å gjøre opp bidraget oss i mellom (privat)",
      nn: "Vi ønsker å gjere opp bidraget oss imellom (privat)",
      en: "We want to settle the support between us (private)",
    },
  },
});

const Steg3SessionSchema = z.object({
  steg4: z
    .object({
      avtaledetaljer: z.object({
        nyAvtale: z.enum(["true", "false"]),
        oppgjørsformIdag: z.enum([...OppgjørsformSchema.options, ""]),
        medInnkreving: z.enum(["true", "false"]),
      }),
    })
    .partial()
    .optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  return hentSesjonsdata(request, Steg3SessionSchema);
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const formData = await parseFormData(request, lagSteg4Schema(språk));

  if (formData.error) {
    return validationError(formData.error, formData.submittedData);
  }

  return redirect(
    RouteConfig.PRIVAT_AVTALE.STEG_5_ANDRE_BESTEMMELSER,
    await oppdaterSesjonsdata(request, {
      steg4: {
        avtaledetaljer: formData.data.avtaledetaljer,
      },
    }),
  );
}
