import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

/**
 * Beregner alder basert på fødselsår.
 * Bruker 1. juli som fødselsdato.
 */
export const beregnAlderFraFødselsår = (fødselsår: number): number => {
  const fødselsdato = new Date(fødselsår, 6, 1);
  const iDag = new Date();
  let alder = iDag.getFullYear() - fødselsdato.getFullYear();
  const månedDiff = iDag.getMonth() - fødselsdato.getMonth();
  if (
    månedDiff < 0 ||
    (månedDiff === 0 && iDag.getDate() < fødselsdato.getDate())
  ) {
    alder--;
  }
  return alder;
};

/** Beregner antall måneder siden fødselsår.
 * Bruker 1. juli som fødselsdato.
 * Returnerer antall hele måneder.
 * Eksempel: Fødselsår 2022 og dagens dato er 1. september 2024 → returnerer 26 måneder.
 * Eksempel: Fødselsår 2023 og dagens dato er 15. august 2024 → returnerer 13 måneder.
 * Eksempel: Fødselsår 2023 og dagens dato er 30. juni 2024 → returnerer 11 måneder.
 * */
export const beregnAntallMånederFraFødselsår = (fødselsår: number): number => {
  const fødselsdato = new Date(fødselsår, 6, 1);
  const iDag = new Date();
  let måneder = (iDag.getFullYear() - fødselsdato.getFullYear()) * 12;
  måneder += iDag.getMonth() - fødselsdato.getMonth();
  if (iDag.getDate() < fødselsdato.getDate()) {
    måneder--;
  }
  return måneder;
};

export const MAKS_ALDER_BARNETILSYNSUTGIFT = 10;
export const MAKS_ALDER_BARN_EGEN_INNTEKT = 13;
export const MAKS_ALDER_SMÅBARNSTILLEGG = 3;
export const MAKS_ALDER_UTVIDET_BARNETRYGD = 18;
export const MIN_MÅNED_KONTANTSTØTTE = 13;
export const MAX_MÅNED_KONTANTSTØTTE = 19;

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

export type BorMedAnnenVoksenType = z.infer<typeof BorMedAnnenVoksenTypeSchema>;

export const BarnepassSituasjonSchema = z.enum(["HELTID", "DELTID"]);
export const HvemFårBarnetilleggSchema = z.enum(["MEG", "DEN_ANDRE_FORELDREN"]);

export type Tilsynstype = z.infer<typeof BarnepassSituasjonSchema>;
export type VoksneOver18Type = z.infer<typeof BorMedAnnenVoksenTypeSchema>;

const BarnSkjemaSchema = z.object({
  fødselsår: z.string(),
  bosted: z.enum([...FastBostedSchema.options, ""]),
  samvær: z.string(),
  harBarnetilsynsutgift: z.enum(["true", "false", "undefined"]),
  mottarStønadTilBarnetilsyn: z.enum(["true", "false", "undefined"]),
  barnetilsynsutgift: z.string(),
  barnepassSituasjon: BarnepassSituasjonSchema.or(z.literal("")),
  inntektPerMåned: z.string(),
});

const BarnebidragSkjemaSchema = z.object({
  bidragstype: z.enum(["", "MOTTAKER", "PLIKTIG"]),
  barn: z.array(BarnSkjemaSchema),
  deg: z.object({
    inntekt: z.string(),
    kapitalinntekt: z.string(),
    harKapitalinntektOver10k: z.enum(["true", "undefined"]),
  }),
  medforelder: z.object({
    inntekt: z.string(),
    kapitalinntekt: z.string(),
    harKapitalinntektOver10k: z.enum(["true", "undefined"]),
  }),
  barnHarEgenInntekt: z.enum(["true", "false", "undefined"]),
  dittBoforhold: z.object({
    harVoksneOver18: z.enum(["true", "false", "undefined"]),
    harBarnUnder18: z.enum(["true", "false", "undefined"]),
    antallBarnUnder18: z.string(),
    voksneOver18Type: z.array(z.string()),
    harBarnOver18Vgs: z.enum(["true", "false", "undefined"]),
    antallBarnOver18Vgs: z.string(),
    andreBarnebidragerPerMåned: z.string(),
  }),
  medforelderBoforhold: z.object({
    harVoksneOver18: z.enum(["true", "false", "undefined"]),
    harBarnUnder18: z.enum(["true", "false", "undefined"]),
    antallBarnUnder18: z.string(),
    voksneOver18Type: z.array(z.string()),
    harBarnOver18Vgs: z.enum(["true", "false", "undefined"]),
    antallBarnOver18Vgs: z.string(),
    andreBarnebidragerPerMåned: z.string(),
  }),
  ytelser: z.object({
    kontantstøtte: z.object({
      mottar: z.enum(["true", "undefined"]),
      beløp: z.string(),
      deler: z.enum(["true", "false", "undefined"]),
    }),
    mottarUtvidetBarnetrygd: z.enum(["true", "undefined"]),
    delerUtvidetBarnetrygd: z.enum(["true", "false", "undefined"]),
    mottarSmåbarnstillegg: z.enum(["true", "undefined"]),
  }),
});

export const lagYtelserSkjema = (språk: Språk) => {
  return z
    .object({
      kontantstøtte: z.object({
        mottar: z
          .enum(["true", "undefined"])
          .transform((value) => (value === "undefined" ? undefined : true)),
        beløp: z.string(),
        deler: z
          .enum(["true", "false", "undefined"])
          .transform((value) =>
            value === "undefined" ? undefined : value === "true",
          ),
      }),
      mottarUtvidetBarnetrygd: z
        .enum(["true", "undefined"])
        .transform((value) => (value === "undefined" ? undefined : true)),
      delerUtvidetBarnetrygd: z
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      mottarSmåbarnstillegg: z
        .enum(["true", "undefined"])
        .transform((value) => (value === "undefined" ? undefined : true)),
    })
    .superRefine((values, ctx) => {
      // Valider beløp når mottar er true og de ikke har svart "nei" på deling
      if (
        values.kontantstøtte.mottar === true &&
        values.kontantstøtte.beløp.trim() === "" &&
        values.kontantstøtte.deler !== false
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
    })
    .transform((values) => {
      return {
        ...values,
        kontantstøtte: {
          ...values.kontantstøtte,
          beløp: Number(values.kontantstøtte.beløp.trim() ?? 0),
          deler:
            values.kontantstøtte.mottar === true
              ? Boolean(values.kontantstøtte.deler)
              : false,
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

export const lagBoforholdSkjema = (språk: Språk) => {
  return z
    .object({
      harVoksneOver18: z
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      harBarnUnder18: z
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      antallBarnUnder18: z.string(),
      voksneOver18Type: z
        .array(z.string())
        .catch([])
        .transform((val) =>
          val.filter(
            (v): v is VoksneOver18Type =>
              v === "SAMBOER_ELLER_EKTEFELLE" || v === "EGNE_BARN_OVER_18",
          ),
        ),
      harBarnOver18Vgs: z
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      antallBarnOver18Vgs: z.string(),
      andreBarnebidragerPerMåned: z.string(),
    })
    .superRefine((values, ctx) => {
      if (
        values.harBarnUnder18 === true &&
        values.antallBarnUnder18.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnUnder18.påkrevd,
          ),
          path: ["antallBarnUnder18"],
        });
      }

      if (
        values.harVoksneOver18 === true &&
        values.voksneOver18Type.length === 0
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.voksneOver18Type.påkrevd,
          ),
          path: ["voksneOver18Type"],
        });
      }

      if (
        values.voksneOver18Type.includes("EGNE_BARN_OVER_18") &&
        values.harBarnOver18Vgs === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.harBarnOver18Vgs.påkrevd,
          ),
          path: ["harBarnOver18Vgs"],
        });
      }

      if (
        values.harBarnOver18Vgs === true &&
        values.antallBarnOver18Vgs.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnOver18Vgs
              .påkrevd,
          ),
          path: ["antallBarnOver18Vgs"],
        });
      }
    })
    .transform((values) => {
      return {
        ...values,
        antallBarnUnder18: Number(values.antallBarnUnder18.trim() || 0),
        andreBarnebidragerPerMåned: Number(
          values.andreBarnebidragerPerMåned.trim() || 0,
        ),
        antallBarnOver18Vgs: Number(values.antallBarnOver18Vgs.trim() || 0),
      };
    })
    .superRefine((values, ctx) => {
      if (isNaN(values.antallBarnUnder18)) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnUnder18.tall,
          ),
          path: ["antallBarnUnder18"],
        });
      } else if (values.antallBarnUnder18 < 0) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.husstandsmedlemmer.antallBarnUnder18.minimum,
          ),
          path: ["antallBarnUnder18"],
        });
      }
    });
};

export const lagInntektSkjema = (språk: Språk) => {
  return z
    .object({
      inntekt: z.string(),
      kapitalinntekt: z.string(),
      harKapitalinntektOver10k: z
        .enum(["true", "undefined"])
        .transform((value) => (value === "undefined" ? undefined : true)),
    })
    .superRefine((data, ctx) => {
      // Valider inntekt - alltid påkrevd
      if (data.inntekt.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: oversett(språk, tekster.feilmeldinger.inntekt.påkrevd),
          path: ["inntekt"],
        });
      }

      // Valider kapitalinntekt - kun påkrevd når harKapitalinntektOver10k er true
      if (
        data.harKapitalinntektOver10k === true &&
        data.kapitalinntekt.trim() === ""
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(språk, tekster.feilmeldinger.inntekt.påkrevd),
          path: ["kapitalinntekt"],
        });
      }
    })
    .transform((data) => ({
      ...data,
      inntekt: Number(data.inntekt.trim() || 0),
      kapitalinntekt: Number(data.kapitalinntekt.trim() || 0),
    }))
    .superRefine((data, ctx) => {
      // Valider inntekt er positivt heltall
      if (data.inntekt < 0) {
        ctx.addIssue({
          code: "custom",
          message: oversett(språk, tekster.feilmeldinger.inntekt.positivt),
          path: ["inntekt"],
        });
      }

      if (!Number.isInteger(data.inntekt)) {
        ctx.addIssue({
          code: "custom",
          message: oversett(språk, tekster.feilmeldinger.inntekt.heleKroner),
          path: ["inntekt"],
        });
      }

      // Valider kapitalinntekt er positivt heltall (kun hvis den er fylt ut)
      if (data.harKapitalinntektOver10k === true) {
        if (data.kapitalinntekt < 0) {
          ctx.addIssue({
            code: "custom",
            message: oversett(språk, tekster.feilmeldinger.inntekt.positivt),
            path: ["kapitalinntekt"],
          });
        }

        if (!Number.isInteger(data.kapitalinntekt)) {
          ctx.addIssue({
            code: "custom",
            message: oversett(språk, tekster.feilmeldinger.inntekt.heleKroner),
            path: ["kapitalinntekt"],
          });
        }
      }
    });
};

export const lagBarnSkjema = (språk: Språk) => {
  return z
    .object({
      fødselsår: z
        .string()
        .refine((verdi) => verdi.trim() !== "", {
          message: oversett(
            språk,
            tekster.feilmeldinger.barn.fødselsår.påkrevd,
          ),
        })
        .transform((verdi) => Number(verdi.trim()))
        .refine((verdi) => !isNaN(verdi), {
          message: oversett(
            språk,
            tekster.feilmeldinger.barn.fødselsår.ugyldig,
          ),
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
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      mottarStønadTilBarnetilsyn: z
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      barnetilsynsutgift: z.string(),
      barnepassSituasjon: BarnepassSituasjonSchema.or(z.literal("")).catch(""),
      inntektPerMåned: z.string(),
    })
    .superRefine((data, ctx) => {
      // Barnepass
      const alder = beregnAlderFraFødselsår(data.fødselsår);
      if (alder <= MAKS_ALDER_BARNETILSYNSUTGIFT) {
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
    })
    .transform((values) => ({
      ...values,
      fødselsdato: `${values.fødselsår}-07-01`,
      harBarnetilsynsutgift: Boolean(values.harBarnetilsynsutgift),
      mottarStønadTilBarnetilsyn: Boolean(values.mottarStønadTilBarnetilsyn),
      barnetilsynsutgift: Number(values.barnetilsynsutgift.trim()),
      barnepassSituasjon:
        values.barnepassSituasjon === ""
          ? null
          : (values.barnepassSituasjon as Tilsynstype),
      inntektPerMåned: Number(values.inntektPerMåned.trim()),
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
      bidragstype: z.enum(["MOTTAKER", "PLIKTIG"]),
      barn: z
        .array(lagBarnSkjema(språk))
        .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
        .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
      deg: lagInntektSkjema(språk),
      medforelder: lagInntektSkjema(språk),
      barnHarEgenInntekt: z
        .enum(["true", "false", "undefined"])
        .transform((value) =>
          value === "undefined" ? undefined : value === "true",
        ),
      dittBoforhold: lagBoforholdSkjema(språk),
      medforelderBoforhold: lagBoforholdSkjema(språk),
      ytelser: lagYtelserSkjema(språk),
    })
    .superRefine((data, ctx) => {
      const { bidragstype, dittBoforhold, medforelderBoforhold } = data;

      if (data.barnHarEgenInntekt === undefined) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.barn.egenInntekt.påkrevd,
          ),
          path: ["barnHarEgenInntekt"],
        });
      }

      // Valider inntektPerMåned kun når barnHarEgenInntekt er true
      if (data.barnHarEgenInntekt === true) {
        data.barn.forEach((barn, index) => {
          if (isNaN(barn.inntektPerMåned) || barn.inntektPerMåned < 0) {
            ctx.addIssue({
              code: "custom",
              message: oversett(
                språk,
                tekster.feilmeldinger.inntekt.beløp.påkrevd,
              ),
              path: ["barn", index, "inntektPerMåned"],
            });
          }
        });
      }

      // Valider delerUtvidetBarnetrygd kun når minst et barn har DELT_FAST_BOSTED
      const harBarnMedDeltBosted = data.barn.some(
        (barn) => barn.bosted === "DELT_FAST_BOSTED",
      );
      if (
        data.ytelser.mottarUtvidetBarnetrygd &&
        harBarnMedDeltBosted &&
        data.ytelser.delerUtvidetBarnetrygd === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.utvidetBarnetrygd.deler.påkrevd,
          ),
          path: ["ytelser", "delerUtvidetBarnetrygd"],
        });
      }

      // Valider kontantstøtte.deler kun når mottar er true og minst et barn har DELT_FAST_BOSTED
      if (
        data.ytelser.kontantstøtte.mottar === true &&
        harBarnMedDeltBosted &&
        data.ytelser.kontantstøtte.deler === undefined
      ) {
        ctx.addIssue({
          code: "custom",
          message: oversett(
            språk,
            tekster.feilmeldinger.ytelser.kontantstøtte.deler.påkrevd,
          ),
          path: ["ytelser", "kontantstøtte", "deler"],
        });
      }

      if (bidragstype === "MOTTAKER") {
        if (medforelderBoforhold.harBarnUnder18 === undefined) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "harBarnUnder18"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.harBarnUnder18.påkrevd,
            ),
          });
        }

        if (medforelderBoforhold.harVoksneOver18 === undefined) {
          ctx.addIssue({
            path: ["medforelderBoforhold", "harVoksneOver18"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.harVoksneOver18.påkrevd,
            ),
          });
        }
      }

      if (bidragstype === "PLIKTIG") {
        if (dittBoforhold.harBarnUnder18 === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "harBarnUnder18"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.harBarnUnder18.påkrevd,
            ),
          });
        }
        if (dittBoforhold.harVoksneOver18 === undefined) {
          ctx.addIssue({
            path: ["dittBoforhold", "harVoksneOver18"],
            code: "custom",
            message: oversett(
              språk,
              tekster.feilmeldinger.husstandsmedlemmer.harVoksneOver18.påkrevd,
            ),
          });
        }
      }
    })
    .transform((data) => ({
      ...data,
      barnHarEgenInntekt: data.barnHarEgenInntekt === true,
    }));
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
          nb: "Velg om du har utgifter til barnepass",
          en: "Select if you have childcare expenses",
          nn: "Vel om du har utgifter til barnepass",
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
          nb: "Velg om du mottar stønad til barnetilsyn",
          en: "Select if you receive childcare support",
          nn: "Vel om du mottar stønad til barnetilsyn",
        },
        type: {
          påkrevd: {
            nb: "Velg type barnepass",
            en: "Select childcare type",
            nn: "Vel type barnepass",
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
      fødselsår: {
        påkrevd: {
          nb: "Velg fødselsår",
          en: "Select birth year",
          nn: "Vel fødselsår",
        },
        ugyldig: {
          nb: "Ugyldig fødselsår",
          en: "Invalid birth year",
          nn: "Ugyldig fødselsår",
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
        nb: "Fyll inn inntekt",
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
    },
    husstandsmedlemmer: {
      antallBarnUnder18: {
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
      harVoksneOver18: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      harBarnUnder18: {
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
      voksneOver18Type: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      harBarnOver18Vgs: {
        påkrevd: {
          nb: "Velg et alternativ",
          en: "Choose an option",
          nn: "Vel eit alternativ",
        },
      },
      antallBarnOver18Vgs: {
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
            nb: "Velg om dere deler kontantstøtten",
            en: "Select if you share the cash-for-care benefit",
            nn: "Vel om de deler kontantstøtta",
          },
        },
      },
      utvidetBarnetrygd: {
        deler: {
          påkrevd: {
            nb: "Velg om dere deler utvidet barnetrygd",
            en: "Select if you share extended child benefit",
            nn: "Vel om de deler utvida barnetrygd",
          },
        },
      },
    },
  },
});
