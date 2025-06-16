import { z } from "zod";
import { definerTekster, oversett, Språk } from "~/utils/i18n";
import { BidragstypeSchema } from "../skjema/beregning/schema";

const Person = z.object({
  ident: z.string(),
  fornavn: z.string(),
  etternavn: z.string(),
});

const Bidragsbarn = Person.extend({
  sumBidrag: z.string(), // Fra kalkulator eller innfylt
  alder: z.number().optional(), // Fra kalkulator, skal ikke redigeres
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

export const lagValidertPersonSkjema = (
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

export const lagPrivatAvtaleSkjema = (språk: Språk) => {
  return z.object({
    deg: lagValidertPersonSkjema(språk, "deg"),
    medforelder: lagValidertPersonSkjema(språk, "medforelder"),
    fraDato: z.string(), // TODO
    nyAvtale: z.enum(["true", "false", ""]), // TODO
    medInnkreving: z.enum(["true", "false", ""]), // TODO
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
        sumBidrag: z
          .string()
          .nonempty(
            oversett(språk, tekster.feilmeldinger.barn.sumBidrag.påkrevd),
          )
          .pipe(z.coerce.number()),
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
  ReturnType<typeof lagPrivatAvtaleSkjema>
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
      sumBidrag: {
        påkrevd: {
          nb: "Sum bidrag er påkrevd.",
          en: "Total contribution is required.",
          nn: "Sum bidrag er påkravd.",
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
  },
});
