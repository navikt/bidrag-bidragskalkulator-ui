import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import { hentSesjonsdata, oppdaterSesjonsdata } from "~/config/session.server";

import {
  definerTekster,
  hentSpråkFraCookie,
  useOversettelse,
} from "~/utils/i18n";

import { TextField } from "@navikt/ds-react";
import { parseFormData, useForm, validationError } from "@rvf/react-router";
import { z } from "zod";
import { lagSteg2Schema } from "~/features/privatAvtale/skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";
import { FødselsnummerTextField } from "~/features/skjema/FødselsnummerTextField";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";

export default function Steg1Foreldre() {
  const { t, språk } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();
  const form = useForm({
    schema: lagSteg2Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      medforelder: {
        fornavn: loaderData?.steg2?.medforelder?.fornavn ?? "",
        etternavn: loaderData?.steg2?.medforelder?.etternavn ?? "",
        ident: loaderData?.steg2?.medforelder?.ident ?? "",
      },
    },
  });

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <TextField
        {...form.field(`medforelder.fornavn`).getInputProps({
          label: t(tekster.medforelder.fornavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            "medforelder-fornavn",
            t(tekster.medforelder.fornavn.label),
          ),
        })}
        error={form.field(`medforelder.fornavn`).error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />
      <TextField
        {...form.field(`medforelder.etternavn`).getInputProps({
          label: t(tekster.medforelder.etternavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            "medforelder-etternavn",
            t(tekster.medforelder.etternavn.label),
          ),
        })}
        error={form.field(`medforelder.etternavn`).error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />

      <FødselsnummerTextField
        {...form.field(`medforelder.ident`).getControlProps()}
        onBlur={sporPrivatAvtaleSpørsmålBesvart(
          "medforelder-ident",
          t(tekster.medforelder.ident.label),
        )}
        label={t(tekster.medforelder.ident.label)}
        error={form.field(`medforelder.ident`).error()}
        htmlSize={13}
        inputMode="numeric"
        autoComplete="off"
      />
    </Form>
  );
}

const tekster = definerTekster({
  deg: {
    fulltNavn: {
      label: {
        nb: "Fullt navn",
        nn: "Heile namnet",
        en: "Full name",
      },
    },
    ident: {
      label: {
        nb: "Fødselsnummer eller D-nummer (11 siffer)",
        en: "National ID or D-number (11 digits)",
        nn: "Fødselsnummer eller D-nummer (11 siffer)",
      },
    },
  },
  medforelder: {
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
  },
});

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const språk = hentSpråkFraCookie(cookieHeader);
  const resultat = await parseFormData(request, lagSteg2Schema(språk));

  if (!resultat) {
    return validationError(resultat);
  }

  return redirect(
    RouteConfig.PRIVAT_AVTALE.STEG_3_BARN_OG_BIDRAG,
    await oppdaterSesjonsdata(request, {
      steg2: resultat.data,
    }),
  );
}

// Skjema for å validere innholdet i sesjonscookien
const Steg2SessionSchema = z.object({
  steg2: z.object({
    medforelder: z.object({
      fornavn: z.string().optional().default(""),
      etternavn: z.string().optional().default(""),
      ident: z.string().optional().default(""),
    }),
  }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  return hentSesjonsdata(request, Steg2SessionSchema);
}
