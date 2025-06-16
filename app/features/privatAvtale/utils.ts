import type { BidragsutregningBarn } from "../skjema/beregning/schema";
import type { ManuellPersoninformasjon } from "../skjema/personinformasjon/schema";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

type Barn = PrivatAvtaleSkjema["barn"][number];

const tomtBarn: Barn = {
  ident: "",
  fornavn: "",
  etternavn: "",
  sum: "",
  bidragstype: "",
};

export const hentPrivatAvtaleSkjemaStandardverdi = (
  personinformasjonDeg: ManuellPersoninformasjon,
  forhåndsutfylteBarn: BidragsutregningBarn[],
): PrivatAvtaleSkjema => {
  const barn: Barn[] = forhåndsutfylteBarn.map((barn) => ({
    ident: "",
    fornavn: "",
    etternavn: "",
    sum: barn.sum.toString(),
    bidragstype: barn.bidragstype,
  }));

  return {
    deg: {
      ident: personinformasjonDeg.person.ident,
      fornavn: "",
      etternavn: "",
    },
    medforelder: {
      ident: "",
      fornavn: "",
      etternavn: "",
    },
    barn: barn.length > 0 ? barn : [tomtBarn],
    fraDato: "",
    nyAvtale: "",
    medInnkreving: "",
    innhold: "",
  };
};
