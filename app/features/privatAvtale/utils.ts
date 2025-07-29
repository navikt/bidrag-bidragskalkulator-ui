import type { UtregningNavigasjonsdata } from "../skjema/beregning/schema";
import type { ManuellPersoninformasjon } from "../skjema/personinformasjon/schema";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

type Barn = PrivatAvtaleSkjema["barn"][number];

const tomtBarn: Barn = {
  ident: "",
  fulltNavn: "",
  sum: "",
  bidragstype: "",
};

export const hentPrivatAvtaleSkjemaStandardverdi = (
  personinformasjonDeg: ManuellPersoninformasjon,
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
      ident: personinformasjonDeg.person.ident,
      fulltNavn: personinformasjonDeg.person.fulltNavn,
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
