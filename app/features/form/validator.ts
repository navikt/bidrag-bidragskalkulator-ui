import { withZod } from "@rvf/zod";
import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

const tekster = definerTekster({
  feilmeldinger: {
    alder: {
      påkrevd: {
        nb: "Fyll ut alder",
        en: "Fill in age",
        nn: "Fyll ut alder",
      },
      tall: {
        nb: "Alder må være et tall",
        en: "Age must be a number",
        nn: "Alder må vere eit tall",
      },
      positivt: {
        nb: "Alder må være et positivt tall",
        en: "Age must be a positive number",
        nn: "Alder må vere eit positivt tal",
      },
      maksimum: {
        nb: "Alder må være høyst 25 år",
        en: "Age must be at most 25 years",
        nn: "Alder må vere høyst 25 år",
      },
      heleÅr: {
        nb: "Fyll ut alder i hele år",
        en: "Fill in age in whole years",
        nn: "Fyll ut alder i heile år",
      },
    },
    samvær: {
      påkrevd: {
        nb: "Fyll ut samværsgrad",
        en: "Fill in visitation degree",
        nn: "Fyll ut samværsgrad",
      },
      minimum: {
        nb: "Samværsgrad må være minst 0",
        en: "Visitation degree must be at least 0",
        nn: "Samværsgrad må vere minst 0",
      },
      maksimum: {
        nb: "Samværsgrad må være høyst 100",
        en: "Visitation degree must be at most 100",
        nn: "Samværsgrad må vere høgst 100",
      },
      minimumHosForelder1: {
        nb: "Barnet kan ikke ha færrest netter hos deg når barnet bor hos deg.",
        en: "The child cannot have fewer nights with you when the child lives with you.",
        nn: "Barnet kan ikkje ha færrest netter hos deg når barnet bur hos deg.",
      },
      maksimumHosForelder2: {
        nb: "Barnet kan ikke ha flest netter hos deg når barnet bor hos den andre forelderen.",
        en: "The child cannot spend most nights with you when the child lives with the other parent.",
        nn: "Barnet kan ikkje ha flest netter hos deg når barnet bur hos den andre forelderen.",
      },
    },
    bostatus: {
      påkrevd: {
        nb: "Fyll ut hvor barnet bor",
        en: "Fill in where the child lives",
        nn: "Fyll ut kjeres barnet bor",
      },
      ugyldig: {
        nb: "Ugyldig verdi",
        en: "Invalid value",
        nn: "Ugyldig verdi",
      },
    },
    barn: {
      minimum: {
        nb: "Minst ett barn må legges til",
        en: "At least one child must be added",
        nn: "Minst eitt barn må leggjast til",
      },
      maksimum: {
        nb: "Maksimum 10 barn kan legges til",
        en: "Maximum 10 children can be added",
        nn: "Maksimum 10 barn kan leggjast til",
      },
    },
    inntekt: {
      påkrevd: {
        nb: "Fyll ut inntekt",
        en: "Fill in income",
        nn: "Fyll ut inntekt",
      },
      positivt: {
        nb: "Inntekt må være et positivt tall",
        en: "Income must be a positive number",
        nn: "Inntekt må vere eit positivt tal",
      },
      heleKroner: {
        nb: "Fyll ut inntekt i hele kroner",
        en: "Fill in income in whole kroner",
        nn: "Fyll ut inntekt i heile kroner",
      },
    },
  },
});

export const søkeparametreSchema = z.object({
  barn: z.array(
    z.object({
      alder: z.string(),
      samværsgrad: z.string(),
      bostatus: z.enum(["HOS_FORELDER_1", "DELT_BOSTED", "HOS_FORELDER_2"]),
    })
  ),
  inntektForelder1: z.string(),
  inntektForelder2: z.string(),
});

export function lagSkjemaSchema(språk: Språk) {
  return z.object({
    barn: z
      .array(
        z
          .object({
            alder: z
              .string()
              .nonempty(oversett(språk, tekster.feilmeldinger.alder.påkrevd))
              .pipe(
                z.coerce
                  .number({
                    invalid_type_error: oversett(
                      språk,
                      tekster.feilmeldinger.alder.tall
                    ),
                  })
                  .min(0, oversett(språk, tekster.feilmeldinger.alder.positivt))
                  .max(25, {
                    message: oversett(
                      språk,
                      tekster.feilmeldinger.alder.maksimum
                    ),
                  })
                  .step(1, {
                    message: oversett(
                      språk,
                      tekster.feilmeldinger.alder.heleÅr
                    ),
                  })
              ),
            bostatus: z
              .string()
              .nonempty(oversett(språk, tekster.feilmeldinger.bostatus.påkrevd))
              .pipe(
                z.enum(["HOS_FORELDER_1", "DELT_BOSTED", "HOS_FORELDER_2"], {
                  message: oversett(
                    språk,
                    tekster.feilmeldinger.bostatus.ugyldig
                  ),
                })
              ),
            samværsgrad: z
              .string()
              .nonempty(oversett(språk, tekster.feilmeldinger.samvær.påkrevd))
              .pipe(
                z.coerce
                  .number()
                  .min(0, oversett(språk, tekster.feilmeldinger.samvær.minimum))
                  .max(
                    30,
                    oversett(språk, tekster.feilmeldinger.samvær.maksimum)
                  )
              ),
          })
          .refine(
            ({ bostatus, samværsgrad }) => {
              if (bostatus === "HOS_FORELDER_1" && samværsgrad < 15) {
                return false;
              }
              return true;
            },
            {
              message: oversett(
                språk,
                tekster.feilmeldinger.samvær.minimumHosForelder1
              ),
              path: ["samværsgrad"],
            }
          )
          .refine(
            ({ bostatus, samværsgrad }) => {
              if (bostatus === "HOS_FORELDER_2" && samværsgrad > 15) {
                return false;
              }
              return true;
            },
            {
              message: oversett(
                språk,
                tekster.feilmeldinger.samvær.maksimumHosForelder2
              ),
              path: ["samværsgrad"],
            }
          )
      )
      .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
      .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
    inntektForelder1: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.inntekt.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.inntekt.positivt))
          .step(1, oversett(språk, tekster.feilmeldinger.inntekt.heleKroner))
      ),
    inntektForelder2: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.inntekt.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.inntekt.positivt))
          .step(1, oversett(språk, tekster.feilmeldinger.inntekt.heleKroner))
      ),
  });
}

export function lagValidatorMedSpråk(språk: Språk) {
  return withZod(lagSkjemaSchema(språk));
}

export const responseSchema = z.object({
  resultater: z.array(
    z.object({
      sum: z.number(),
      barnetsAlder: z.number(),
      bidragstype: z.enum(["PLIKTIG", "MOTTAKER"]),
      underholdskostnad: z.number(),
    })
  ),
});

export type SkjemaResponse = z.infer<typeof responseSchema> | { error: string };
