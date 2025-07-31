import { FormProvider, useForm } from "@rvf/react";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
  type UtregningNavigasjonsdata,
} from "~/features/skjema/beregning/schema";
import { tilÅrMånedDag } from "~/utils/dato";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { lastNedPdf } from "~/utils/pdf";
import type { HentPersoninformasjonForPrivatAvtaleRespons } from "./apiSchema";

type Resultat = {
  type: Bidragstype;
  pdf: Blob | null;
  feilmelding?: string;
};

type PrivatAvtaleFormContextType = {
  form: ReturnType<
    typeof useForm<PrivatAvtaleSkjemaType, PrivatAvtaleSkjemaValidert>
  >;
  feilVedHentingAvAvtale: string | undefined;
  antallNedlastedeFiler: number | undefined;
};

const PrivatAvtaleFormContext = createContext<
  PrivatAvtaleFormContextType | undefined
>(undefined);

const hentPrivatAvtalePdf = async (
  basename: string,
  skjemadata: PrivatAvtaleSkjemaValidert,
): Promise<Blob> => {
  const respons = await fetch(`${basename}api/privat-avtale`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(skjemadata),
  });

  if (!respons.ok) {
    const feilmelding = await respons.text();
    throw new Error(feilmelding);
  }

  return await respons.blob();
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
  personinformasjon: HentPersoninformasjonForPrivatAvtaleRespons;
  bidragsutregning?: UtregningNavigasjonsdata;
}) {
  const { t, språk } = useOversettelse();
  const basename = useHref("/");

  const [feilVedHentingAvAvtale, settFeilVedHentingAvAvtale] = useState<
    string | undefined
  >();
  const [antallNedlastedeFiler, setAntallNedlastedeFil] = useState<
    number | undefined
  >();
  const [innsendteSkjema, setInnsendteSkjema] = useState<
    PrivatAvtaleSkjemaValidert | undefined
  >();

  const form = useForm<
    PrivatAvtaleSkjemaType,
    PrivatAvtaleSkjemaValidert,
    Resultat[]
  >({
    schema: lagPrivatAvtaleSkjemaValidertSchema(språk),
    submitSource: "state",
    defaultValues: hentPrivatAvtaleSkjemaStandardverdi(
      personinformasjon,
      bidragsutregning,
    ),
    handleSubmit: async (skjemaData) => {
      settFeilVedHentingAvAvtale(undefined);
      setInnsendteSkjema(skjemaData);

      const barnPerBidragstype = BidragstypeSchema.options
        .map((type) => ({
          type,
          barn: skjemaData.barn.filter((b) => b.bidragstype === type),
        }))
        .filter(({ barn }) => barn.length > 0);

      const resultater = await Promise.all(
        barnPerBidragstype.map(async ({ type, barn }) => {
          try {
            const pdf = await hentPrivatAvtalePdf(basename, {
              ...skjemaData,
              barn,
            });

            return { type, pdf };
          } catch (feil: unknown) {
            return {
              type,
              pdf: null,
              feilmelding:
                feil instanceof Error ? feil.message : t(tekster.feilmelding),
            };
          }
        }),
      );

      const feilet = resultater.some(({ pdf }) => pdf === null);
      if (feilet) {
        const førsteFeil = resultater.find(
          (resultat) => resultat.pdf === null,
        )?.feilmelding;
        throw new Error(førsteFeil);
      }

      return resultater;
    },
    onSubmitSuccess: (resultater) => {
      resultater.forEach(({ type, pdf }) => {
        if (pdf) {
          lastNedPdf(pdf, lagPrivatAvtalePdfNavn(type));
        }
      });
      setAntallNedlastedeFil(resultater.length);
    },
    onSubmitFailure: (error) => {
      const message =
        error instanceof Error ? error.message : t(tekster.feilmelding);
      settFeilVedHentingAvAvtale(message);
      throw new Error(message);
    },
  });

  const erEndretEtterInnsending = useCallback(() => {
    if (!innsendteSkjema) return false;
    return JSON.stringify(innsendteSkjema) !== JSON.stringify(form.value());
  }, [innsendteSkjema, form]);

  useEffect(() => {
    const unsubscribe = form.subscribe.value(() => {
      if (erEndretEtterInnsending()) {
        settFeilVedHentingAvAvtale(undefined);
        setAntallNedlastedeFil(undefined);
      }
    });

    return unsubscribe;
  }, [erEndretEtterInnsending, form]);

  return (
    <PrivatAvtaleFormContext.Provider
      value={{
        form,
        feilVedHentingAvAvtale,
        antallNedlastedeFiler,
      }}
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

const tekster = definerTekster({
  feilmelding: {
    nb: "Det oppsto en feil under generering av avtalen.",
    nn: "Det oppstod ein feil under generering av avtalen.",
    en: "An error occurred while generating the agreement.",
  },
});
