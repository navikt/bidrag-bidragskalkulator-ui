import { z } from "zod";

const PersonSchema = z.object({
  ident: z.string(), // kan være hva som helst
});

const BarnSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
  alder: z.number().int().nonnegative(),
  underholdskostnad: z.number().int().nonnegative(),
});

const RelasjonSchema = z.object({
  motpart: PersonSchema.nullable(),
  fellesBarn: z.array(BarnSchema),
});

/**
 * Schemaet for responsen fra personinformasjon API-et.
 */
export const PersoninformasjonSchema = z.object({
  person: PersonSchema,
  inntekt: z.number().int().nonnegative().nullable(),
  barnerelasjoner: z.array(RelasjonSchema),
  underholdskostnader: z.record(z.string(), z.number().int().nonnegative()),
});

export const ManuellPersoninformasjonSchema = z.object({
  person: PersonSchema,
  inntekt: z.number().int().nonnegative().nullable(),
  underholdskostnader: z.record(z.string(), z.number().int().nonnegative()),
});

export type Barn = z.infer<typeof BarnSchema>;

export type Personinformasjon = z.infer<typeof PersoninformasjonSchema>;

export type ManuellPersoninformasjon = z.infer<
  typeof ManuellPersoninformasjonSchema
>;
