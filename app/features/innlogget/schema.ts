import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";

const fastBosted = z.enum(["DELT_FAST_BOSTED", "IKKE_DELT_FAST_BOSTED"]);

export const InnloggetBarnSkjemaSchema = z.object({
  ident: z.string().length(11),
  bosted: z.enum([...fastBosted.options, ""]),
  samvær: z.string(),
});

export const InnloggetSkjemaSchema = z.object({
  motpartIdent: z.string().length(11),
  barn: z.array(InnloggetBarnSkjemaSchema),
  inntektDeg: z.string(),
  inntektMotpart: z.string(),
});

export const getInnloggetBarnSkjema = (språk: Språk) => {
  return z.object({
    ident: z
      .string()
      .length(11, oversett(språk, tekster.feilmeldinger.barnIdent.ugyldig)),
    bosted: z.enum(fastBosted.options, {
      message: oversett(språk, tekster.feilmeldinger.bostatus.påkrevd),
    }),
    samvær: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.samvær.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.samvær.minimum))
          .max(30, oversett(språk, tekster.feilmeldinger.samvær.maksimum)),
      ),
  });
};

export const getInnloggetSkjema = (språk: Språk) => {
  return z.object({
    motpartIdent: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.motpartIdent.påkrevd))
      .length(11, oversett(språk, tekster.feilmeldinger.motpartIdent.ugyldig)),
    barn: z
      .array(getInnloggetBarnSkjema(språk))
      .min(1, oversett(språk, tekster.feilmeldinger.barn.minimum))
      .max(10, oversett(språk, tekster.feilmeldinger.barn.maksimum)),
    inntektDeg: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.inntekt.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.inntekt.positivt))
          .step(1, oversett(språk, tekster.feilmeldinger.inntekt.heleKroner)),
      ),
    inntektMotpart: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.inntekt.påkrevd))
      .pipe(
        z.coerce
          .number()
          .min(0, oversett(språk, tekster.feilmeldinger.inntekt.positivt))
          .step(1, oversett(språk, tekster.feilmeldinger.inntekt.heleKroner)),
      ),
  });
};

export type FastBosted = z.infer<typeof fastBosted>;
export type InnloggetBarnSkjema = z.infer<typeof InnloggetBarnSkjemaSchema>;
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
        nn: "Vel medforelder",
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
    bostatus: {
      påkrevd: {
        nb: "Fyll ut hvor barnet bor",
        en: "Fill in where the child lives",
        nn: "Fyll ut kvar barnet bur",
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
