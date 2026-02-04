import { z } from "zod";
import type { Tilsynstype, VoksneOver18Type } from "../schema";

export type Boforhold = {
  antallBarnUnder18BorFast: number; // Antall barn under 18 år som bor fast hos forelderen
  voksneOver18Type: VoksneOver18Type[] | null; // Typer av voksne over 18 år som bor i husholdningen
  antallBarnOver18Vgs: number | null; // Antall barn over 18 år som går på videregående skole
};

export const BidragstypeSchema = z.enum(["MOTTAKER", "PLIKTIG"]);

export type Samværsklasse =
  | "SAMVÆRSKLASSE_0"
  | "SAMVÆRSKLASSE_1"
  | "SAMVÆRSKLASSE_2"
  | "SAMVÆRSKLASSE_3"
  | "SAMVÆRSKLASSE_4"
  | "DELT_BOSTED";

type Barnetilsyn = {
  månedligUtgift: number | null;
  plassType: Tilsynstype | null;
};

type Kontantstøtte = {
  beløp: number;
  deles: boolean;
};

type ForelderInntekt = {
  inntekt: number;
  nettoPositivKapitalinntekt: number;
};

type UtvidetBarnetrygd = {
  harUtvidetBarnetrygd: boolean;
  delerMedMedforelder: boolean;
};

export type Barnebidragsutregningsgrunnlag = {
  barn: {
    fødselsdato: string;
    samværsklasse: Samværsklasse;
    barnetilsyn: Barnetilsyn;
    inntekt: number;
    kontantstøtte: Kontantstøtte | null;
  }[];
  bidragspliktigInntekt: ForelderInntekt;
  bidragsmottakerInntekt: ForelderInntekt;
  dittBoforhold: Boforhold | null; // Boforhold for den påloggede personen. Må være satt hvis bidragstype for minst ett barn er PLIKTIG
  medforelderBoforhold: Boforhold | null; // Boforhold for den andre forelderen. Må være satt hvis bidragstype for minst ett barn er MOTTAKER
  småbarnstillegg: boolean;
  bidragstype: Bidragstype;
  utvidetBarnetrygd: UtvidetBarnetrygd;
};

const BarnebidragsutregningBarnSchema = z.object({
  alder: z.number(),
  sum: z.number(),
});

export const UtregningNavigasjonsdataSchema = z.object({
  barn: z.array(BarnebidragsutregningBarnSchema),
});

export const BarnebidragsutregningSchema = z.object({
  resultater: z.array(BarnebidragsutregningBarnSchema),
});

export type Bidragstype = z.infer<typeof BidragstypeSchema>;
export type Barnebidragsutregning = z.infer<typeof BarnebidragsutregningSchema>;
