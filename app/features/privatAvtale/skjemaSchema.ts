import { z } from "zod";
import { erDatostrengÅrMånedDag } from "~/utils/dato";
import { definerTekster, oversett, Språk } from "~/utils/i18n";
import { BidragstypeSchema } from "../skjema/beregning/schema";
import { OppgjørsformSchema } from "./apiSchema";

const Person = z.object({
  ident: z.string(),
  fornavn: z.string(),
  etternavn: z.string(),
});

const Bidragsbarn = Person.extend({
  sum: z.string(),
  bidragstype: z.enum([...BidragstypeSchema.options, ""]),
  fraDato: z.string(),
});

const lagValidertPersonSkjemaSchema = (
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

export type Person = z.infer<typeof Person>;

const AvtaledetaljerSchema = z.object({
  nyAvtale: z.enum(["true", "false", ""]),
  medInnkreving: z.enum(["true", "false", ""]),
  oppgjørsformIdag: z.enum([...OppgjørsformSchema.options, ""]),
});

export const PrivatAvtaleFlerstegsSkjemaSchema = z.object({
  steg1: z.object({
    deg: Person,
  }),
  steg2: z.object({
    medforelder: Person,
  }),
  steg3: z.object({
    barn: z.array(Bidragsbarn),
  }),
  steg4: z.object({
    avtaledetaljer: AvtaledetaljerSchema,
  }),
  steg5: z.object({
    erAndreBestemmelser: z.enum(["true", "false", ""]),
    andreBestemmelser: z.string(),
  }),
  steg6: z.object({
    harVedlegg: z.enum(["true", "false", ""]),
  }),
});

export const lagSteg1Schema = (språk: Språk) =>
  z.object({
    deg: lagValidertPersonSkjemaSchema(språk, "deg"),
  });

export const lagSteg2Schema = (språk: Språk) =>
  z.object({
    medforelder: lagValidertPersonSkjemaSchema(språk, "medforelder"),
  });

export const lagSteg3Schema = (språk: Språk) =>
  z.object({
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
          .refine((verdi) => verdi.trim() !== "", {
            message: oversett(språk, tekster.feilmeldinger.barn.sum.påkrevd),
          })
          .transform((verdi) => Number(verdi))
          .refine((verdi) => !isNaN(verdi), {
            message: oversett(språk, tekster.feilmeldinger.barn.sum.ugyldig),
          }),
        bidragstype: z.enum(BidragstypeSchema.options, {
          message: oversett(
            språk,
            tekster.feilmeldinger.barn.bidragstype.ugyldig,
          ),
        }),
        fraDato: z
          .string()
          .nonempty(oversett(språk, tekster.feilmeldinger.barn.fraDato.påkrevd))
          .refine(
            erDatostrengÅrMånedDag,
            oversett(språk, tekster.feilmeldinger.barn.fraDato.ugyldig),
          ),
      }),
    ),
  });

export const lagSteg4Schema = (språk: Språk) => {
  return z.object({
    avtaledetaljer: AvtaledetaljerSchema.superRefine((avtaledetaljer, ctx) => {
      // Validererer alle felter i superRefine for å muliggjøre validering av
      // oppgjørsformIdag før både nyAvtale og medInnkreving er gyldig
      if (!avtaledetaljer.nyAvtale) {
        ctx.addIssue({
          code: "custom",
          path: ["nyAvtale"],
          message: oversett(språk, tekster.feilmeldinger.nyAvtale.påkrevd),
        });
      }

      if (!avtaledetaljer.medInnkreving) {
        ctx.addIssue({
          code: "custom",
          path: ["medInnkreving"],
          message: oversett(språk, tekster.feilmeldinger.medInnkreving.påkrevd),
        });
      }

      if (
        avtaledetaljer.nyAvtale === "false" &&
        avtaledetaljer.oppgjørsformIdag === ""
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["oppgjørsformIdag"],
          message: oversett(
            språk,
            tekster.feilmeldinger.oppgjørsformIdag.påkrevd,
          ),
        });
      }
    }),
  });
};

export const lagSteg5Schema = (språk: Språk) =>
  z
    .object({
      erAndreBestemmelser: z
        .enum(["true", "false", ""], {
          message: oversett(
            språk,
            tekster.feilmeldinger.erAndreBestemmelser.påkrevd,
          ),
        })
        .transform((value) => value === "true"),
      andreBestemmelser: z.string(),
    })
    .refine(
      (data) =>
        !data.erAndreBestemmelser || data.andreBestemmelser.trim() !== "",
      {
        message: oversett(
          språk,
          tekster.feilmeldinger.andreBestemmelser.påkrevd,
        ),
        path: ["andreBestemmelser"],
      },
    );

export const lagSteg6Schema = (språk: Språk) =>
  z.object({
    harVedlegg: z
      .enum(["true", "false"], {
        message: oversett(språk, tekster.feilmeldinger.harVedlegg.påkrevd),
      })
      .transform((value) => value === "true"),
  });

export const lagPrivatAvtaleFlerstegsSchema = (språk: Språk) =>
  z.object({
    steg1: lagSteg1Schema(språk),
    steg2: lagSteg2Schema(språk),
    steg3: lagSteg3Schema(språk),
    steg4: lagSteg4Schema(språk),
    steg5: lagSteg5Schema(språk),
    steg6: lagSteg6Schema(språk),
  });

export type PrivatAvtaleFlerstegsSkjema = z.infer<
  typeof PrivatAvtaleFlerstegsSkjemaSchema
>;
export type PrivatAvtaleFlerstegsSkjemaValidert = z.infer<
  ReturnType<typeof lagPrivatAvtaleFlerstegsSchema>
>;

const tekster = definerTekster({
  feilmeldinger: {
    deg: {
      fornavn: {
        påkrevd: {
          nb: "Fyll inn fornavn",
          en: "Fill in first name",
          nn: "Fyll inn førenamn",
        },
      },
      etternavn: {
        påkrevd: {
          nb: "Fyll inn etternavn",
          en: "Fill in last name",
          nn: "Fyll inn etternamn",
        },
      },
      ident: {
        påkrevd: {
          nb: "Fyll inn fødselsnummer eller D-nummer",
          en: "Fill in identity number or D number",
          nn: "Fyll inn fødselsnummer eller D-nummer",
        },
        ugyldig: {
          nb: "Ugyldig fødselsnummer eller D-nummer",
          en: "Invalid identity number or D number",
          nn: "Ugyldig fødselsnummer eller D-nummer",
        },
      },
    },
    medforelder: {
      ident: {
        påkrevd: {
          nb: "Fyll inn fødselsnummer eller D-nummer",
          en: "Fill in identity number or D number",
          nn: "Fyll inn fødselsnummer eller D-nummer",
        },
        ugyldig: {
          nb: "Ugyldig fødselsnummer eller D-nummer",
          en: "Invalid identity number or D number",
          nn: "Ugyldig fødselsnummer eller D-nummer",
        },
      },
      fornavn: {
        påkrevd: {
          nb: "Fyll inn fornavn",
          en: "Fill in first name",
          nn: "Fyll inn førenamn",
        },
      },
      etternavn: {
        påkrevd: {
          nb: "Fyll inn etternavn",
          en: "Fill in last name",
          nn: "Fyll inn etternamn",
        },
      },
    },
    barn: {
      ident: {
        nb: "Fyll inn fødselsnummer eller D-nummer",
        en: "Fill in identity number or D number",
        nn: "Fyll inn fødselsnummer eller D-nummer",
      },
      fornavn: {
        påkrevd: {
          nb: "Fyll inn fornavn",
          en: "Fill in first name",
          nn: "Fyll inn førenamn",
        },
      },
      etternavn: {
        påkrevd: {
          nb: "Fyll inn etternavn",
          en: "Fill in last name",
          nn: "Fyll inn etternamn",
        },
      },
      sum: {
        påkrevd: {
          nb: "Fyll inn barnebidrag per måned",
          en: "Fill in child support per month",
          nn: "Fyll inn fostringstilskot per månad",
        },
        ugyldig: {
          nb: "Fyll inn et positivt antall",
          en: "Fill in a positive number",
          nn: "Fyll inn eit positivt tal",
        },
      },
      bidragstype: {
        ugyldig: {
          nb: "Fyll inn bidragstype",
          en: "Fill in contribution type",
          nn: "Fyll inn bidragstype",
        },
      },
      fraDato: {
        påkrevd: {
          nb: "Fyll inn dato avtalen skal gjelde fra",
          en: "Fill in the date the agreement should apply from",
          nn: "Fyll inn dato avtalen skal gjelde frå",
        },
        ugyldig: {
          nb: "Fyll inn en gyldig dato",
          en: "Fill in a valid date",
          nn: "Fyll inn ein gyldig dato",
        },
      },
    },
    medInnkreving: {
      påkrevd: {
        nb: "Fyll inn ønsket oppgjørsform",
        en: "Fill in the type of settlement",
        nn: "Fyll inn ynskja oppgjerstype",
      },
    },
    oppgjørsformIdag: {
      påkrevd: {
        nb: "Fyll inn hvilken oppgjørsform dere har i dag",
        en: "Fill in which settlement type you have today",
        nn: "Fyll inn hvilken oppgjerstype de har i dag",
      },
    },
    nyAvtale: {
      påkrevd: {
        nb: "Fyll inn om dette er en ny avtale",
        en: "Fill in if this is a new agreement",
        nn: "Fyll inn om dette er ein ny avtale",
      },
    },
    erAndreBestemmelser: {
      påkrevd: {
        nb: "Fyll inn om det er andre bestemmelser",
        en: "Fill in if there are other conditions",
        nn: "Fyll inn om det er andre bestemmingar",
      },
    },
    andreBestemmelser: {
      påkrevd: {
        nb: "Fyll inn andre bestemmelser",
        en: "Fill in other conditions",
        nn: "Fyll inn andre bestemmingar",
      },
    },
    harVedlegg: {
      påkrevd: {
        nb: "Fyll inn om det er vedlegg",
        en: "Fill in if there are attachments",
        nn: "Fyll inn om det er vedlegg",
      },
    },
  },
});
