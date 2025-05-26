import { z } from "zod";

type Boforhold = {
  antallBarnBorFast: number; // Antall barn under 18 år som bor fast hos forelderen
  antallBarnDeltBosted: number; // Antall barn under 18 år med delt bosted hos forelderen
  borMedAnnenVoksen: boolean;
};

export type Samværsklasse =
  | "SAMVÆRSKLASSE_0"
  | "SAMVÆRSKLASSE_1"
  | "SAMVÆRSKLASSE_2"
  | "SAMVÆRSKLASSE_3"
  | "SAMVÆRSKLASSE_4"
  | "DELT_BOSTED";

export type Bidragsutregningsgrunnlag = {
  barn: {
    ident: string;
    samværsklasse: Samværsklasse;
    bidragstype: "MOTTAKER" | "PLIKTIG";
  }[];
  inntektForelder1: number;
  inntektForelder2: number;
  dittBoforhold: Boforhold | null; // Boforhold for den påloggede personen. Må være satt hvis bidragstype for minst ett barn er PLIKTIG
  medforelderBoforhold: Boforhold | null; // Boforhold for den andre forelderen. Må være satt hvis bidragstype for minst ett barn er MOTTAKER
};

export const BidragsutregningSchema = z.object({
  resultater: z.array(
    z.object({
      ident: z.string(),
      fulltNavn: z.string(),
      fornavn: z.string(),
      sum: z.number(),
      bidragstype: z.enum(["PLIKTIG", "MOTTAKER"]),
    }),
  ),
});

export type Bidragsutregning = z.infer<typeof BidragsutregningSchema>;
