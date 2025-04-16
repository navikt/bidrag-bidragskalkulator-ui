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
export const PersoninformasjonResponsSchema = z.object({
  påloggetPerson: PersonSchema,
  barnRelasjon: z.array(BarnRelasjonSchema),
});

export type Barn = z.infer<typeof BarnSchema>;

export type PersoninformasjonRespons = z.infer<
  typeof PersoninformasjonResponsSchema
>;
