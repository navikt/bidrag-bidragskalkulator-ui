import { z } from "zod";

export const ResponseSchema = z.object({
  resultater: z.array(
    z.object({
      sum: z.number(),
      barnetsAlder: z.number(),
      bidragstype: z.enum(["PLIKTIG", "MOTTAKER"]),
      underholdskostnad: z.number(),
    })
  ),
});

export type SkjemaResponse = z.infer<typeof ResponseSchema> | { error: string };
