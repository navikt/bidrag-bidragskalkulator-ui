import { z } from "zod";

const PersonSchema = z.object({
  ident: z.string(),
  fornavn: z.string(),
  fulltNavn: z.string(),
  alder: z.number().int().nonnegative(),
});

const BarnRelasjonSchema = z.object({
  motpart: PersonSchema.nullable(),
  fellesBarn: z.array(PersonSchema),
});

/**
 * Schemaet for responsen fra personinformasjon API-et.
 */
export const PersoninformasjonResponsSchema = z.object({
  påloggetPerson: PersonSchema,
  barnRelasjon: z.array(BarnRelasjonSchema),
});

export type Person = z.infer<typeof PersonSchema>;

export type PersoninformasjonRespons = z.infer<
  typeof PersoninformasjonResponsSchema
>;
