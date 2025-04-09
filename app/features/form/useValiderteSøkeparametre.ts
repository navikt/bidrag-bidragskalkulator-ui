import { useSearchParams } from "react-router";
import { ZodSchema } from "zod";
import { sporHendelse } from "~/utils/analytics";

/**
 * Henter ut en parset versjon av søkeparametrene i URL-en.
 *
 * @param schema Zod-schema for å validere søkeparametrene
 * @returns Parset objekt eller null hvis valideringen feiler
 */
export function useValiderteSøkeparametre<T>(schema: ZodSchema<T>) {
  const [søkeparameterString] = useSearchParams();
  try {
    const søkeparametre = parseSøkeparametreTilObjekt(
      søkeparameterString.toString()
    );

    const resultat = schema.safeParse(søkeparametre);

    if (!resultat.success) {
      sporHendelse("delbar lenke feilet validering", {
        feil: resultat.error.format(),
      });
      return null;
    }

    return resultat.data;
  } catch (e) {
    sporHendelse("delbar lenke feilet validering", {
      feil: String(e),
    });
    return null;
  }
}

/** Intern støttefunksjon for å gjøre om en søkeparameter-streng til et objekt */
function parseSøkeparametreTilObjekt(søkeparameterstring: string) {
  const søkeparametre = new URLSearchParams(søkeparameterstring);
  const resultat: Record<string, unknown> = {};

  for (const [nøkkel, verdi] of søkeparametre.entries()) {
    const sti = nøkkel.replace(/\]/g, "").split(/\[|\./); // støtter både items[0].id og items[0][id]

    let nåværende: any = resultat;
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
        nåværende = nåværende[segment];
      }
    });
  }

  return resultat;
}
