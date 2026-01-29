import { type FormApi } from "@rvf/react";
import { useEffect } from "react";
import type { BarnebidragSkjema } from "../schema";

export function useTilbakestillBarnepassFelter(
  barnField: FormApi<BarnebidragSkjema["barn"][number]>,
  harBarnetilsynsutgift: string,
  mottarStønadTilBarnetilsyn: string,
) {
  // Reset barnepass-relaterte felter hvis svaret på harBarnetilsynsutgift endres til "nei"
  useEffect(() => {
    if (harBarnetilsynsutgift !== "true") {
      barnField.field("mottarStønadTilBarnetilsyn").reset();
      barnField.field("barnepassSituasjon").reset();
      barnField.field("barnetilsynsutgift").reset();
    }
  }, [harBarnetilsynsutgift, barnField]);

  // Reset barnepassSituasjon hvis svaret på mottarStønadTilBarnetilsyn endres til "nei"
  // Reset barnetilsynsutgift hvis svaret på mottarStønadTilBarnetilsyn endres til "ja"
  useEffect(() => {
    if (mottarStønadTilBarnetilsyn !== "true") {
      barnField.field("barnepassSituasjon").reset();
    } else if (mottarStønadTilBarnetilsyn === "true") {
      barnField.field("barnetilsynsutgift").reset();
    }
  }, [mottarStønadTilBarnetilsyn, barnField]);
}
