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
