import { z } from "zod";

export type Samværsklasse =
  | "SAMVÆRSKLASSE_0"
  | "SAMVÆRSKLASSE_1"
  | "SAMVÆRSKLASSE_2"
  | "SAMVÆRSKLASSE_3"
  | "SAMVÆRSKLASSE_4"
  | "DELT_BOSTED";

export type Bidragsutregningsgrunnlag = {
  barn: {
    alder: number;
    samværsklasse: Samværsklasse;
    bidragstype: "MOTTAKER" | "PLIKTIG";
  }[];
  inntektForelder1: number;
  inntektForelder2: number;
};

export const Bidragsutregningskjema = z.object({
  resultater: z.array(
    z.object({
      sum: z.number(),
      barnetsAlder: z.number(),
      bidragstype: z.enum(["PLIKTIG", "MOTTAKER"]),
      underholdskostnad: z.number(),
    })
  ),
});

export type Bidragsutregning = z.infer<typeof Bidragsutregningskjema>;
