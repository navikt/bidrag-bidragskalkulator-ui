import { withZod } from "@rvf/zod";
import { z } from "zod";
const formSchema = z.object({
  barn: z
    .array(
      z.object({
        alder: z
          .string()
          .nonempty("Alder må oppgis")
          .pipe(
            z.coerce
              .number()
              .min(0, "Alder må være et positivt tall")
              .step(1, { message: "Oppgi alder i hele år" })
          ),
        samværsgrad: z
          .string()
          .nonempty("Samværsgrad må oppgis")
          .pipe(
            z.coerce
              .number()
              .min(0, "Samværsgrad må være minst 0")
              .max(100, "Samværsgrad må være høyst 100")
          ),
      })
    )
    .min(1, "Minst ett barn må legges til")
    .max(10, "Maks 10 barn kan legges til"),
  inntektForelder1: z
    .string()
    .nonempty("Inntekt må oppgis")
    .pipe(
      z.coerce
        .number()
        .min(0, "Inntekt må være et positivt tall")
        .step(1, { message: "Oppgi inntekt i hele kroner" })
    ),
  inntektForelder2: z
    .string()
    .nonempty("Inntekt må oppgis")
    .pipe(
      z.coerce
        .number()
        .min(0, "Inntekt må være et positivt tall")
        .step(1, { message: "Oppgi inntekt i hele kroner" })
    ),
});

export const validator = withZod(formSchema);

export const responseSchema = z.object({
  resultater: z.array(
    z.object({
      sum: z.number(),
      barnetsAlder: z.number(),
    })
  ),
});

export type FormValues = z.infer<typeof formSchema>;
export type FormResponse = z.infer<typeof responseSchema> | { error: string };
