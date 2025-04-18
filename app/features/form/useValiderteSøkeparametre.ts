import { useSearchParams } from "react-router";
import { ZodSchema } from "zod";

/**
 * Henter ut en parset versjon av søkeparametrene i URL-en.
 *
 * @param schema Zod-schema for å validere søkeparametrene
 * @returns Parset objekt eller null hvis valideringen feiler
 */
export function useValiderteSøkeparametre<T>(schema: ZodSchema<T>) {
  const [søkeparameterString] = useSearchParams();
  if (!søkeparameterString) {
    return null;
  }

  try {
    const søkeparametre = parseSøkeparametreTilObjekt(
      søkeparameterString.toString()
    );

    const resultat = schema.safeParse(søkeparametre);

    if (!resultat.success) {
      return null;
    }

    return resultat.data;
  } catch {
    return null;
  }
}

/** Intern støttefunksjon for å gjøre om en søkeparameter-streng til et objekt */
function parseSøkeparametreTilObjekt(søkeparameterstring: string) {
  const søkeparametre = new URLSearchParams(søkeparameterstring);
  type Søkeparameter =
    | string
    | Array<Record<string, string>>
    | Record<string, string>;
  const resultat: Record<string, Søkeparameter> = {};

  for (const [nøkkel, verdi] of søkeparametre.entries()) {
    const sti = nøkkel.replace(/\]/g, "").split(/\[|\./); // støtter både items[0].id og items[0][id]

    let nåværende = resultat;
    sti.forEach((segment, index) => {
      const erSiste = index === sti.length - 1;
      const nesteSegment = sti[index + 1];
      const erArray = /^\d+$/.test(nesteSegment || "");

      if (erSiste) {
        nåværende[segment] = verdi;
      } else {
        if (nåværende[segment] == null) {
          nåværende[segment] = erArray ? [] : {};
        }
        nåværende = nåværende[segment] as Record<string, Søkeparameter>;
      }
    });
  }

  return resultat;
}
