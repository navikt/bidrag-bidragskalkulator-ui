import { z } from "zod";

export const barnSchema = z.object({
  ident: z.string().length(11),
  bosted: z.enum(["HOS_FORELDER_1", "HOS_FORELDER_2", "DELT_BOSTED", ""]),
  samvær: z.string().optional(),
});

export const innloggetFormSchema = z.object({
  motpartIdent: z.string().length(11),
  barn: z.array(barnSchema).min(1),
  inntektDeg: z.string(),
  motpartInntekt: z.string(),
});

export type InnloggetFormBarn = z.infer<typeof barnSchema>;
export type InnloggetForm = z.infer<typeof innloggetFormSchema>;
