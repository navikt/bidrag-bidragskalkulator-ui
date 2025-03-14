import { withZod } from "@rvf/zod";
import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

const tekster = definerTekster({
  feilmeldinger: {
    alder: {
      påkrevd: {
        nb: "Alder må oppgis",
        en: "Age is required",
        nn: "Alder må oppgis",
      },
      positivt: {
        nb: "Alder må være et positivt tall",
        en: "Age must be a positive number",
        nn: "Alder må vere eit positivt tal",
      },
      heleÅr: {
        nb: "Oppgi alder i hele år",
        en: "Enter age in whole years",
        nn: "Oppgi alder i heile år",
      },
    },
    samvær: {
      påkrevd: {
        nb: "Samværsgrad må oppgis",
        en: "Visitation degree is required",
        nn: "Samværsgrad må oppgis",
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
    },
    barn: {
      minimum: {
        nb: "Minst ett barn må legges til",
        en: "At least one child must be added",
        nn: "Minst eitt barn må leggjast til",
      },
      maksimum: {
        nb: "Maks 10 barn kan legges til",
        en: "Maximum 10 children can be added",
        nn: "Maks 10 barn kan leggjast til",
      },
    },
    inntekt: {
      påkrevd: {
        nb: "Inntekt må oppgis",
        en: "Income is required",
        nn: "Inntekt må oppgis",
      },
      positivt: {
        nb: "Inntekt må være et positivt tall",
        en: "Income must be a positive number",
        nn: "Inntekt må vere eit positivt tal",
      },
      heleKroner: {
        nb: "Oppgi inntekt i hele kroner",
        en: "Enter income in whole kroner",
        nn: "Oppgi inntekt i heile kroner",
      },
    },
  },
});

export function lagSkjemaSchema(språk: Språk) {
  return z.object({
    barn: z
      .array(
        z.object({
          alder: z
            .string()
            .nonempty(oversett(språk, tekster.feilmeldinger.alder.påkrevd))
            .pipe(
              z.coerce
                .number()
                .min(0, oversett(språk, tekster.feilmeldinger.alder.positivt))
                .step(1, {
                  message: oversett(språk, tekster.feilmeldinger.alder.heleÅr),
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
                  100,
                  oversett(språk, tekster.feilmeldinger.samvær.maksimum)
                )
            ),
        })
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
    })
  ),
});

export type SkjemaResponse = z.infer<typeof responseSchema> | { error: string };
