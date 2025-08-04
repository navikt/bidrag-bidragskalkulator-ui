import {
  onLanguageSelect,
  setBreadcrumbs,
} from "@navikt/nav-dekoratoren-moduler";
import { useState } from "react";
import type { Applikasjonsside } from "~/types/applikasjonssider";
import { Språk } from "~/utils/i18n";
import { fåBrødsmulesti } from "./brødsmulesti";

export function useDekoratørSpråk(
  eksterntSpråk: Språk,
  side: Applikasjonsside,
) {
  const [interntSpråk, setInterntSpråk] = useState(eksterntSpråk);
  onLanguageSelect(({ locale }) => {
    if (Object.values(Språk).includes(locale as Språk)) {
      const språk = locale as Språk;
      setInterntSpråk(språk);
      setBreadcrumbs(fåBrødsmulesti(språk, side));
    } else {
      setInterntSpråk(Språk.NorwegianBokmål);
    }
  });
  return interntSpråk;
}
