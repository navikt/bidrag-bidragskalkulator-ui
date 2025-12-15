import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const MAKS_ALDER_BARNETILSYNSUTGIFT = 10;
export const MAKS_ALDER_BARN_EGEN_INNTEKT = 13;
export const MAKS_ALDER_SMÅBARNSTILLEGG = 3;
export const MAKS_ALDER_UTVIDET_BARNETRYGD = 18;
export const MAKS_ALDER_KONTANTSTØTTE = 2;
export const MIN_ALDER_KONTANTSTØTTE = 1;
export const MAKS_ALDER_BARNETILLEGG = 18;

export type Bidragstype = "MOTTAKER" | "PLIKTIG";

export const FastBostedSchema = z.enum([
  "DELT_FAST_BOSTED",
  "HOS_MEG",
  "HOS_MEDFORELDER",
]);

export const BorMedAnnenVoksenTypeSchema = z.enum([
  "SAMBOER_ELLER_EKTEFELLE",
  "EGNE_BARN_OVER_18",
]);

export const BarnepassSituasjonSchema = z.enum(["HELTID", "DELTID"]);
export const HvemFårBarnetilleggSchema = z.enum(["MEG", "DEN_ANDRE_FORELDREN"]);

const BarnSkjemaSchema = z.object({
  alder: z.string(),
  bosted: z.enum([...FastBostedSchema.options, ""]),
  samvær: z.string(),
  harBarnetilsynsutgift: z.enum(["true", "false", ""]),
  mottarStønadTilBarnetilsyn: z.enum(["true", "false", ""]),
  barnetilsynsutgift: z.string(),
  barnepassSituasjon: BarnepassSituasjonSchema.or(z.literal("")),
  inntektPerMåned: z.string(),
});

const BarnebidragSkjemaSchema = z.object({
  bidragstype: z.enum(["", "MOTTAKER", "PLIKTIG", "BEGGE"]),
  barn: z.array(BarnSkjemaSchema),
  deg: z.object({
    inntekt: z.string(),
    kapitalinntekt: z.string(),
  }),
  medforelder: z.object({
    inntekt: z.string(),
    kapitalinntekt: z.string(),
  }),
  inntekt: z.object({
    kapitalinntektOver10k: z.enum(["true", ""]),
    barnHarEgenInntekt: z.enum(["true", "false", ""]),
  }),
  dittBoforhold: z.object({
    borMedAnnenVoksen: z.enum(["true", "false", "", "undefined"]),
    borMedAndreBarn: z.enum(["true", "false", "", "undefined"]),
    betalerBarnebidrageForAndreBarn: z.enum(["true", "false", "", "undefined"]),
    antallBarnBorFast: z.string(),
    // antallBarnDeltBosted: z.string(),
    borMedAnnenVoksenType: BorMedAnnenVoksenTypeSchema.or(z.literal("")),
    borMedBarnOver18: z.enum(["true", "false", "", "undefined"]),
    antallBarnOver18: z.string(),
    andreBarnebidragerPerMåned: z.string(),
  }),
  medforelderBoforhold: z.object({
    borMedAnnenVoksen: z.enum(["true", "false", "", "undefined"]),
    borMedAndreBarn: z.enum(["true", "false", "", "undefined"]),
    betalerBarnebidrageForAndreBarn: z.enum(["true", "false", "", "undefined"]),
    antallBarnBorFast: z.string(),
    // antallBarnDeltBosted: z.string(),
    borMedAnnenVoksenType: BorMedAnnenVoksenTypeSchema.or(z.literal("")),
    borMedBarnOver18: z.enum(["true", "false", "", "undefined"]),
    antallBarnOver18: z.string(),
    andreBarnebidragerPerMåned: z.string(),
  }),
  andreBarnUnder12: z.object({
    antall: z.string(),
    tilsynsutgifter: z.array(z.string()),
  }),
  ytelser: z.object({
    kontantstøtte: z.object({
      mottar: z.enum(["true", ""]),
      beløp: z.string(),
      deler: z.enum(["true", "false", ""]),
    }),
    mottarUtvidetBarnetrygd: z.enum(["true", ""]),
    delerUtvidetBarnetrygd: z.enum(["true", "false", ""]),
    mottarSmåbarnstillegg: z.enum(["true", ""]),
  }),
});

export const lagYtelserSkjema = (språk: Språk) => {
  return z
    .object({
      kontantstøtte: z.object({
        mottar: z
          .enum(["true", ""])
          .transform((value) => (value === "" ? undefined : value === "true")),
        beløp: z.string(),
        deler: z
          .enum(["true", "false", ""])
          .transform((value) => (value === "" ? undefined : value === "true")),
      }),
      mottarUtvidetBarnetrygd: z
        .enum(["true", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      delerUtvidetBarnetrygd: z
        .enum(["true", "false", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      mottarSmåbarnstillegg: z
        .enum(["true", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
    })
    .superRefine((values, ctx) => {
      // Kontantstøtte: Når mottar er true, må beløp fylles ut hvis:
      // 1. Barn ikke har delt bosted (deler-spørsmål stilles aldri), ELLER
      // 2. Barn har delt bosted OG de deler kontantstøtten
      if (values.kontantstøtte.mottar === undefined) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.kontantstøtte.mottar.påkrevd,
          ),
          path: ["kontantstøtte", "mottar"],
        });
      }

      if (
        values.kontantstøtte.mottar === true &&
        values.kontantstøtte.beløp.trim() === "" &&
        values.kontantstøtte.deler !== false // Beløp kreves hvis de ikke har svart "nei" på deling
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.kontantstøtte.beløp.påkrevd,
          ),
          path: ["kontantstøtte", "beløp"],
        });
      }

      // Utvidet barnetrygd
      if (values.mottarUtvidetBarnetrygd === undefined) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.utvidetBarnetrygd.mottar.påkrevd,
          ),
          path: ["mottarUtvidetBarnetrygd"],
        });
      }

      if (
        values.mottarUtvidetBarnetrygd &&
        values.delerUtvidetBarnetrygd === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.utvidetBarnetrygd.påkrevd,
          ),
          path: ["delerUtvidetBarnetrygd"],
        });
      }

      // Småbarnstillegg
      if (values.mottarSmåbarnstillegg === undefined) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.småbarnstillegg.påkrevd,
          ),
          path: ["mottarSmåbarnstillegg"],
        });
      }
    })
    .transform((values) => {
      return {
        ...values,
        kontantstøtte: {
          ...values.kontantstøtte,
          beløp: Number(values.kontantstøtte.beløp.trim() ?? 0),
        },
      };
    })
    .superRefine((values, ctx) => {
      if (values.kontantstøtte.beløp && isNaN(values.kontantstøtte.beløp)) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.kontantstøtte.beløp.tall,
          ),
          path: ["kontantstøtte", "beløp"],
        });
      }

      if (values.kontantstøtte.beløp && values.kontantstøtte.beløp < 0) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.kontantstøtte.beløp.minimum,
          ),
          path: ["kontantstøtte", "beløp"],
        });
      }

      if (values.kontantstøtte.beløp && values.kontantstøtte.beløp > 10000) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.kontantstøtte.beløp.maksimum,
          ),
          path: ["kontantstøtte", "beløp"],
        });
      }
    });
};

export const lagAndreBarnUnder12Skjema = (språk: Språk) => {
  return z
    .object({
      antall: z.string(),
      tilsynsutgifter: z.array(z.string()).catch([]),
    })
    .transform((values) => {
      const antall = Number(values.antall.trim() || 0);

      const tilsynsutgifter = values.tilsynsutgifter.map((utgift) =>
        utgift === "" ? undefined : Number(utgift.trim()),
      );

      return {
        antall,
        tilsynsutgifter,
      };
    })
    .superRefine((values, ctx) => {
      if (values.antall < 0) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.andreBarnUnder12.antall.minimum,
          ),
          path: ["antall"],
        });
      }

      if (values.antall > 10) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.andreBarnUnder12.antall.maksimum,
          ),
          path: ["antall"],
        });
      }

      if (values.antall > 0 && values.tilsynsutgifter) {
        values.tilsynsutgifter.forEach((utgift, index) => {
          if (utgift && utgift < 0) {
            ctx.addIssue({
              code: "custom",
              message: oversett(
                språk,
                tekster.feilmeldinger.andreBarnUnder12.tilsynsutgift.minimum,
              ),
              path: ["tilsynsutgifter", index],
            });
          }

          if (utgift && utgift > 10000) {
            ctx.addIssue({
              code: "custom",
              message: oversett(
                språk,
                tekster.feilmeldinger.andreBarnUnder12.tilsynsutgift.maksimum,
              ),
              path: ["tilsynsutgifter", index],
            });
          }
        });
      }
    });
};

export const lagBoforholdSkjema = (språk: Språk) => {
  return z
    .object({
      borMedAnnenVoksen: z
        .enum(["true", "false", "", "undefined"])
        .transform((value) =>
          value === "" || value === "undefined" ? undefined : value === "true",
        ),
      borMedAndreBarn: z
        .enum(["true", "false", "", "undefined"])
        .transform((value) =>
          value === "" || value === "undefined" ? undefined : value === "true",
        ),
      betalerBarnebidrageForAndreBarn: z
        .enum(["true", "false", "", "undefined"])
        .transform((value) =>
          value === "" || value === "undefined" ? undefined : value === "true",
        ),
      antallBarnBorFast: z.string(),
      // antallBarnDeltBosted: z.string(),
      borMedAnnenVoksenType: BorMedAnnenVoksenTypeSchema.or(z.literal("")),
      borMedBarnOver18: z
        .enum(["true", "false", "", "undefined"])
        .transform((value) =>
          value === "" || value === "undefined" ? undefined : value === "true",
        ),
      antallBarnOver18: z.string(),
      andreBarnebidragerPerMåned: z.string(),
    })
    .superRefine((values, ctx) => {
      if (
        values.borMedAndreBarn === true &&
        values.antallBarnBorFast.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnBorFast.påkrevd,
          ),
          path: ["antallBarnBorFast"],
        });
      }

      if (
        values.borMedAnnenVoksen === true &&
        values.borMedAnnenVoksenType.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.borMedAnnenVoksenType
              .påkrevd,
          ),
          path: ["borMedAnnenVoksenType"],
        });
      }

      if (
        values.borMedAnnenVoksenType === "EGNE_BARN_OVER_18" &&
        values.borMedBarnOver18 === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.borMedBarnOver18.påkrevd,
          ),
          path: ["borMedBarnOver18"],
        });
      }

      if (
        values.borMedBarnOver18 === true &&
        values.antallBarnOver18.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnOver18.påkrevd,
          ),
          path: ["antallBarnOver18"],
        });
      }

      if (
        values.betalerBarnebidrageForAndreBarn === true &&
        values.andreBarnebidragerPerMåned.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.andreBarnebidragerPerMåned
              .påkrevd,
          ),
          path: ["andreBarnebidragerPerMåned"],
        });
      }

      // if (values.borMedAndreBarn && values.antallBarnDeltBosted.trim() === "") {
      //   ctx.addIssue({
      //     code: "custom",
      //     message: oversett(
      //       språk,
      //       tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
      //         .påkrevd,
      //     ),
      //     path: ["antallBarnDeltBosted"],
      //   });
      // }
    })
    .transform((values) => {
      return {
        ...values,
        anantallBarnOver18: Number(values.antallBarnOver18.trim() || 0),
        antallBarnBorFast: Number(values.antallBarnBorFast.trim() || 0),
        andreBarnebidragerPerMåned: Number(
          values.andreBarnebidragerPerMåned.trim() || 0,
        ),
        // antallBarnDeltBosted: Number(values.antallBarnDeltBosted.trim() || 0),
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

      // if (isNaN(values.antallBarnDeltBosted)) {
      //   ctx.addIssue({
      //     code: "custom",
      //     message: oversett(
      //       språk,
      //       tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted.tall,
      //     ),
      //     path: ["antallBarnDeltBosted"],
      //   });
      // } else if (values.antallBarnDeltBosted < 0) {
      //   ctx.addIssue({
      //     code: "custom",
      //     message: oversett(
      //       språk,
      //       tekster.feilmeldinger.husstandsmedlemmer.antallBarnDeltBosted
      //         .minimum,
      //     ),
      //     path: ["antallBarnDeltBosted"],
      //   });
      // }
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
    kapitalinntekt: z
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

export const lagKapitalinntektSkjema = (språk: Språk) => {
  return z
    .object({
      kapitalinntektOver10k: z
        .enum(["true", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      barnHarEgenInntekt: z
        .enum(["true", "false", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
    })
    .superRefine((values, ctx) => {
      if (values.kapitalinntektOver10k === undefined) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.inntekt.kapitalinntektOver10k.påkrevd,
          ),
          path: ["kapitalinntektOver10k"],
        });
      }

      if (values.barnHarEgenInntekt === undefined) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barn.egenInntekt.påkrevd,
          ),
          path: ["barnHarEgenInntekt"],
        });
      }
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
      // barnepass:
      harBarnetilsynsutgift: z
        .enum(["true", "false", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      mottarStønadTilBarnetilsyn: z
        .enum(["true", "false", ""])
        .transform((value) => (value === "" ? undefined : value === "true")),
      barnetilsynsutgift: z.string(),
      barnepassSituasjon: BarnepassSituasjonSchema.or(z.literal("")),
      inntektPerMåned: z.string(),
    })
    .superRefine((data, ctx) => {
      // Barnepass
      if (data.alder <= MAKS_ALDER_BARNETILSYNSUTGIFT) {
        if (data.harBarnetilsynsutgift === undefined) {
          ctx.addIssue({
            path: ["harBarnetilsynsutgift"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.barnepass.utgifter.påkrevd,
            ),
          });
        }

        if (
          data.harBarnetilsynsutgift === true &&
          data.mottarStønadTilBarnetilsyn === undefined
        ) {
          ctx.addIssue({
            path: ["mottarStønadTilBarnetilsyn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.barnepass.utgifter.påkrevd,
            ),
          });
        }

        if (
          data.mottarStønadTilBarnetilsyn &&
          data.barnepassSituasjon.trim() === ""
        ) {
          ctx.addIssue({
            path: ["barnepassSituasjon"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.barnepass.utgifter.påkrevd,
            ),
          });
        }

        if (
          data.mottarStønadTilBarnetilsyn === false &&
          data.barnetilsynsutgift.trim() === ""
        ) {
          ctx.addIssue({
            path: ["barnetilsynsutgift"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.barnepass.utgifter.beløp.påkrevd,
            ),
          });
        }
      }

      if (data.inntektPerMåned.trim() === "") {
        ctx.addIssue({
          path: ["inntektPerMåned"],
          code: "custom",
          message: oversett(språk, tekster.feilmeldinger.inntekt.beløp.påkrevd),
        });
      }
    })
    .transform((values) => ({
      ...values,
      barnetilsynsutgift: Number(values.barnetilsynsutgift.trim()),
      harEgenInntekt: Number(values.inntektPerMåned.trim()),
    }))
    .superRefine((data, ctx) => {
      if (data.barnetilsynsutgift < 0) {
        ctx.addIssue({
          path: ["barnetilsynsutgift"],
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barnepass.utgifter.beløp.minimum,
          ),
        });
      }

      if (data.barnetilsynsutgift > 10000) {
        ctx.addIssue({
          path: ["barnetilsynsutgift"],
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barnepass.utgifter.beløp.maksimum,
          ),
        });
      }
    });
};

export const lagBarnebidragSkjema = (språk: Språk) => {
  return z
    .object({
      bidragstype: z.enum(["MOTTAKER", "PLIKTIG", "BEGGE"]),
      barn: z
        .array(lagBarnSkjema(språk))
        .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
        .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
      deg: lagInntektSkjema(språk),
      medforelder: lagInntektSkjema(språk),
      inntekt: lagKapitalinntektSkjema(språk),
      dittBoforhold: lagBoforholdSkjema(språk),
      medforelderBoforhold: lagBoforholdSkjema(språk),
      andreBarnUnder12: lagAndreBarnUnder12Skjema(språk),
      ytelser: lagYtelserSkjema(språk),
    })
    .superRefine((data, ctx) => {
      const { bidragstype, dittBoforhold, medforelderBoforhold } = data;

      if (bidragstype === "MOTTAKER" || bidragstype === "BEGGE") {
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

        if (
          medforelderBoforhold.betalerBarnebidrageForAndreBarn === undefined
        ) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "betalerBarnebidrageForAndreBarn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer
                .betalerBarnebidragForAndreBarn.påkrevd,
            ),
          });
        }
      }

      if (bidragstype === "PLIKTIG" || bidragstype === "BEGGE") {
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

        if (dittBoforhold.betalerBarnebidrageForAndreBarn === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "betalerBarnebidrageForAndreBarn"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer
                .betalerBarnebidragForAndreBarn.påkrevd,
            ),
          });
        }
      }

      const erBM = bidragstype === "MOTTAKER" || bidragstype === "BEGGE";
      const harBarnepassutgifter = data.barn.some(
        (b) => b.barnetilsynsutgift >= 0,
      );

      if (erBM && harBarnepassutgifter) {
        if (
          data.andreBarnUnder12.antall > 0 &&
          data.andreBarnUnder12.tilsynsutgifter
        ) {
          for (let i = 0; i < data.andreBarnUnder12.antall; i++) {
            if (data.andreBarnUnder12.tilsynsutgifter[i] === undefined) {
              ctx.addIssue({
                path: ["andreBarnUnder12", "tilsynsutgifter", i],
                code: "custom",
                message: oversett(
                  språk,
                  tekster.feilmeldinger.andreBarnUnder12.tilsynsutgift.påkrevd,
                ),
              });
            }
          }
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
    barnepass: {
      situasjon: {
        påkrevd: {
          nb: "Fyll inn barnepass",
          en: "Fill in child care",
          nn: "Fyll inn barnepass",
        },
      },
      utgifter: {
        påkrevd: {
          nb: "Dette feltet er påkrevd",
          en: "",
          nn: "",
        },
        beløp: {
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
      },
      stønad: {
        påkrevd: {
          nb: "Dette feltet er påkrevd",
          en: "Dette feltet er påkrevd",
          nn: "Dette feltet er påkrevd",
        },
        type: {
          påkrevd: {
            nb: "Dette feltet er påkrevd",
            en: "Dette feltet er påkrevd",
            nn: "Dette feltet er påkrevd",
          },
        },
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
      egenInntekt: {
        påkrevd: {
          nb: "Velg om barnet har egen inntekt",
          en: "Velg om barnet har egen inntekt",
          nn: "Velg om barnet har egen inntekt",
        },
      },
    },
    inntekt: {
      påkrevd: {
        nb: "Dette feltet er påkrevd",
        en: "Fill in income",
        nn: "Fyll inn inntekt",
      },
      beløp: {
        påkrevd: {
          nb: "Fyll inn inntekt",
          en: "Fill in income",
          nn: "Fyll inn inntekt",
        },
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
      kapitalinntektOver10k: {
        påkrevd: {
          nb: "Velg om kapitalinntekt er over 10 000 kroner",
          en: "Select if capital income is over NOK 10,000",
          nn: "Vel om kapitalinntekt er over 10 000 kroner",
        },
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
      betalerBarnebidragForAndreBarn: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      borMedAnnenVoksenType: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      borMedBarnOver18: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      antallBarnOver18: {
        påkrevd: {
          nb: "Fyll inn antall barn",
          en: "Fill in the number of children",
          nn: "Fyll inn antal barn",
        },
      },
      andreBarnebidragerPerMåned: {
        påkrevd: {
          nb: "Fyll inn beløp for barnebidrag",
          en: "Enter child support amount",
          nn: "Fyll inn beløp for barnebidrag",
        },
      },
    },
    andreBarnUnder12: {
      antall: {
        påkrevd: {
          nb: "Fyll inn antall barn",
          en: "Fill in the number of children",
          nn: "Fyll inn antal barn",
        },
        minimum: {
          nb: "Antall barn må være minst 0",
          en: "Number of children must be at least 0",
          nn: "Antal barn må vere minst 0",
        },
        maksimum: {
          nb: "Antall barn kan ikke være mer enn 10",
          en: "Number of children cannot exceed 10",
          nn: "Antal barn kan ikkje vere meir enn 10",
        },
      },
      tilsynsutgift: {
        påkrevd: {
          nb: "Fyll inn tilsynsutgift",
          en: "Fill in childcare cost",
          nn: "Fyll inn tilsynsutgift",
        },
        minimum: {
          nb: "Tilsynsutgift må være minst 0",
          en: "Childcare cost must be at least 0",
          nn: "Tilsynsutgift må vere minst 0",
        },
        maksimum: {
          nb: "Tilsynsutgift kan ikke være mer enn 10 000 kr",
          en: "Childcare cost cannot exceed 10,000 NOK",
          nn: "Tilsynsutgift kan ikkje vere meir enn 10 000 kr",
        },
      },
    },
    ytelser: {
      kontantstøtte: {
        mottar: {
          påkrevd: {
            nb: "Velg om du mottar kontantstøtte",
            en: "Select if you receive cash-for-care benefit",
            nn: "Vel om du mottar kontantstøtte",
          },
        },
        beløp: {
          påkrevd: {
            nb: "Fyll inn beløp for kontantstøtte",
            en: "Fill in amount for cash-for-care benefit",
            nn: "Fyll inn beløp for kontantstøtte",
          },
          tall: {
            nb: "Beløp må være et tall",
            en: "Amount must be a number",
            nn: "Beløp må vere eit tal",
          },
          minimum: {
            nb: "Beløp må være minst 0",
            en: "Amount must be at least 0",
            nn: "Beløp må vere minst 0",
          },
          maksimum: {
            nb: "Beløp kan ikke være mer enn 10 000 kr",
            en: "Amount cannot exceed 10,000 NOK",
            nn: "Beløp kan ikkje vere meir enn 10 000 kr",
          },
        },
        deler: {
          påkrevd: {
            nb: "Dette feltet er påkrevd",
            en: "",
            nn: "",
          },
        },
      },
      utvidetBarnetrygd: {
        mottar: {
          påkrevd: {
            nb: "Velg om du mottar utvidet barnetrygd",
            en: "Select if you receive extended child benefit",
            nn: "Vel om du mottar utvida barnetrygd",
          },
        },
        påkrevd: {
          nb: "Dette feltet er påkrevd",
          en: "",
          nn: "",
        },
      },
      småbarnstillegg: {
        påkrevd: {
          nb: "Velg om du mottar småbarnstillegg",
          en: "Select if you receive infant supplement",
          nn: "Vel om du mottar småbarnstillegg",
        },
      },
    },
  },
});
