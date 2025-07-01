import { z } from "zod";
import { erDatostrengÅrMånedDag } from "~/utils/dato";
import { definerTekster, oversett, Språk } from "~/utils/i18n";
import { BidragstypeSchema } from "../skjema/beregning/schema";

const Person = z.object({
  ident: z.string(),
  fulltNavn: z.string(),
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
    fulltNavn: z
      .string()
      .nonempty(oversett(språk, tekster.feilmeldinger[part].fulltNavn.påkrevd)),
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
        fulltNavn: z
          .string()
          .nonempty(
            oversett(språk, tekster.feilmeldinger.barn.fulltNavn.påkrevd),
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
      fulltNavn: {
        påkrevd: {
          nb: "Fyll ut fullt navn",
          en: "Fill in full name",
          nn: "Fyll ut fullt namn",
        },
      },
      ident: {
        påkrevd: {
          nb: "Fyll ut fødselsnummer eller D-nummer",
          en: "Fill in identity number or D number",
          nn: "Fyll ut fødselsnummer eller D-nummer",
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
          nb: "Fyll ut fødselsnummer eller D-nummer",
          en: "Fill in identity number or D number",
          nn: "Fyll ut fødselsnummer eller D-nummer",
        },
        ugyldig: {
          nb: "Ugyldig fødselsnummer eller D-nummer",
          en: "Invalid identity number or D number",
          nn: "Ugyldig fødselsnummer eller D-nummer",
        },
      },
      fulltNavn: {
        påkrevd: {
          nb: "Fyll ut fullt navn",
          en: "Fill in full name",
          nn: "Fyll ut fullt namn",
        },
      },
    },
    barn: {
      ident: {
        nb: "Fyll ut fødselsnummer eller D-nummer",
        en: "Fill in identity number or D number",
        nn: "Fyll ut fødselsnummer eller D-nummer",
      },
      fulltNavn: {
        påkrevd: {
          nb: "Fyll ut fullt navn",
          en: "Fill in full name",
          nn: "Fyll ut fullt namn",
        },
      },
      sum: {
        påkrevd: {
          nb: "Fyll ut barnebidrag per måned",
          en: "Fill in child support per month",
          nn: "Fyll ut fostringstilskot per månad",
        },
        ugyldig: {
          nb: "Fyll ut et positivt antall",
          en: "Fill in a positive number",
          nn: "Fyll ut eit positivt tal",
        },
      },
      bidragstype: {
        ugyldig: {
          nb: "Fyll ut bidragstype",
          en: "Fill in contribution type",
          nn: "Fyll ut bidragstype",
        },
      },
    },
    fraDato: {
      påkrevd: {
        nb: "Fyll ut dato avtalen skal gjelde fra",
        en: "Fill in the date the agreement should apply from",
        nn: "Fyll ut dato avtalen skal gjelde frå",
      },
      ugyldig: {
        nb: "Fyll ut en gyldig dato",
        en: "Fill in a valid date",
        nn: "Fyll ut ein gyldig dato",
      },
    },
    medInnkreving: {
      påkrevd: {
        nb: "Fyll ut oppgjørsform",
        en: "Fill in the type of settlement",
        nn: "Fyll ut oppgjerstype",
      },
    },
    nyAvtale: {
      påkrevd: {
        nb: "Fyll ut om dette er en ny avtale",
        en: "Fill in if this is a new agreement",
        nn: "Fyll ut om dette er ein ny avtale",
      },
    },
  },
});
