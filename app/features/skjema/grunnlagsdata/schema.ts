import { z } from "zod";

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

export type Kalkulatorgrunnlagsdata = z.infer<
  typeof KalkulatorgrunnlagsdataSchema
>;
