import { z } from "zod";
import { erDatostrengÅrMånedDag } from "~/utils/dato";
import { definerTekster, oversett, Språk } from "~/utils/i18n";
import { BidragstypeSchema } from "../skjema/beregning/schema";

const Person = z.object({
  ident: z.string(),
  fornavn: z.string(),
  etternavn: z.string(),
});

const Bidragsbarn = Person.extend({
  sum: z.string(), // Fra kalkulator eller innfylt
  bidragstype: z.enum([...BidragstypeSchema.options, ""]), // Fra kalkulator, skal ikke redigeres (?? eller kanskje?)
});

export const PrivatAvtaleSkjemaSchema = z.object({
  deg: Person,
  medforelder: Person,
  barn: z.array(Bidragsbarn),
  fraDato: z.string(),
  nyAvtale: z.enum(["true", "false", ""]),
  medInnkreving: z.enum(["true", "false", ""]),
  innhold: z.string(),
});

export const lagValidertPersonSkjemaSchema = (
  språk: Språk,
  part: "deg" | "medforelder",
) => {
  return z.object({
    ident: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger[part].ident.påkrevd))
      .length(11, oversett(språk, tekster.feilmeldinger[part].ident.ugyldig)),
    fornavn: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger[part].fornavn.påkrevd)),
    etternavn: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger[part].etternavn.påkrevd)),
  });
};

export const lagPrivatAvtaleSkjemaValidertSchema = (språk: Språk) => {
  return z.object({
    deg: lagValidertPersonSkjemaSchema(språk, "deg"),
    medforelder: lagValidertPersonSkjemaSchema(språk, "medforelder"),
    fraDato: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger.fraDato.påkrevd))
      .refine(
        erDatostrengÅrMånedDag,
        oversett(språk, tekster.feilmeldinger.fraDato.ugyldig),
      ),
    nyAvtale: z
      .enum(["true", "false"], {
        message: oversett(språk, tekster.feilmeldinger.nyAvtale.påkrevd),
      })
      .transform((value) => value === "true"),
    medInnkreving: z
      .enum(["true", "false"], {
        message: oversett(språk, tekster.feilmeldinger.medInnkreving.påkrevd),
      })
      .transform((value) => value === "true"),
    innhold: z.string(), // TODO
    barn: z.array(
      z.object({
        fornavn: z
          .string()
          .nonempty(
            oversett(språk, tekster.feilmeldinger.barn.fornavn.påkrevd),
          ),
        etternavn: z
          .string()
          .nonempty(
            oversett(språk, tekster.feilmeldinger.barn.etternavn.påkrevd),
          ),
        ident: z
          .string()
          .nonempty(oversett(språk, tekster.feilmeldinger.barn.ident))
          .length(11, oversett(språk, tekster.feilmeldinger.barn.ident)),
        sum: z
          .string()
          .nonempty(oversett(språk, tekster.feilmeldinger.barn.sum.påkrevd))
          .pipe(
            z.coerce.number({
              invalid_type_error: oversett(
                språk,
                tekster.feilmeldinger.barn.sum.ugyldig,
              ),
            }),
          ),
        bidragstype: z.enum(BidragstypeSchema.options, {
          message: oversett(
            språk,
            tekster.feilmeldinger.barn.bidragstype.ugyldig,
          ),
        }),
      }),
    ),
  });
};

export type PrivatAvtaleSkjema = z.infer<typeof PrivatAvtaleSkjemaSchema>;
export type PrivatAvtaleSkjemaValidert = z.infer<
  ReturnType<typeof lagPrivatAvtaleSkjemaValidertSchema>
>;

const tekster = definerTekster({
  feilmeldinger: {
    deg: {
      fornavn: {
        påkrevd: {
          nb: "Fornavn er påkrevd.",
          en: "First name is required.",
          nn: "Fornamn er påkravd.",
        },
      },
      etternavn: {
        påkrevd: {
          nb: "Etternavn er påkrevd.",
          en: "Last name is required.",
          nn: "Etternamn er påkravd.",
        },
      },
      ident: {
        påkrevd: {
          nb: "Ugyldig ident. Ident må være 11 siffer.",
          en: "Invalid ID. ID must be 11 digits.",
          nn: "Ugyldig ident. Ident må vere 11 siffer.",
        },
        ugyldig: {
          nb: "Ugyldig ident. Ident må være 11 siffer.",
          en: "Invalid ID. ID must be 11 digits.",
          nn: "Ugyldig ident. Ident må vere 11 siffer.",
        },
      },
    },
    medforelder: {
      ident: {
        påkrevd: {
          nb: "Ugyldig ident. Ident må være 11 siffer.",
          en: "Invalid ID. ID must be 11 digits.",
          nn: "Ugyldig ident. Ident må vere 11 siffer.",
        },
        ugyldig: {
          nb: "Ugyldig ident. Ident må være 11 siffer.",
          en: "Invalid ID. ID must be 11 digits.",
          nn: "Ugyldig ident. Ident må vere 11 siffer.",
        },
      },
      fornavn: {
        påkrevd: {
          nb: "Fornavn er påkrevd.",
          en: "First name is required.",
          nn: "Fornamn er påkravd.",
        },
      },
      etternavn: {
        påkrevd: {
          nb: "Etternavn er påkrevd.",
          en: "Last name is required.",
          nn: "Etternamn er påkravd.",
        },
      },
    },
    barn: {
      ident: {
        nb: "Ugyldig ident. Ident må være 11 siffer.",
        en: "Invalid ID. ID must be 11 digits.",
        nn: "Ugyldig ident. Ident må vere 11 siffer.",
      },
      fornavn: {
        påkrevd: {
          nb: "Fornavn er påkrevd.",
          en: "First name is required.",
          nn: "Fornamn er påkravd.",
        },
      },
      etternavn: {
        påkrevd: {
          nb: "Etternavn er påkrevd.",
          en: "Last name is required.",
          nn: "Etternamn er påkravd.",
        },
      },
      sum: {
        påkrevd: {
          nb: "Sum bidrag er påkrevd.",
          en: "Total contribution is required.",
          nn: "Sum bidrag er påkravd.",
        },
        ugyldig: {
          nb: "Ugyldig verdi, velg et tall større enn eller lik 0.",
          en: "Invalid value, select a number greater than or equal to 0.",
          nn: "Ugyldig verdi, velg eit tal større enn eller lik 0.",
        },
      },
      bidragstype: {
        ugyldig: {
          nb: "Ugyldig bidragstype.",
          en: "Invalid contribution type.",
          nn: "Ugyldig bidragstype.",
        },
      },
    },
    fraDato: {
      påkrevd: {
        nb: "Velg dato avtalen skal gjelde fra.",
        en: "Select the date the agreement should apply from.",
        nn: "Vel datum avtalen skal gjelde frå.",
      },
      ugyldig: {
        nb: "Ugyldig dato",
        nn: "Ugyldig dato",
        en: "Invalid date",
      },
    },
    medInnkreving: {
      påkrevd: {
        nb: "Velg oppgjørsform",
        en: "Select the type of settlement",
        nn: "Vel oppgjerstype",
      },
    },
    nyAvtale: {
      påkrevd: {
        nb: "Velg om dette er en ny avtale",
        en: "Select if this is a new agreement",
        nn: "Vel om dette er ein ny avtale",
      },
    },
  },
});
