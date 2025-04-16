import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

export const BarnSchema = z.object({
  ident: z.string().length(11),
  bosted: z.enum(["HOS_FORELDER_1", "HOS_FORELDER_2", "DELT_BOSTED", ""]),
  samvær: z.string().optional(),
  alder: z.string(),
});

export const InnloggetSkjemaSchema = z.object({
  motpartIdent: z.string().length(11),
  barn: z.array(BarnSchema),
  inntektDeg: z.string(),
  motpartInntekt: z.string(),
});

export const getBarnSkjema = (språk: Språk) => {
  return z
    .object({
      ident: z
        .string()
        .length(11, oversett(språk, tekster.feilmeldinger.barnIdent.ugyldig)),
      bosted: z.enum(["HOS_FORELDER_1", "DELT_BOSTED", "HOS_FORELDER_2"], {
        message: oversett(språk, tekster.feilmeldinger.bostatus.ugyldig),
      }),
      samvær: z
        .string()
        .nonempty(oversett(språk, tekster.feilmeldinger.samvær.påkrevd))
        .pipe(
          z.coerce
            .number()
            .min(0, oversett(språk, tekster.feilmeldinger.samvær.minimum))
            .max(30, oversett(språk, tekster.feilmeldinger.samvær.maksimum))
        ),
      alder: z.string().pipe(z.coerce.number().nonnegative()),
    })
    .refine(
      ({ bosted, samvær }) => {
        if (bosted === "HOS_FORELDER_1" && samvær < 15) {
          return false;
        }
        return true;
      },
      {
        message: oversett(
          språk,
          tekster.feilmeldinger.samvær.minimumHosForelder1
        ),
        path: ["samvær"],
      }
    )
    .refine(
      ({ bosted, samvær }) => {
        if (bosted === "HOS_FORELDER_2" && samvær > 15) {
          return false;
        }
        return true;
      },
      {
        message: oversett(
          språk,
          tekster.feilmeldinger.samvær.maksimumHosForelder2
        ),
        path: ["samvær"],
      }
    );
};

export const getInnloggetSkjema = (språk: Språk) => {
  return z.object({
    motpartIdent: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.motpartIdent.påkrevd))
      .length(11, oversett(språk, tekster.feilmeldinger.motpartIdent.ugyldig)),
    barn: z
      .array(getBarnSkjema(språk))
      .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
      .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
    inntektDeg: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.inntekt.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.inntekt.positivt))
          .step(1, oversett(språk, tekster.feilmeldinger.inntekt.heleKroner))
      ),
    motpartInntekt: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.inntekt.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.inntekt.positivt))
          .step(1, oversett(språk, tekster.feilmeldinger.inntekt.heleKroner))
      ),
  });
};

export type InnloggetBarnSkjema = z.infer<typeof BarnSchema>;
export type InnloggetSkjema = z.infer<typeof InnloggetSkjemaSchema>;
export type InnloggetSkjemaValidert = z.infer<
  ReturnType<typeof getInnloggetSkjema>
>;

const tekster = definerTekster({
  feilmeldinger: {
    motpartIdent: {
      påkrevd: {
        nb: "Velg medforelder",
        en: "Choose co-parent",
        nn: "Velg medforelder",
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
