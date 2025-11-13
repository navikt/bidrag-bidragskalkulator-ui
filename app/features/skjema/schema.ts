import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const MAKS_ALDER_BARNETILSYNSUTGIFT = 10;

export type Bidragstype = "MOTTAKER" | "PLIKTIG";

export const FastBostedSchema = z.enum([
  "DELT_FAST_BOSTED",
  "HOS_MEG",
  "HOS_MEDFORELDER",
]);

const BarnSkjemaSchema = z.object({
  alder: z.string(),
  bosted: z.enum([...FastBostedSchema.options, ""]),
  samvær: z.string(),
  barnetilsynsutgift: z.string(),
});

const BarnebidragSkjemaSchema = z.object({
  bidragstype: z.enum(["", "MOTTAKER", "PLIKTIG"]),
  barn: z.array(BarnSkjemaSchema),
  deg: z.object({
    inntekt: z.string(),
  }),
  medforelder: z.object({
    inntekt: z.string(),
  }),
  dittBoforhold: z.object({
    borMedAnnenVoksen: z.enum(["true", "false", ""]),
    borMedAndreBarn: z.enum(["true", "false", ""]),
    antallBarnBorFast: z.string(),
    antallBarnDeltBosted: z.string(),
  }),
  medforelderBoforhold: z.object({
    borMedAnnenVoksen: z.enum(["true", "false", ""]),
    borMedAndreBarn: z.enum(["true", "false", ""]),
    antallBarnBorFast: z.string(),
    antallBarnDeltBosted: z.string(),
  }),
});

export const lagBoforholdSkjema = (språk: Språk) => {
  return z
    .object({
      borMedAnnenVoksen: z
        .enum(["true", "false", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      borMedAndreBarn: z
        .enum(["true", "false", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      antallBarnBorFast: z.string(),
      antallBarnDeltBosted: z.string(),
    })
    .superRefine((values, ctx) => {
      if (values.borMedAndreBarn && values.antallBarnBorFast.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast.påkrevd,
          ),
          path: ["antallBarnBorFast"],
        });
      }

      if (values.borMedAndreBarn && values.antallBarnDeltBosted.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
              .påkrevd,
          ),
          path: ["antallBarnDeltBosted"],
        });
      }
    })
    .transform((values) => {
      return {
        borMedAnnenVoksen: values.borMedAnnenVoksen,
        borMedAndreBarn: values.borMedAndreBarn,
        antallBarnBorFast: Number(values.antallBarnBorFast.trim() || 0),
        antallBarnDeltBosted: Number(values.antallBarnDeltBosted.trim() || 0),
      };
    })
    .superRefine((values, ctx) => {
      if (isNaN(values.antallBarnBorFast)) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast.tall,
          ),
          path: ["antallBarnBorFast"],
        });
      } else if (values.antallBarnBorFast < 0) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast.minimum,
          ),
          path: ["antallBarnBorFast"],
        });
      }

      if (isNaN(values.antallBarnDeltBosted)) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted.tall,
          ),
          path: ["antallBarnDeltBosted"],
        });
      } else if (values.antallBarnDeltBosted < 0) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
              .minimum,
          ),
          path: ["antallBarnDeltBosted"],
        });
      }
    });
};

export const lagInntektSkjema = (språk: Språk) => {
  return z.object({
    inntekt: z
      .string()
      .refine((verdi) => verdi.trim() !== "", {
        message: oversett(språk, tekster.feilmeldinger.inntekt.påkrevd),
      })
      .transform((verdi) => Number(verdi.trim()))
      .refine((verdi) => verdi >= 0, {
        message: oversett(språk, tekster.feilmeldinger.inntekt.positivt),
      })
      .refine((verdi) => Number.isInteger(verdi), {
        message: oversett(språk, tekster.feilmeldinger.inntekt.heleKroner),
      }),
  });
};

export const lagBarnSkjema = (språk: Språk) => {
  return z
    .object({
      alder: z
        .string()
        .refine((verdi) => verdi.trim() !== "", {
          message: oversett(språk, tekster.feilmeldinger.barn.alder.påkrevd),
        })
        .transform((verdi) => Number(verdi.trim()))
        .refine((verdi) => !isNaN(verdi), {
          message: oversett(språk, tekster.feilmeldinger.barn.alder.tall),
        })
        .refine((verdi) => Number.isInteger(verdi), {
          message: oversett(språk, tekster.feilmeldinger.barn.alder.heltall),
        })
        .refine((verdi) => verdi >= 0, {
          message: oversett(språk, tekster.feilmeldinger.barn.alder.minimum),
        })
        .refine((verdi) => verdi <= 25, {
          message: oversett(språk, tekster.feilmeldinger.barn.alder.maksimum),
        }),
      bosted: z.enum(FastBostedSchema.options, {
        message: oversett(språk, tekster.feilmeldinger.bostatus.påkrevd),
      }),
      samvær: z
        .string()
        .refine((verdi) => verdi.trim() !== "", {
          message: oversett(språk, tekster.feilmeldinger.samvær.påkrevd),
        })
        .transform((verdi) => Number(verdi.trim()))
        .refine((verdi) => verdi >= 0, {
          message: oversett(språk, tekster.feilmeldinger.samvær.minimum),
        })
        .refine((verdi) => verdi <= 30, {
          message: oversett(språk, tekster.feilmeldinger.samvær.maksimum),
        }),
      barnetilsynsutgift: z.string(),
    })
    .superRefine((data, ctx) => {
      if (
        data.alder <= MAKS_ALDER_BARNETILSYNSUTGIFT &&
        data.barnetilsynsutgift.trim() === ""
      ) {
        ctx.addIssue({
          path: ["barnetilsynsutgift"],
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barnetilsynsutgift.påkrevd,
          ),
        });
      }
    })
    .transform((values) => ({
      ...values,
      barnetilsynsutgift: Number(values.barnetilsynsutgift.trim()),
    }))
    .superRefine((data, ctx) => {
      if (data.barnetilsynsutgift < 0) {
        ctx.addIssue({
          path: ["barnetilsynsutgift"],
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barnetilsynsutgift.minimum,
          ),
        });
      }

      if (data.barnetilsynsutgift > 10000) {
        ctx.addIssue({
          path: ["barnetilsynsutgift"],
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barnetilsynsutgift.maksimum,
          ),
        });
      }
    });
};

export const lagBarnebidragSkjema = (språk: Språk) => {
  return z
    .object({
      bidragstype: z.enum(["", "MOTTAKER", "PLIKTIG"]),
      barn: z
        .array(lagBarnSkjema(språk))
        .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
        .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
      deg: lagInntektSkjema(språk),
      medforelder: lagInntektSkjema(språk),
      dittBoforhold: lagBoforholdSkjema(språk),
      medforelderBoforhold: lagBoforholdSkjema(språk),
    })
    .superRefine((data, ctx) => {
      const { bidragstype, dittBoforhold, medforelderBoforhold } = data;
      console.log("🚀 ~ lagBarnebidragSkjema ~ bidragstype:", bidragstype);

      if (bidragstype === "MOTTAKER") {
        if (medforelderBoforhold.borMedAnnenVoksen === undefined) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "borMedAnnenVoksen"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAnnenVoksen
                .påkrevd,
            ),
          });
        }

        if (medforelderBoforhold.borMedAndreBarn === undefined) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "borMedAndreBarn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAndreBarn.påkrevd,
            ),
          });
        }
      }

      if (bidragstype === "PLIKTIG") {
        if (dittBoforhold.borMedAnnenVoksen === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "borMedAnnenVoksen"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAnnenVoksen
                .påkrevd,
            ),
          });
        }

        if (dittBoforhold.borMedAndreBarn === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "borMedAndreBarn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAndreBarn.påkrevd,
            ),
          });
        }
      }
      if (bidragstype === "") {
        console.log(
          "🚀 ~ lagBarnebidragSkjema ~ medforelderBoforhold:",
          medforelderBoforhold,
        );
        if (medforelderBoforhold.borMedAnnenVoksen === undefined) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "borMedAnnenVoksen"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAnnenVoksen
                .påkrevd,
            ),
          });
        }

        if (medforelderBoforhold.borMedAndreBarn === undefined) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "borMedAndreBarn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAndreBarn.påkrevd,
            ),
          });
        }

        if (dittBoforhold.borMedAnnenVoksen === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "borMedAnnenVoksen"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAnnenVoksen
                .påkrevd,
            ),
          });
        }

        if (dittBoforhold.borMedAndreBarn === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "borMedAndreBarn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.borMedAndreBarn.påkrevd,
            ),
          });
        }
      }
    });
};

export type BarnebidragSkjema = z.infer<typeof BarnebidragSkjemaSchema>;
export type BarnebidragSkjemaValidert = z.infer<
  ReturnType<typeof lagBarnebidragSkjema>
>;

const tekster = definerTekster({
  feilmeldinger: {
    motpartIdent: {
      påkrevd: {
        nb: "Velg den andre forelderen",
        en: "Choose the other parent",
        nn: "Vel den andre forelderen",
      },
      ugyldig: {
        nb: "Ugyldig verdi",
        en: "Invalid value",
        nn: "Ugyldig verdi",
      },
    },
    barnIdent: {
      ugyldig: {
        nb: "Ugyldig verdi",
        en: "Invalid value",
        nn: "Ugyldig verdi",
      },
    },
    samvær: {
      påkrevd: {
        nb: "Fyll inn samværsgrad",
        en: "Fill in visitation degree",
        nn: "Fyll inn samværsgrad",
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
        nn: "Barnet kan ikkje ha færrast netter hos deg når barnet bur hos deg.",
      },
      maksimumHosForelder2: {
        nb: "Barnet kan ikke ha flest netter hos deg når barnet bor hos den andre forelderen.",
        en: "The child cannot spend most nights with you when the child lives with the other parent.",
        nn: "Barnet kan ikkje ha flest netter hos deg når barnet bur hos den andre forelderen.",
      },
    },
    barnetilsynsutgift: {
      påkrevd: {
        nb: "Fyll inn kostnader til barnepass",
        en: "Fill in costs for child care",
        nn: "Fyll inn kostnadar til barnepass",
      },
      minimum: {
        nb: "Kostnader til barnepass må være minst 0",
        en: "Costs for child care must be at least 0",
        nn: "Kostnader til barnepass må vere minst 0",
      },
      maksimum: {
        nb: "Kostnader for barnepass kan ikke være mer enn 10 000 kr",
        en: "Costs for child care cannot exceed 10,000 NOK",
        nn: "Kostnader for barnepass kan ikkje vere meir enn 10 000 kr",
      },
    },
    bostatus: {
      påkrevd: {
        nb: "Fyll inn hvor barnet bor",
        en: "Fill in where the child lives",
        nn: "Fyll inn kvar barnet bur",
      },
    },
    barn: {
      alder: {
        påkrevd: {
          nb: "Fyll inn alder",
          en: "Fill in age",
          nn: "Fyll inn alder",
        },
        minimum: {
          nb: "Barnet må være minst 0 år",
          en: "The child must be at least 0 years old",
          nn: "Barnet må vere minst 0 år",
        },
        maksimum: {
          nb: "Barnet kan ikke være eldre enn 25 år",
          en: "The child cannot be older than 25 years",
          nn: "Barnet kan ikkje vere eldre enn 25 år",
        },
        tall: {
          nb: "Alder må være et tall",
          en: "Age must be a number",
          nn: "Alder må vere eit tal",
        },
        heltall: {
          nb: "Alder må være et heltall",
          en: "Age must be a whole number",
          nn: "Alder må vere eit heiltal",
        },
      },
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
        nb: "Fyll inn inntekt",
        en: "Fill in income",
        nn: "Fyll inn inntekt",
      },
      positivt: {
        nb: "Inntekt må være et positivt tall",
        en: "Income must be a positive number",
        nn: "Inntekt må vere eit positivt tal",
      },
      heleKroner: {
        nb: "Fyll inn inntekt i hele kroner",
        en: "Fill in income in whole kroner",
        nn: "Fyll inn inntekt i heile kroner",
      },
    },
    husstandsmedlemmer: {
      antallBarnBorFast: {
        påkrevd: {
          nb: "Fyll inn antall barn",
          en: "Fill in the number of children",
          nn: "Fyll inn antal barn",
        },
        tall: {
          nb: "Antall barn må være et tall",
          en: "Number of children must be a number",
          nn: "Antal barn må vere eit tal",
        },
        minimum: {
          nb: "Fyll inn et positivt antall",
          en: "Fill in a positive number",
          nn: "Fyll inn eit positivt tal",
        },
      },
      antallBarnDeltBosted: {
        påkrevd: {
          nb: "Fyll inn antall barn",
          en: "Fill in the number of children",
          nn: "Fyll inn antal barn",
        },
        tall: {
          nb: "Antall barn må være et tall",
          en: "Number of children must be a number",
          nn: "Antal barn må vere eit tal",
        },
        minimum: {
          nb: "Fyll inn et positivt antall",
          en: "Fill in a positive number",
          nn: "Fyll inn eit positivt tal",
        },
      },
      borMedAnnenVoksen: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      borMedAndreBarn: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
    },
  },
});
