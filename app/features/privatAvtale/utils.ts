import { sporHendelse } from "~/utils/analytics";
import type { UtregningNavigasjonsdata } from "../skjema/beregning/schema";
import type { HentPersoninformasjonForPrivatAvtaleRespons } from "./apiSchema";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

type Barn = PrivatAvtaleSkjema["barn"][number];

const tomtBarn: Barn = {
  ident: "",
  fulltNavn: "",
  sum: "",
  bidragstype: "",
};

export const hentPrivatAvtaleSkjemaStandardverdi = (
  personinformasjonDeg: HentPersoninformasjonForPrivatAvtaleRespons,
  forhåndsutfylteInformasjon?: UtregningNavigasjonsdata,
): PrivatAvtaleSkjema => {
  const barn: Barn[] = forhåndsutfylteInformasjon?.barn.map((b) => ({
    ident: "",
    fulltNavn: b.navn,
    sum: b.sum.toString(),
    bidragstype: b.bidragstype,
  })) ?? [tomtBarn];

  return {
    deg: {
      ident: personinformasjonDeg.ident,
      fulltNavn: personinformasjonDeg.fulltNavn,
    },
    medforelder: {
      ident: "",
      fulltNavn: forhåndsutfylteInformasjon?.medforelder.navn ?? "",
    },
    barn: barn,
    fraDato: "",
    nyAvtale: "",
    medInnkreving: "",
    innhold: "",
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
        skjemanavn: "Privat avtale under 18 år",
        spørsmålId: event.target.name,
        spørsmål,
      });
    }
  };
