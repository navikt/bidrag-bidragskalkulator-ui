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

export type LesMerUtvidet = {
  hendelsetype: "les mer utvidet";
  /**
   * Teksten man trykker på for å lese mer
   */
  tekst: string;
  id:
    | "kalkulator-barnets-alder"
    | "kalkulator-bosted-og-samvær"
    | "kalkulator-ferie-og-samvær"
    | "kalkulator-beregningsdetaljer"
    | "kalkulator-inntekt";
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
  /**
   * Svaret som er fylt ut.
   * OBS! Husk personvern, brukes unntaksvis
   */
  svar?: string;
};

type GåTilKalkulatorKlikket = {
  hendelsetype: "gå til kalkulator klikket";
  kalkulatorversjon: "ny" | "gammel";
};

export type Sporingshendelse =
  | SkjemaValideringFeilet
  | SkjemaInnsendingFeilet
  | SkjemaFullført
  | LesMerUtvidet
  | BarnLagtTil
  | BarnFjernet
  | SkjemaSpørsmålBesvart
  | GåTilKalkulatorKlikket
  | LagPrivatAvtaleKlikket;
