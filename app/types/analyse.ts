export type Skjemanavn =
  | "Kalkulator barnebidrag under 18 år"
  | "Privat avtale under 18 år";

export type SkjemaIdKalkulator = "barnebidragskalkulator-under-18";
export type SkjemaIdPrivatAvtale = "barnebidrag-privat-avtale-under-18";

export type SkjemaId = SkjemaIdKalkulator | SkjemaIdPrivatAvtale;

export const skjemanavnMapping: Record<SkjemaId, Skjemanavn> = {
  "barnebidragskalkulator-under-18": "Kalkulator barnebidrag under 18 år",
  "barnebidrag-privat-avtale-under-18": "Privat avtale under 18 år",
};

type SkjemaValideringFeilet = {
  hendelsetype: "skjema validering feilet";
  skjemaId: SkjemaId;
  førsteFeil: string | null;
};

type SkjemaInnsendingFeilet = {
  hendelsetype: "skjema innsending feilet";
  skjemaId: SkjemaId;
  feil: string | undefined;
};

type SkjemaFullført = {
  hendelsetype: "skjema fullført";
  skjemaId: SkjemaId;
};

type SamværsfradraginfoUtvidet = {
  hendelsetype: "infoboks om samværsfradrag utvidet";
  skjemaId: SkjemaIdKalkulator;
};

type FerieOgSamværinfoUtvidet = {
  hendelsetype: "infoboks om ferie og samvær utvidet";
  skjemaId: SkjemaIdKalkulator;
};

type BeregningsdetaljerUtvidet = {
  hendelsetype: "beregningsdetaljer utvidet";
  skjemaId: SkjemaIdKalkulator;
};

type BeregningsdetaljerKollapset = {
  hendelsetype: "beregningsdetaljer kollapset";
  skjemaId: SkjemaIdKalkulator;
};

type InntektsinformasjonUtvidet = {
  hendelsetype: "inntektsinformasjon utvidet";
  skjemaId: SkjemaIdKalkulator;
};

type BarnLagtTil = {
  hendelsetype: "barn lagt til";
  skjemaId: SkjemaId;
  antall: number;
};

type BarnFjernet = {
  hendelsetype: "barn fjernet";
  skjemaId: SkjemaId;
  antall: number;
};

type LagPrivatAvtaleKlikket = {
  hendelsetype: "lag privat avtale klikket";
  bidragstype: "MOTTAKER_OG_PLIKTIG" | "MOTTAKER" | "PLIKTIG" | "INGEN";
};

type SkjemaSpørsmålBesvart = {
  hendelsetype: "skjema spørsmål besvart";
  skjemaId: SkjemaId;
  spørsmålId: string;
  spørsmål: string;
};

export type Sporingshendelse =
  | SkjemaValideringFeilet
  | SkjemaInnsendingFeilet
  | SkjemaFullført
  | SamværsfradraginfoUtvidet
  | FerieOgSamværinfoUtvidet
  | BeregningsdetaljerUtvidet
  | BeregningsdetaljerKollapset
  | InntektsinformasjonUtvidet
  | BarnLagtTil
  | BarnFjernet
  | SkjemaSpørsmålBesvart
  | LagPrivatAvtaleKlikket;
