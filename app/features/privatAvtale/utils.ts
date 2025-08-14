import { sporHendelse } from "~/utils/analytics";
import type { UtregningNavigasjonsdata } from "../skjema/beregning/schema";
import type { HentPersoninformasjonForPrivatAvtaleRespons } from "./apiSchema";
import type { PrivatAvtaleFlerstegsSkjema } from "./skjemaSchema";

type Barn = PrivatAvtaleFlerstegsSkjema["steg2"]["barn"][number];

const tomtBarn: Barn = {
  ident: "",
  fornavn: "",
  etternavn: "",
  sum: "",
  bidragstype: "",
  fraDato: "",
};

// TODO Bruke riktige verdier for navn fra skjema
export const hentPrivatAvtaleFlerstegsSkjemaStandardverdi = (
  forhåndsutfyltInformasjon: UtregningNavigasjonsdata | undefined,
  personinformasjon: HentPersoninformasjonForPrivatAvtaleRespons,
): PrivatAvtaleFlerstegsSkjema => {
  const barn: Barn[] = forhåndsutfyltInformasjon?.barn.map((barn) => ({
    ident: "",
    fornavn: barn.navn,
    etternavn: barn.navn,
    sum: barn.sum.toString(),
    bidragstype: barn.bidragstype,
    fraDato: "",
  })) ?? [tomtBarn];

  return {
    steg1: {
      deg: {
        ident: personinformasjon.ident,
        fornavn: personinformasjon.fornavn,
        etternavn: personinformasjon.etternavn,
      },
      medforelder: {
        ident: "",
        fornavn: forhåndsutfyltInformasjon?.medforelder.navn ?? "",
        etternavn: forhåndsutfyltInformasjon?.medforelder.navn ?? "",
      },
    },
    steg2: { barn },
    steg3: {
      avtaledetaljer: {
        nyAvtale: "",
        medInnkreving: "",
      },
    },
    steg4: {
      erAndreBestemmelser: "",
      andreBestemmelser: "",
    },
    steg5: {
      harVedlegg: "",
    },
  };
};

export const sporPrivatAvtaleSpørsmålBesvart =
  (spørsmål: string) =>
  (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.value) {
      sporHendelse({
        hendelsetype: "skjema spørsmål besvart",
        skjemaId: "barnebidrag-privat-avtale-under-18",
        spørsmålId: event.target.name,
        spørsmål,
      });
    }
  };
