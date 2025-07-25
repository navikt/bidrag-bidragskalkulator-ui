import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const FastBosted = z.enum([
  "DELT_FAST_BOSTED",
  "HOS_MEG",
  "HOS_MEDFORELDER",
]);

export const InnloggetBarnSkjemaSchema = z.object({
  ident: z.string().length(11),
  bosted: z.enum([...FastBosted.options, ""]),
  samvær: z.string(),
  barnetilsynsutgift: z.string(),
});

export const InnloggetSkjemaSchema = z.object({
  motpartIdent: z.string().length(11),
  barn: z.array(InnloggetBarnSkjemaSchema),
  deg: z.object({
    inntekt: z.string(),
    antallBarnBorFast: z.string(),
    antallBarnDeltBosted: z.string(),
    borMedAnnenVoksen: z.enum(["true", "false", ""]),
  }),
  medforelder: z.object({
    inntekt: z.string(),
    antallBarnBorFast: z.string(),
    antallBarnDeltBosted: z.string(),
    borMedAnnenVoksen: z.enum(["true", "false", ""]),
  }),
});

export const ManueltBarnSkjemaSchema = z.object({
  navn: z.string(),
  alder: z.string(),
  bosted: z.enum([...FastBosted.options, ""]),
  samvær: z.string(),
  barnetilsynsutgift: z.string(),
});

export const ManueltSkjemaSchema = z.object({
  barn: z.array(ManueltBarnSkjemaSchema),
  deg: z.object({
    navn: z.string(),
    inntekt: z.string(),
    antallBarnBorFast: z.string(),
    antallBarnDeltBosted: z.string(),
    borMedAnnenVoksen: z.enum(["true", "false", ""]),
  }),
  medforelder: z.object({
    navn: z.string(),
    inntekt: z.string(),
    antallBarnBorFast: z.string(),
    antallBarnDeltBosted: z.string(),
    borMedAnnenVoksen: z.enum(["true", "false", ""]),
  }),
});

export const lagInnloggetBarnSkjema = (språk: Språk) => {
  return z.object({
    ident: z
      .string()
      .length(11, oversett(språk, tekster.feilmeldinger.barnIdent.ugyldig)),
    bosted: z.enum(FastBosted.options, {
      message: oversett(språk, tekster.feilmeldinger.bostatus.påkrevd),
    }),
    samvær: z.preprocess(
      (input) => {
        if (typeof input === "string" && input.trim() === "") {
          return undefined;
        }
        const tall = Number(input);
        return isNaN(tall) ? undefined : tall;
      },
      z
        .number()
        .min(0, oversett(språk, tekster.feilmeldinger.samvær.minimum))
        .max(30, oversett(språk, tekster.feilmeldinger.samvær.maksimum))
        .refine((val) => val !== undefined, {
          message: oversett(språk, tekster.feilmeldinger.samvær.påkrevd),
        }),
    ),
    barnetilsynsutgift: lagBarnetilsynsutgiftSchema(språk),
  });
};

export const lagForelderSkjema = (
  språk: Språk,
  rolle: "deg" | "medforelder",
) => {
  return z.object({
    navn: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger[rolle].navn.påkrevd)),
    inntekt: z.preprocess(
      (input) => {
        if (typeof input === "string" && input.trim() === "") {
          return undefined;
        }
        const tall = Number(input);
        return isNaN(tall) ? undefined : tall;
      },
      z
        .union([
          z
            .number()
            .min(0, {
              message: oversett(språk, tekster.feilmeldinger.inntekt.positivt),
            })
            .multipleOf(1, {
              message: oversett(
                språk,
                tekster.feilmeldinger.inntekt.heleKroner,
              ),
            }),
          z.undefined(),
        ])
        .refine((val) => val !== undefined, {
          message: oversett(språk, tekster.feilmeldinger.inntekt.påkrevd),
        }),
    ),
    antallBarnBorFast: z.preprocess(
      (input) => {
        if (typeof input === "string") {
          const trimmed = input.trim();
          if (trimmed === "") {
            return undefined;
          }

          const parsed = Number(trimmed);
          return isNaN(parsed) ? NaN : parsed;
        }
        return input;
      },
      z
        .union([
          z
            .number()
            .refine((verdi) => !isNaN(verdi), {
              message: oversett(
                språk,
                tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast.tall,
              ),
            })
            .min(0, {
              message: oversett(
                språk,
                tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast
                  .minimum,
              ),
            }),
          z.undefined(), // Lar deg fange "tomt felt" med egen melding
        ])
        .refine((verdi) => verdi !== undefined, {
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast.påkrevd,
          ),
        }),
    ),
    antallBarnDeltBosted: z.preprocess(
      (input) => {
        if (typeof input === "string") {
          const trimmed = input.trim();
          if (trimmed === "") return undefined;
          const parsed = Number(trimmed);
          return isNaN(parsed) ? NaN : parsed;
        }
        return input;
      },
      z
        .union([
          z
            .number()
            .refine((verdi) => !isNaN(verdi), {
              message: oversett(
                språk,
                tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
                  .tall,
              ),
            })
            .min(0, {
              message: oversett(
                språk,
                tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
                  .minimum,
              ),
            }),
          z.undefined(),
        ])
        .refine((verdi) => verdi !== undefined, {
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
              .påkrevd,
          ),
        }),
    ),
    borMedAnnenVoksen: z
      .enum(["true", "false"], {
        message: oversett(
          språk,
          tekster.feilmeldinger.husstandsmedlemmer.borMedAnnenVoksen.påkrevd,
        ),
      })
      .transform((value) => value === "true"),
  });
};

export const lagInnloggetSkjema = (språk: Språk) => {
  return z.object({
    motpartIdent: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.motpartIdent.påkrevd))
      .length(11, oversett(språk, tekster.feilmeldinger.motpartIdent.ugyldig)),
    barn: z
      .array(lagInnloggetBarnSkjema(språk))
      .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
      .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
    deg: lagForelderSkjema(språk, "deg"),
    medforelder: lagForelderSkjema(språk, "medforelder"),
  });
};

export const lagManueltBarnSkjema = (språk: Språk) => {
  return z.object({
    navn: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.barn.navn.påkrevd)),
    alder: z
      .preprocess(
        (input) => {
          if (typeof input === "string") {
            const trimmed = input.trim();
            if (trimmed === "") return undefined;
            const parsed = Number(trimmed);
            return isNaN(parsed) ? NaN : parsed;
          }
          return input;
        },
        z
          .union([
            z
              .number()
              .refine((verdi) => !isNaN(verdi), {
                message: oversett(språk, tekster.feilmeldinger.barn.alder.tall),
              })
              .min(0, {
                message: oversett(
                  språk,
                  tekster.feilmeldinger.barn.alder.minimum,
                ),
              })
              .max(25, {
                message: oversett(
                  språk,
                  tekster.feilmeldinger.barn.alder.maksimum,
                ),
              }),
            z.undefined(),
          ])
          .refine((verdi) => Number.isInteger(verdi), {
            message: oversett(språk, tekster.feilmeldinger.barn.alder.heltall),
          }),
      )
      .refine((verdi) => verdi !== undefined, {
        message: oversett(språk, tekster.feilmeldinger.barn.alder.påkrevd),
      }),
    bosted: z.enum(FastBosted.options, {
      message: oversett(språk, tekster.feilmeldinger.bostatus.påkrevd),
    }),
    samvær: z
      .preprocess(
        (input) => {
          if (typeof input === "string") {
            const trimmed = input.trim();
            if (trimmed === "") return undefined;
            const parsed = Number(trimmed);
            return isNaN(parsed) ? NaN : parsed;
          }
          return input;
        },
        z
          .number()
          .min(0, {
            message: oversett(språk, tekster.feilmeldinger.samvær.minimum),
          })
          .max(30, {
            message: oversett(språk, tekster.feilmeldinger.samvær.maksimum),
          }),
      )
      .refine((verdi) => verdi !== undefined, {
        message: oversett(språk, tekster.feilmeldinger.samvær.påkrevd),
      }),
    barnetilsynsutgift: lagBarnetilsynsutgiftSchema(språk),
  });
};

const lagBarnetilsynsutgiftSchema = (språk: Språk) =>
  z
    .preprocess(
      (input) => {
        if (typeof input === "string") {
          const trimmed = input.trim();
          if (trimmed === "") {
            return undefined;
          }

          const parsed = Number(trimmed);
          return isNaN(parsed) ? NaN : parsed;
        }
        return input;
      },
      z.union([
        z
          .number()
          .min(0, {
            message: oversett(
              språk,
              tekster.feilmeldinger.barnetilsynsutgift.minimum,
            ),
          })
          .max(10000, {
            message: oversett(
              språk,
              tekster.feilmeldinger.barnetilsynsutgift.maksimum,
            ),
          }),
        z.undefined(),
      ]),
    )
    .refine((verdi) => verdi !== undefined, {
      message: oversett(
        språk,
        tekster.feilmeldinger.barnetilsynsutgift.påkrevd,
      ),
    });

export const lagManueltSkjema = (språk: Språk) => {
  return z.object({
    barn: z
      .array(lagManueltBarnSkjema(språk))
      .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
      .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
    deg: lagForelderSkjema(språk, "deg"),
    medforelder: lagForelderSkjema(språk, "medforelder"),
  });
};

export type InnloggetBarnSkjema = z.infer<typeof InnloggetBarnSkjemaSchema>;
export type InnloggetSkjema = z.infer<typeof InnloggetSkjemaSchema>;
export type InnloggetSkjemaValidert = z.infer<
  ReturnType<typeof lagInnloggetSkjema>
>;
export type ManueltBarnSkjema = z.infer<typeof ManueltBarnSkjemaSchema>;
export type ManueltSkjema = z.infer<typeof ManueltSkjemaSchema>;
export type ManueltSkjemaValidert = z.infer<
  ReturnType<typeof lagManueltSkjema>
>;

const tekster = definerTekster({
  feilmeldinger: {
    deg: {
      navn: {
        påkrevd: {
          nb: "Fyll ut ditt navn",
          en: "Fill in your name",
          nn: "Fyll ut ditt namn",
        },
      },
    },
    medforelder: {
      navn: {
        påkrevd: {
          nb: "Fyll ut den andre forelderens navn",
          en: "Fill in the other parent's name",
          nn: "Fyll ut den andre forelderens namn",
        },
      },
    },
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
        nb: "Fyll ut kostnader til barnepass",
        en: "Fill in costs for child care",
        nn: "Fyll ut kostnader til barnepass",
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
        nb: "Fyll ut hvor barnet bor",
        en: "Fill in where the child lives",
        nn: "Fyll ut kvar barnet bur",
      },
    },
    barn: {
      navn: {
        påkrevd: {
          nb: "Fyll ut barnets navn",
          en: "Fill in the child's name",
          nn: "Fyll ut barnets namn",
        },
      },
      alder: {
        påkrevd: {
          nb: "Fyll ut alder",
          en: "Fill in age",
          nn: "Fyll ut alder",
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
    husstandsmedlemmer: {
      antallBarnBorFast: {
        påkrevd: {
          nb: "Fyll ut antall barn ",
          en: "Fill in the number of children ",
          nn: "Fyll ut talet på barn ",
        },
        tall: {
          nb: "Antall barn må være et tall",
          en: "Number of children must be a number",
          nn: "Antall barn må vere eit tal",
        },
        minimum: {
          nb: "Fyll ut et positivt antall",
          en: "Fill in a positive number",
          nn: "Fyll ut eit positivt tal",
        },
      },
      antallBarnDeltBosted: {
        påkrevd: {
          nb: "Fyll ut antall barn",
          en: "Fill in the number of children",
          nn: "Fyll ut talet på barn",
        },
        tall: {
          nb: "Antall barn må være et tall",
          en: "Number of children must be a number",
          nn: "Antall barn må vere eit tal",
        },
        minimum: {
          nb: "Fyll ut et positivt antall",
          en: "Fill in a positive number",
          nn: "Fyll ut eit positivt tal",
        },
      },
      borMedAnnenVoksen: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
    },
  },
});
