import { PlusIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import {
  FormProvider,
  parseFormData,
  useFieldArray,
  useForm,
  validationError,
} from "@rvf/react-router";
import React from "react";
import {
  Form,
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { z } from "zod";
import { RouteConfig } from "~/config/routeConfig";
import {
  commitSession,
  getSession,
  PRIVAT_AVTALE_SESSION_KEY,
} from "~/config/session.server";
import { PrivatAvtaleEnkeltbarnSkjema } from "~/features/privatAvtale/PrivatAvtaleEnkeltbarn";
import {
  lagSteg2Schema,
  type PrivatAvtaleFlerstegsSkjema,
  type PrivatAvtaleFlerstegsSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import { BidragstypeSchema } from "~/features/skjema/beregning/schema";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, Språk, useOversettelse } from "~/utils/i18n";

export default function BarnOgBidragSteg() {
  const { t, språk } = useOversettelse();
  const loaderData = useLoaderData<typeof loader>();

  const form = useForm<
    PrivatAvtaleFlerstegsSkjema["steg2"],
    PrivatAvtaleFlerstegsSkjemaValidert["steg2"]
  >({
    schema: lagSteg2Schema(språk),
    submitSource: "state",
    method: "post",
    id: "steg",
    defaultValues: {
      barn: loaderData?.steg2?.barn ?? [
        {
          ident: "",
          fornavn: "",
          etternavn: "",
          sum: "",
          bidragstype: "",
          fraDato: "",
        },
      ],
    },
  });
  const barnArray = useFieldArray(form.scope("barn"));
  const antallBarn = barnArray.length();
  const bidragstype = form.value("barn[0].bidragstype");

  const handleLeggTilBarn = () => {
    barnArray.push({
      ident: "",
      fornavn: "",
      etternavn: "",
      sum: "",
      bidragstype: bidragstype ?? "",
      fraDato: "",
    });
    sporHendelse({
      hendelsetype: "barn lagt til",
      skjemaId: "barnebidrag-privat-avtale-under-18",
      antall: antallBarn + 1,
    });

    setTimeout(() => {
      finnFokuserbartInputPåBarn(antallBarn)?.focus();
    }, 0);
  };

  const handleFjernBarn = (index: number) => {
    barnArray.remove(index);
    sporHendelse({
      hendelsetype: "barn fjernet",
      skjemaId: "barnebidrag-privat-avtale-under-18",
      antall: antallBarn - 1,
    });

    setTimeout(() => {
      if (antallBarn > 1) {
        const sisteIndex = antallBarn - 2;
        finnFokuserbartInputPåBarn(sisteIndex)?.focus();
      }
    }, 0);
  };

  return (
    <Form {...form.getFormProps()} className="space-y-6">
      <FormProvider scope={form.scope()}>
        {barnArray.map((key, _, index) => {
          return (
            <React.Fragment key={key}>
              <PrivatAvtaleEnkeltbarnSkjema
                barnIndex={index}
                onFjernBarn={
                  antallBarn > 1 ? () => handleFjernBarn(index) : undefined
                }
              />
              <hr className="my-8 border-gray-300" />
            </React.Fragment>
          );
        })}

        <Button
          type="button"
          variant="secondary"
          size="small"
          onClick={handleLeggTilBarn}
          icon={<PlusIcon aria-hidden />}
        >
          {t(tekster.leggTilBarn)}
        </Button>
      </FormProvider>
    </Form>
  );
}

// Dette er en hjelpefunksjon for å finne det første fokuserbare input-elementet på et barn
// Man burde egentlig brukt refs til det, men jeg klarer ikke å forstå hvordan man skal få det til med
// react-validated-form
const finnFokuserbartInputPåBarn = (index: number) => {
  return document.querySelector(
    `input[name="barn[${index}].fornavn"]`,
  ) as HTMLInputElement;
};

const tekster = definerTekster({
  overskrift: {
    nb: "Felles barn med den du ønsker å avtale barnebidrag med",
    en: "Shared children with the parent you want to agree on child support with",
    nn: "Felles barn med den du ønsker å avtale fostringstilskot med",
  },
  leggTilBarn: {
    nb: "Legg til barn",
    en: "Add child",
    nn: "Legg til barn",
  },
});

const Steg2SessionSchema = z.object({
  steg2: z
    .object({
      barn: z.array(
        z.object({
          ident: z.string().optional().default(""),
          fornavn: z.string().optional().default(""),
          etternavn: z.string().optional().default(""),
          sum: z.string().optional().default(""),
          bidragstype: z.enum(BidragstypeSchema.options),
          fraDato: z.string().optional().default(""),
        }),
      ),
    })
    .partial()
    .optional(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const data = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? null;
  const parsed = Steg2SessionSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

export async function action({ request }: ActionFunctionArgs) {
  const resultat = await parseFormData(
    request,
    lagSteg2Schema(Språk.NorwegianBokmål),
  );

  if (resultat.error) {
    return validationError(resultat.error, resultat.submittedData);
  }

  const session = await getSession(request.headers.get("Cookie"));
  const eksisterende = session.get(PRIVAT_AVTALE_SESSION_KEY) ?? {};
  const oppdatert = { ...eksisterende, steg2: { barn: resultat.data.barn } };
  session.set(PRIVAT_AVTALE_SESSION_KEY, oppdatert);

  return redirect(RouteConfig.PRIVAT_AVTALE.STEG_3_AVTALEDETALJER, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
