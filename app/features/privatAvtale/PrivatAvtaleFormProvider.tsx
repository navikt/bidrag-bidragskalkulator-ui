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
  lagPrivatAvtaleFlerstegsSchema,
  type PrivatAvtaleFlerstegsSkjema as PrivatAvtaleFlerstegsSkjemaType,
  type PrivatAvtaleFlerstegsSkjemaValidert,
} from "~/features/privatAvtale/skjemaSchema";
import { hentPrivatAvtaleFlerstegsSkjemaStandardverdi } from "~/features/privatAvtale/utils";
import {
  BidragstypeSchema,
  type Bidragstype,
  type UtregningNavigasjonsdata,
} from "~/features/skjema/beregning/schema";
import { sporHendelse } from "~/utils/analytics";
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
    typeof useForm<
      PrivatAvtaleFlerstegsSkjemaType,
      PrivatAvtaleFlerstegsSkjemaValidert
    >
  >;
  feilVedHentingAvAvtale: string | undefined;
  antallNedlastedeFiler: number | undefined;
};

const PrivatAvtaleFormContext = createContext<
  PrivatAvtaleFormContextType | undefined
>(undefined);

const hentPrivatAvtalePdf = async (
  basename: string,
  skjemadata: PrivatAvtaleFlerstegsSkjemaValidert,
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

  return respons.blob();
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

type PrivatAvtaleFormProviderProps = {
  children: ReactNode;
  bidragsutregning?: UtregningNavigasjonsdata;
  personinformasjon: HentPersoninformasjonForPrivatAvtaleRespons;
};

export function PrivatAvtaleFormProvider({
  children,
  bidragsutregning,
  personinformasjon,
}: PrivatAvtaleFormProviderProps) {
  const { t, språk } = useOversettelse();
  const basename = useHref("/");

  const [feilVedHentingAvAvtale, settFeilVedHentingAvAvtale] = useState<
    string | undefined
  >();
  const [antallNedlastedeFiler, setAntallNedlastedeFiler] = useState<
    number | undefined
  >();
  const [innsendtSkjema, setInnsendtSkjema] = useState<
    PrivatAvtaleFlerstegsSkjemaValidert | undefined
  >();

  const form = useForm<
    PrivatAvtaleFlerstegsSkjemaType,
    PrivatAvtaleFlerstegsSkjemaValidert,
    Resultat[]
  >({
    schema: lagPrivatAvtaleFlerstegsSchema(språk),
    submitSource: "state",
    defaultValues: hentPrivatAvtaleFlerstegsSkjemaStandardverdi(
      bidragsutregning,
      personinformasjon,
    ),
    handleSubmit: async (skjemaData) => {
      settFeilVedHentingAvAvtale(undefined);
      setInnsendtSkjema(skjemaData);

      const barnPerBidragstype = BidragstypeSchema.options
        .map((type) => ({
          type,
          barn: skjemaData.steg2.barn.filter((b) => b.bidragstype === type),
        }))
        .filter(({ barn }) => barn.length > 0);

      const resultater = await Promise.all(
        barnPerBidragstype.map(async ({ type, barn }) => {
          try {
            const pdf = await hentPrivatAvtalePdf(basename, {
              ...skjemaData,
              steg2: { barn },
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
      setAntallNedlastedeFiler(resultater.length);
      sporHendelse({
        hendelsetype: "skjema fullført",
        skjemaId: "barnebidrag-privat-avtale-under-18",
      });
    },
    onInvalidSubmit: () => {
      sporHendelse({
        hendelsetype: "skjema validering feilet",
        skjemaId: "barnebidrag-privat-avtale-under-18",
        førsteFeil:
          document.activeElement instanceof HTMLInputElement
            ? document.activeElement.name
            : null,
      });
    },
    onSubmitFailure: (error) => {
      const message =
        error instanceof Error ? error.message : t(tekster.feilmelding);
      settFeilVedHentingAvAvtale(message);
      sporHendelse({
        hendelsetype: "skjema innsending feilet",
        skjemaId: "barnebidrag-privat-avtale-under-18",
        feil: undefined,
      });
      throw new Error(message);
    },
  });

  const erEndretEtterInnsending = useCallback(() => {
    if (!innsendtSkjema) return false;
    return JSON.stringify(innsendtSkjema) !== JSON.stringify(form.value());
  }, [innsendtSkjema, form]);

  useEffect(() => {
    const unsubscribe = form.subscribe.value(() => {
      if (erEndretEtterInnsending()) {
        settFeilVedHentingAvAvtale(undefined);
        setAntallNedlastedeFiler(undefined);
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
