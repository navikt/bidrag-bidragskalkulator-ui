import { z } from "zod";

const PersonSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
  alder: z.number().int().nonnegative(),
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
export const PersoninformasjonResponseSchema = z.object({
  paaloggetPerson: PersonSchema,
  barnRelasjon: z.array(BarnRelasjonSchema),
});
export type PersoninformasjonResponse = z.infer<
  typeof PersoninformasjonResponseSchema
>;
