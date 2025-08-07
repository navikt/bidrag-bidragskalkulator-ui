import { useMemo } from "react";
import { usePrivatAvtaleForm } from "~/features/privatAvtale/PrivatAvtaleFormProvider";
import {
  stegdata,
  type StegdataType,
} from "~/features/privatAvtale/privatAvtaleSteg";
import { lagPrivatAvtaleFlerstegsSchema } from "~/features/privatAvtale/skjemaSchema";
import { useOversettelse } from "~/utils/i18n";

/**
 * Hook for å finne ufullstendige steg basert på skjemavalidering
 *
 * Denne hooken validerer det nåværende skjemadataene mot privatavtale-skjemaet
 * og returnerer en liste over steg som har valideringsfeil.
 *
 * @returns Array av StegdataType som representerer ufullstendige steg
 */
export const useUfullstendigeSteg = (): StegdataType[] => {
  const { form } = usePrivatAvtaleForm();
  const { språk } = useOversettelse();

  const alleSteg = useMemo(() => stegdata(språk), [språk]);
  const validator = useMemo(
    () => lagPrivatAvtaleFlerstegsSchema(språk),
    [språk],
  );
  const skjemadata = useMemo(() => form.value(), [form]);

  return useMemo(() => {
    const valideringsresultat = validator.safeParse(skjemadata);

    if (valideringsresultat.success) {
      return [];
    }

    const unikeStegnummer = new Set<number>();

    for (const issue of valideringsresultat.error.issues) {
      const stegnummer = hentStegnummerFraFeilsti(issue.path);
      if (stegnummer !== null) {
        unikeStegnummer.add(stegnummer);
      }
    }

    return Array.from(unikeStegnummer)
      .map((stegnummer) => finnStegForStegnummer(stegnummer, alleSteg))
      .filter((steg): steg is StegdataType => steg !== null);
  }, [validator, skjemadata, alleSteg]);
};

const hentStegnummerFraFeilsti = (feilsti: PropertyKey[]): number | null => {
  const førstePath = feilsti[0];
  if (typeof førstePath !== "string") return null;

  const stegnummerString = førstePath.replace("steg", "");
  const stegnummer = Number(stegnummerString);

  return isNaN(stegnummer) ? null : stegnummer;
};

const finnStegForStegnummer = (
  stegnummer: number,
  alleSteg: StegdataType[],
): StegdataType | null => {
  return alleSteg.find((steg) => steg.step === stegnummer) ?? null;
};
