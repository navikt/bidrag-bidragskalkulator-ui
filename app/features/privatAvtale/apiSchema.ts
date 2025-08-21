import { z } from "zod";

export const ApiSpråkSchema = z.enum(["NB", "NN", "EN"]);

export const OppgjørsformSchema = z.enum(["PRIVAT", "INNKREVING"]);

export const PrivatAvtalePersoninformasjonSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  etternavn: z.string(),
});

const Person = z.object({
  ident: z.string(),
  fornavn: z.string(),
  etternavn: z.string(),
});

const Bidragsbarn = Person.extend({
  sumBidrag: z.number(),
  fraDato: z.string(),
});

export const LagPrivatAvtaleRequestSchema = z.object({
  språk: ApiSpråkSchema,
  bidragsmottaker: Person,
  bidragspliktig: Person,
  barn: z.array(Bidragsbarn),
  oppgjør: z.object({
    nyAvtale: z.boolean(),
    oppgjørsformØnsket: OppgjørsformSchema,
    oppgjørsformIdag: OppgjørsformSchema.optional(),
  }),
  tilInnsending: z.boolean(),
  andreBestemmelser: z.object({
    harAndreBestemmelser: z.boolean(),
    beskrivelse: z.string(),
  }),
  vedlegg: z.enum(["INGEN_EKSTRA_DOKUMENTASJON", "SENDES_MED_SKJEMA"]),
});

export type ApiSpråk = z.infer<typeof ApiSpråkSchema>;

export type LagPrivatAvtaleRequest = z.infer<
  typeof LagPrivatAvtaleRequestSchema
>;

export type HentPersoninformasjonForPrivatAvtaleRespons = z.infer<
  typeof PrivatAvtalePersoninformasjonSchema
>;
