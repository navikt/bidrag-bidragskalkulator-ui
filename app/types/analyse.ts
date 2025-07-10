type Skjemanavn =
  | "Kalkulator barnebidrag under 18 år"
  | "Privat avtale under 18 år";

type SkjemaId =
  | "barnebidragskalkulator-under-18"
  | "barnebidrag-privat-avtale-under-18";

type SkjemaValideringFeilet = {
  hendelsetype: "skjema validering feilet";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn; // TODO Finne en litt bedre måte å håndtere dette på
  førsteFeil: string | null;
};

type SkjemaInnsendingFeilet = {
  hendelsetype: "skjema innsending feilet";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
  feil: string;
};

type SkjemaFullført = {
  hendelsetype: "skjema fullført";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
};

type BeregningsdetaljerUtvidet = {
  hendelsetype: "beregningsdetaljer utvidet";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
};

type BeregningsdetaljerKollapset = {
  hendelsetype: "beregningsdetaljer kollapset";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
};
type InntektsinformasjonUtvidet = {
  hendelsetype: "inntektsinformasjon utvidet";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
};

type BarnLagtTil = {
  hendelsetype: "barn lagt til";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
  antall: number;
};

type BarnFjernet = {
  hendelsetype: "barn fjernet";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
  antall: number;
};

type LagPrivatAvtaleKlikket = {
  hendelsetype: "lag privat avtale klikket";
  bidragstype: "MOTTAKER_OG_PLIKTIG" | "MOTTAKER" | "PLIKTIG" | "INGEN";
};

type SkjemaSpørsmålBesvart = {
  hendelsetype: "skjema spørsmål besvart";
  skjemaId: SkjemaId;
  skjemanavn: Skjemanavn;
  spørsmålId: string;
  spørsmål: string;
};

export type Sporingshendelse =
  | SkjemaValideringFeilet
  | SkjemaInnsendingFeilet
  | SkjemaFullført
  | BeregningsdetaljerUtvidet
  | BeregningsdetaljerKollapset
  | InntektsinformasjonUtvidet
  | BarnLagtTil
  | BarnFjernet
  | SkjemaSpørsmålBesvart
  | LagPrivatAvtaleKlikket;
