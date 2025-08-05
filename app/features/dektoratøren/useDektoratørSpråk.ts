import {
  onLanguageSelect,
  setBreadcrumbs,
} from "@navikt/nav-dekoratoren-moduler";
import { useState } from "react";
import type { Applikasjonsside } from "~/types/applikasjonssider";
import { Språk } from "~/utils/i18n";
import { lagBrødsmulesti } from "./brødsmulesti";

export function useDekoratørSpråk(
  eksterntSpråk: Språk,
  side: Applikasjonsside,
) {
  const [interntSpråk, setInterntSpråk] = useState(eksterntSpråk);
  onLanguageSelect(({ locale }) => {
    if (Object.values(Språk).includes(locale as Språk)) {
      const språk = locale as Språk;
      setInterntSpråk(språk);
      setBreadcrumbs(lagBrødsmulesti(språk, side));
    } else {
      setInterntSpråk(Språk.NorwegianBokmål);
    }
    // TODO: Når man endrer språk, trigges ikke loaderne på nytt,
    // som igjen gjør at loaders ikke oppdateres, som _igjen_ gjør at
    // meta-tags (mer spesifikt tittel) ikke oppdateres slik de skal.
    // Som en workaround laster vi siden på nytt når man endrer språk.
    window.location.reload();
  });
  return interntSpråk;
}
