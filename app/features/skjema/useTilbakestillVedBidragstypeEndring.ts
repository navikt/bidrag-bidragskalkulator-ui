import { type FormApi } from "@rvf/react";
import { useEffect, useRef } from "react";
import type { BarnebidragSkjema } from "./schema";

export function useTilbakestillVedBidragstypeEndring(
  form: FormApi<BarnebidragSkjema>,
  bidragstype: string,
  barn: BarnebidragSkjema["barn"],
) {
  const forrigeBidragstype = useRef<string>(bidragstype);

  useEffect(() => {
    if (
      forrigeBidragstype.current !== bidragstype &&
      forrigeBidragstype.current !== ""
    ) {
      // Tilbakestill alle felter bortsett fra barn og bidragstype
      form.resetField("deg");
      form.resetField("medforelder");
      form.resetField("barnHarEgenInntekt");
      form.resetField("dittBoforhold");
      form.resetField("medforelderBoforhold");
      form.resetField("ytelser");

      // Tilbakestill barn-spesifikke felter
      barn.forEach((_, index) => {
        form.resetField(`barn[${index}].harBarnetilsynsutgift`);
        form.resetField(`barn[${index}].mottarStønadTilBarnetilsyn`);
        form.resetField(`barn[${index}].barnepassSituasjon`);
        form.resetField(`barn[${index}].barnetilsynsutgift`);
        form.resetField(`barn[${index}].inntektPerMåned`);
      });
    }

    forrigeBidragstype.current = bidragstype;
  }, [barn, bidragstype, form]);
}
