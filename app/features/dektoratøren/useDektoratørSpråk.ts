import {
  onLanguageSelect,
  setBreadcrumbs,
} from "@navikt/nav-dekoratoren-moduler";
import { useState } from "react";
import { oversett, Språk } from "~/utils/i18n";
import { breadcrumbTekster } from "./breadcrumbTekster";

export function useDekoratørSpråk(eksterntSpråk: Språk) {
  const [interntSpråk, setInterntSpråk] = useState(eksterntSpråk);
  onLanguageSelect(({ locale }) => {
    if (Object.values(Språk).includes(locale as Språk)) {
      const språk = locale as Språk;
      setInterntSpråk(språk);
      setBreadcrumbs([
        {
          title: oversett(språk, breadcrumbTekster.barnebidrag.label),
          url: oversett(språk, breadcrumbTekster.barnebidrag.url),
        },
        {
          title: oversett(
            språk,
            breadcrumbTekster.barnebidragskalkulator.label,
          ),
          url: "https://www.nav.no/barnebidrag/tjenester/kalkulator",
        },
      ]);
    } else {
      setInterntSpråk(Språk.NorwegianBokmål);
    }
  });
  return interntSpråk;
}
