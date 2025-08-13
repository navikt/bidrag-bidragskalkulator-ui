import { sporHendelse } from "~/utils/analytics";
import type { UtregningNavigasjonsdata } from "../skjema/beregning/schema";
import type { HentPersoninformasjonForPrivatAvtaleRespons } from "./apiSchema";
import type { PrivatAvtaleFlerstegsSkjema } from "./skjemaSchema";

type Barn = PrivatAvtaleFlerstegsSkjema["steg2"]["barn"][number];

const tomtBarn: Barn = {
  ident: "",
  fulltNavn: "",
  sum: "",
  bidragstype: "",
};

export const hentPrivatAvtaleFlerstegsSkjemaStandardverdi = (
  forhåndsutfyltInformasjon: UtregningNavigasjonsdata | undefined,
  personinformasjon: HentPersoninformasjonForPrivatAvtaleRespons,
): PrivatAvtaleFlerstegsSkjema => {
  const barn: Barn[] = forhåndsutfyltInformasjon?.barn.map((b) => ({
    ident: "",
    fulltNavn: b.navn,
    sum: b.sum.toString(),
    bidragstype: b.bidragstype,
  })) ?? [tomtBarn];

  return {
    steg1: {
      deg: {
        ident: personinformasjon.ident,
        fulltNavn: personinformasjon.fulltNavn,
      },
      medforelder: {
        ident: "",
        fulltNavn: forhåndsutfyltInformasjon?.medforelder.navn ?? "",
      },
    },
    steg2: { barn },
    steg3: {
      avtaledetaljer: {
        fraDato: "",
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
