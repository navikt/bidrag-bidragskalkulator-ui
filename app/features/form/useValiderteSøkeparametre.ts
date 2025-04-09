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
  const søkeparametre = parseSøkeparametreTilObjekt(
    søkeparameterString.toString()
  );

  const resultat = schema.safeParse(søkeparametre);

  if (!resultat.success) {
    return null;
  }

  return resultat.data;
}

/** Intern støttefunksjon for å gjøre om en søkeparameter-streng til et objekt */
function parseSøkeparametreTilObjekt(search: string) {
  const params = new URLSearchParams(search);
  const result: Record<string, unknown> = {};

  for (const [key, value] of params.entries()) {
    const path = key.replace(/\]/g, "").split(/\[|\./); // støtter både items[0].id og items[0][id]

    let current: any = result;
    path.forEach((segment, index) => {
      const isLast = index === path.length - 1;
      const nextSegment = path[index + 1];
      const isArray = /^\d+$/.test(nextSegment || "");

      if (isLast) {
        current[segment] = value;
      } else {
        if (current[segment] == null) {
          current[segment] = isArray ? [] : {};
        }
        current = current[segment];
      }
    });
  }

  return result;
}
