import { FormProvider, useForm } from "@rvf/react";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useHref } from "react-router";
import {
  lagPrivatAvtaleSkjemaValidertSchema,
  type PrivatAvtaleSkjema as PrivatAvtaleSkjemaType,
  type PrivatAvtaleSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import { hentPrivatAvtaleSkjemaStandardverdi } from "~/features/privatAvtale/utils";
import {
  BidragstypeSchema,
  type Bidragstype,
  type ManuellBidragsutregning,
} from "~/features/skjema/beregning/schema";
import { tilÅrMånedDag } from "~/utils/dato";
import { useOversettelse } from "~/utils/i18n";
import { lastNedPdf } from "~/utils/pdf";
import type { ManuellPersoninformasjon } from "../skjema/personinformasjon/schema";

type PrivatAvtaleFormContextType = {
  form: ReturnType<
    typeof useForm<PrivatAvtaleSkjemaType, PrivatAvtaleSkjemaValidert>
  >;
  feilVedHentingAvAvtale: string | undefined;
  isSubmitting: boolean;
};

const PrivatAvtaleFormContext = createContext<
  PrivatAvtaleFormContextType | undefined
>(undefined);

const hentPrivatAvtalePdf = async (
  basename: string,
  skjemadata: PrivatAvtaleSkjemaValidert,
): Promise<Response> => {
  return fetch(`${basename}api/privat-avtale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skjemadata),
  });
};

const lagPrivatAvtalePdfNavn = (bidragstype: Bidragstype) => {
  const datoFormatert = tilÅrMånedDag(new Date());
  const rolle =
    bidragstype === "MOTTAKER"
      ? "som-mottaker"
      : bidragstype === "PLIKTIG"
        ? "som-pliktig"
        : "ukjent";

  return `privat-avtale-barnebidrag-${rolle}-${datoFormatert}.pdf`;
};

export function PrivatAvtaleFormProvider({
  children,
  personinformasjon,
  bidragsutregning,
}: {
  children: ReactNode;
  personinformasjon: ManuellPersoninformasjon;
  bidragsutregning?: ManuellBidragsutregning;
}) {
  const { språk } = useOversettelse();
  const basename = useHref("/");

  const [feilVedHentingAvAvtale, settFeilVedHentingAvAvtale] = useState<
    string | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<PrivatAvtaleSkjemaType, PrivatAvtaleSkjemaValidert>({
    schema: lagPrivatAvtaleSkjemaValidertSchema(språk),
    submitSource: "state",
    defaultValues: hentPrivatAvtaleSkjemaStandardverdi(
      personinformasjon,
      bidragsutregning?.resultater,
    ),
    handleSubmit: async (skjemaData) => {
      setIsSubmitting(true);
      settFeilVedHentingAvAvtale(undefined);

      const barnPerBidragstype = BidragstypeSchema.options
        .map((type) => ({
          type,
          barn: skjemaData.barn.filter((b) => b.bidragstype === type),
        }))
        .filter(({ barn }) => barn.length > 0);

      const resultater = await Promise.all(
        barnPerBidragstype.map(async ({ type, barn }) => {
          const respons = await hentPrivatAvtalePdf(basename, {
            ...skjemaData,
            barn,
          });

          if (!respons.ok) {
            return { type, pdf: null };
          }

          const pdf = await respons.blob();
          return { type, pdf };
        }),
      );

      const feilet = resultater.some(({ pdf }) => pdf === null);

      if (feilet) {
        setIsSubmitting(false);
        settFeilVedHentingAvAvtale("Feil ved generering av avtale");

        return;
      }

      resultater.forEach(({ type, pdf }) => {
        if (pdf) {
          lastNedPdf(pdf, lagPrivatAvtalePdfNavn(type));
        }
      });
      setIsSubmitting(false);
    },
  });

  return (
    <PrivatAvtaleFormContext.Provider
      value={{ form, feilVedHentingAvAvtale, isSubmitting }}
    >
      <FormProvider scope={form.scope()}>
        <form {...form.getFormProps()} className="flex flex-col gap-4">
          {children}
        </form>
      </FormProvider>
    </PrivatAvtaleFormContext.Provider>
  );
}

export function usePrivatAvtaleForm() {
  const context = useContext(PrivatAvtaleFormContext);
  if (!context) {
    throw new Error(
      "usePrivatAvtaleForm må brukes innenfor PrivatAvtaleFormProvider",
    );
  }
  return context;
}
