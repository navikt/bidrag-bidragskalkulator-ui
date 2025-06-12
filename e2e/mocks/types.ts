/**
 * Konfigurasjon for mock-data i e2e-tester
 */
export interface MockConfig {
  /**
   * Overstyr personinformasjon-responsen
   */
  personinformasjon?: Partial<MockPersoninformasjon>;

  /**
   * Overstyr den manuelle personinformasjon-responsen
   */
  manuellPersoninformasjon?: Partial<MockManuellPersoninformasjon>;

  /**
   * Overstyr den innloggede bidragsberegning-responsen
   */
  bidragsutregning?: Partial<MockBidragsutregning>;

  /**
   * Overstyr den manuelle bidragsberegning-responsen
   */
  manuellBidragsutregning?: Partial<MockManuellBidragsutregning>;

  /**
   * Kontroller hvilke endepunkter som skal returnere feil
   */
  errors?: {
    personinformasjon?: { status: number; message?: string };
    manuellPersoninformasjon?: { status: number; message?: string };
    bidragsutregning?: { status: number; message?: string };
    manuellBidragsutregning?: { status: number; message?: string };
  };

  /**
   * Kunstige delays for simulerte responstider
   */
  delays?: {
    personinformasjon?: number;
    manuellPersoninformasjon?: number;
    bidragsutregning?: number;
    manuellBidragsutregning?: number;
  };
}

/**
 * Mock response data for personinformasjonsendepunktet
 */
export interface MockPersoninformasjon {
  person: {
    ident: string;
  };
  inntekt: number | null;
  barnerelasjoner: {
    motpart: { ident: string } | null;
    fellesBarn: {
      ident: string;
      fornavn: string;
      fulltNavn: string;
      alder: number;
      underholdskostnad: number;
    }[];
  }[];
  underholdskostnader: Record<string, number>;
}

/**
 * Mock response data for det manuelle personinformasjonsendepunktet
 */
export interface MockManuellPersoninformasjon {
  person: {
    ident: string;
  };
  inntekt: number | null;
  underholdskostnader: Record<string, number>;
}

/**
 * Mock response data for bidragskalkulasjonsendepunktet
 */
export interface MockBidragsutregning {
  resultater: {
    ident: string;
    fulltNavn: string;
    fornavn: string;
    sum: number;
    bidragstype: "PLIKTIG" | "MOTTAKER";
  }[];
}

/**
 * Mock response data for det manuelle bidragskalkulasjonsendepunktet
 */
export interface MockManuellBidragsutregning {
  resultater: {
    alder: number;
    sum: number;
    bidragstype: "PLIKTIG" | "MOTTAKER";
  }[];
}
