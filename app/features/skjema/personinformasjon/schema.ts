import { z } from "zod";

const PersonSchema = z.object({
  ident: z.string(), // kan være hva som helst
  fulltNavn: z.string(),
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

const SamværsfradragSchema = z.array(
  z.object({
    alderFra: z.number().int().nonnegative(),
    alderTil: z.number().int().nonnegative(),
    beløpFradrag: z.object({
      SAMVÆRSKLASSE_1: z.number().int().nonnegative(),
      SAMVÆRSKLASSE_2: z.number().int().nonnegative(),
      SAMVÆRSKLASSE_3: z.number().int().nonnegative(),
      SAMVÆRSKLASSE_4: z.number().int().nonnegative(),
    }),
  }),
);

export const KalkulatorgrunnlagsdataSchema = z.object({
  underholdskostnader: z.record(z.string(), z.number().int().nonnegative()),
  samværsfradrag: SamværsfradragSchema,
});

/**
 * Schemaet for responsen fra personinformasjon API-et.
 */
export const PersoninformasjonSchema = KalkulatorgrunnlagsdataSchema.extend({
  person: PersonSchema,
  inntekt: z.number().int().nonnegative().nullable(),
  barnerelasjoner: z.array(RelasjonSchema),
});

export const ManuellPersoninformasjonSchema =
  KalkulatorgrunnlagsdataSchema.extend({
    person: PersonSchema,
    inntekt: z.number().int().nonnegative().nullable(),
  });

export type Barn = z.infer<typeof BarnSchema>;

export type Personinformasjon = z.infer<typeof PersoninformasjonSchema>;

export type ManuellPersoninformasjon = z.infer<
  typeof ManuellPersoninformasjonSchema
>;

export type Kalkulatorgrunnlagsdata = z.infer<
  typeof KalkulatorgrunnlagsdataSchema
>;
