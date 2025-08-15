import {
  Form,
  redirect,
  useLoaderData,
  useRouteLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { RouteConfig } from "~/config/routeConfig";
import {
  AVTALEPART_SESSION_KEY,
  commitSession,
  getSession,
} from "~/config/session.server";

import { definerTekster, useOversettelse } from "~/utils/i18n";

import { TextField } from "@navikt/ds-react";
import { useForm } from "@rvf/react-router";
import { z } from "zod";
import { lagSteg1Schema } from "~/features/privatAvtale/skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "~/features/privatAvtale/utils";
import { FødselsnummerTextField } from "~/features/skjema/FødselsnummerTextField";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";
import type { loader as stegLayoutLoader } from "./layout";

export default function Steg1Foreldre() {
  const { t, språk } = useOversettelse();
  const layoutData = useRouteLoaderData<typeof stegLayoutLoader>(
    "routes/privat-avtale/steg/layout",
  );
  const loaderData = useLoaderData<typeof loader>();
  const form = useForm({
    schema: lagSteg1Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      deg: {
        fulltNavn: layoutData?.personinformasjon.fulltNavn ?? "",
        ident: layoutData?.personinformasjon.ident ?? "",
      },
      medforelder: {
        fulltNavn: loaderData?.steg1?.medforelder?.fulltNavn ?? "",
        ident: loaderData?.steg1?.medforelder?.ident ?? "",
      },
    },
  });

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <TextField
        {...form.field(`medforelder.fulltNavn`).getInputProps({
          label: t(tekster.medforelder.fulltNavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            t(tekster.medforelder.fulltNavn.label),
          ),
        })}
        error={form.field(`medforelder.fulltNavn`).error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />

      <FødselsnummerTextField
        {...form.field(`medforelder.ident`).getControlProps()}
        onBlur={sporPrivatAvtaleSpørsmålBesvart(
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
        en: "National identity number or D number (11 digits)",
        nn: "Fødselsnummer eller D-nummer (11 siffer)",
      },
    },
  },
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fulltNavn = String(formData.get("medforelder.fulltNavn") ?? "");
  const ident = String(formData.get("medforelder.ident") ?? "");

  const session = await getSession(request.headers.get("Cookie"));
  session.set(AVTALEPART_SESSION_KEY, {
    steg1: { medforelder: { fulltNavn, ident } },
  });

  return redirect(RouteConfig.PRIVAT_AVTALE.STEG_2_BARN_OG_BIDRAG, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

// Skjema for å validere innholdet i sesjonscookien
const Steg1SessionSchema = z.object({
  steg1: z.object({
    medforelder: z.object({
      fulltNavn: z.string().optional().default(""),
      ident: z.string().optional().default(""),
    }),
  }),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const data = session.get(AVTALEPART_SESSION_KEY) ?? null;
  const parsed = Steg1SessionSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
