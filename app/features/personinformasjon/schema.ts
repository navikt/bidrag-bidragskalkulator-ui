import { z } from "zod";

const personSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
  alder: z.number().int().nonnegative(),
});

const barnSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
  alder: z.number().int().nonnegative(),
});

const barnRelasjonSchema = z.object({
  motpart: personSchema.nullable(),
  fellesBarn: z.array(barnSchema),
});

/**
 * Schemaet for responsen fra personinformasjon API-et.
 */
export const personinformasjonResponseSchema = z.object({
  paaloggetPerson: personSchema,
  barnRelasjon: z.array(barnRelasjonSchema),
});

export type PersoninformasjonResponse = z.infer<
  typeof personinformasjonResponseSchema
>;
