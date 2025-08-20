import { z } from "zod";

type Boforhold = {
  antallBarnBorFast: number; // Antall barn under 18 år som bor fast hos forelderen
  antallBarnDeltBosted: number; // Antall barn under 18 år med delt bosted hos forelderen
  borMedAnnenVoksen: boolean;
};

export const BidragstypeSchema = z.enum(["MOTTAKER", "PLIKTIG"]);

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
    bidragstype: Bidragstype;
    barnetilsynsutgift: number;
  }[];
  inntektForelder1: number;
  inntektForelder2: number;
  dittBoforhold: Boforhold | null; // Boforhold for den påloggede personen. Må være satt hvis bidragstype for minst ett barn er PLIKTIG
  medforelderBoforhold: Boforhold | null; // Boforhold for den andre forelderen. Må være satt hvis bidragstype for minst ett barn er MOTTAKER
};

export type ManueltBidragsutregningsgrunnlag = {
  barn: {
    alder: number;
    samværsklasse: Samværsklasse;
    bidragstype: Bidragstype;
    barnetilsynsutgift: number;
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
      bidragstype: BidragstypeSchema,
    }),
  ),
});

export const BidragsutregningBarnSchema = z.object({
  alder: z.number(),
  sum: z.number(),
  bidragstype: BidragstypeSchema,
});

export const UtregningNavigasjonsdataSchema = z.object({
  barn: z.array(BidragsutregningBarnSchema),
});

export const ManuellBidragsutregningSchema = z.object({
  resultater: z.array(BidragsutregningBarnSchema),
});

export type Bidragstype = z.infer<typeof BidragstypeSchema>;
export type BidragsutregningBarn = z.infer<typeof BidragsutregningBarnSchema>;
export type Bidragsutregning = z.infer<typeof BidragsutregningSchema>;
export type ManuellBidragsutregning = z.infer<
  typeof ManuellBidragsutregningSchema
>;
export type UtregningNavigasjonsdata = z.infer<
  typeof UtregningNavigasjonsdataSchema
>;
