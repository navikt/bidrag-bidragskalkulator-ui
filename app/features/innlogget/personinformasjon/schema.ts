import { z } from "zod";

const PersonSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
});

const BarnSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
  alder: z.number().int().nonnegative(),
});

const BarnRelasjonSchema = z.object({
  motpart: PersonSchema.nullable(),
  fellesBarn: z.array(BarnSchema),
});

/**
 * Schemaet for responsen fra personinformasjon API-et.
 */
export const PersoninformasjonSchema = z.object({
  påloggetPerson: PersonSchema,
  barnRelasjon: z.array(BarnRelasjonSchema),
  inntekt: z.object({
    inntektSiste12Mnd: z.number().int().nonnegative().nullable(),
  }),
});

export type Barn = z.infer<typeof BarnSchema>;

export type Personinformasjon = z.infer<typeof PersoninformasjonSchema>;
