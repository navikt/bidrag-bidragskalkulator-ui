import { oversett, Språk } from "~/utils/i18n";
import { privatAvtaleTekster, stegKonfigurasjon } from "./privatAvtaleSteg";

export type PageMetaType = {
  tittel: string;
  beskrivelse: string;
};

export function hentSideMetadata(
  pathname: string,
  språk: Språk,
): PageMetaType | null {
  const steg = stegKonfigurasjon.find((s) => pathname.includes(s.path));

  if (!steg) {
    return null;
  }

  const tekster = privatAvtaleTekster[steg.key];

  return {
    tittel: oversett(språk, tekster.meta.tittel),
    beskrivelse: oversett(språk, tekster.meta.beskrivelse),
  };
}
