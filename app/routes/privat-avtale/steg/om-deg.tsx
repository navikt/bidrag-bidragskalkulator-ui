import { TextField } from "@navikt/ds-react";
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
import { lagSteg1Schema } from "~/features/privatAvtale/skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";
import { FødselsnummerTextField } from "~/features/skjema/FødselsnummerTextField";
import {
  definerTekster,
  hentSpråkFraCookie,
  useOversettelse,
} from "~/utils/i18n";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";

export default function Steg1OmDeg() {
  const { t, språk } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();
  const form = useForm({
    schema: lagSteg1Schema(språk),
    submitSource: "state",
    id: "steg",
    defaultValues: {
      deg: {
        fornavn: loaderData?.steg1?.deg?.fornavn ?? "",
        etternavn: loaderData?.steg1?.deg?.etternavn ?? "",
        ident: loaderData?.steg1?.deg?.ident ?? "",
      },
    },
    method: "post",
  });

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <TextField
        {...form.field(`deg.fornavn`).getInputProps({
          label: t(tekster.fornavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            "deg-fornavn",
            t(tekster.fornavn.label),
          ),
        })}
        error={form.field(`deg.fornavn`).error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />
      <TextField
        {...form.field(`deg.etternavn`).getInputProps({
          label: t(tekster.etternavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            "deg-etternavn",
            t(tekster.etternavn.label),
          ),
        })}
        error={form.field(`deg.etternavn`).error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />
      <FødselsnummerTextField
        {...form.field(`deg.ident`).getControlProps()}
        onBlur={sporPrivatAvtaleSpørsmålBesvart(
          "deg-ident",
          t(tekster.ident.label),
        )}
        label={t(tekster.ident.label)}
        error={form.field(`deg.ident`).error()}
        htmlSize={13}
        inputMode="numeric"
        autoComplete="off"
      />
    </Form>
  );
}

const tekster = definerTekster({
  fornavn: {
    label: {
      nb: "Fornavn",
      nn: "Fornamn",
      en: "First name",
    },
  },
  etternavn: {
    label: {
      nb: "Etternavn",
      nn: "Etternamn",
      en: "Last name",
    },
  },
  ident: {
    label: {
      nb: "Fødselsnummer eller D-nummer (11 siffer)",
      en: "National identity number or D number (11 digits)",
      nn: "Fødselsnummer eller D-nummer (11 siffer)",
    },
  },
});

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const resultat = await parseFormData(request, lagSteg1Schema(språk));

  if (!resultat) {
    return validationError(resultat);
  }

  return redirect(
    RouteConfig.PRIVAT_AVTALE.STEG_2_OM_DEN_ANDRE_FORELDEREN,
    await oppdaterSesjonsdata(request, {
      steg1: resultat.data,
    }),
  );
}

// Skjema for å validere innholdet i sesjonscookien
const Steg1SessionSchema = z.object({
  steg1: z.object({
    deg: z.object({
      fornavn: z.string().optional().default(""),
      etternavn: z.string().optional().default(""),
      ident: z.string().optional().default(""),
    }),
  }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  return hentSesjonsdata(request, Steg1SessionSchema);
}
