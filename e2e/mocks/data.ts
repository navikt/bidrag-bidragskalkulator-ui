import type {
  MockBidragsutregning,
  MockManuellBidragsutregning,
  MockManuellPersoninformasjon,
  MockPersoninformasjon,
} from "./typer";

/**
 * Default mock data for person information endpoint
 */
export const defaultPersoninformasjon: MockPersoninformasjon = {
  person: {
    ident: "12345678901",
  },
  inntekt: 500000,
  barnerelasjoner: [
    {
      motpart: {
        ident: "98765432109",
      },
      fellesBarn: [
        {
          ident: "11111111111",
          fornavn: "Test",
          fulltNavn: "Test Testersen",
          alder: 8,
          underholdskostnad: 3000,
        },
        {
          ident: "22222222222",
          fornavn: "Anna",
          fulltNavn: "Anna Testersen",
          alder: 12,
          underholdskostnad: 3500,
        },
      ],
    },
  ],
  underholdskostnader: {
    "11111111111": 3000,
    "22222222222": 3500,
  },
};

/**
 * Default mock data for manual person information endpoint
 */
export const defaultManuellPersoninformasjon: MockManuellPersoninformasjon = {
  person: {
    ident: "12345678901",
  },
  inntekt: 500000,
  underholdskostnader: {
    default: 3000,
  },
};

/**
 * Default mock data for bidrag calculation endpoint
 */
export const defaultBidragsutregning: MockBidragsutregning = {
  resultater: [
    {
      ident: "11111111111",
      fulltNavn: "Test Testersen",
      fornavn: "Test",
      sum: 2500,
      bidragstype: "PLIKTIG",
    },
    {
      ident: "22222222222",
      fulltNavn: "Anna Testersen",
      fornavn: "Anna",
      sum: 3000,
      bidragstype: "PLIKTIG",
    },
  ],
};

/**
 * Default mock data for manual bidrag calculation endpoint
 */
export const defaultManuellBidragsutregning: MockManuellBidragsutregning = {
  resultater: [
    {
      alder: 8,
      sum: 700,
      bidragstype: "MOTTAKER",
    },
  ],
};

/**
 * Generate mock person information with custom overrides
 */
export function generatePersoninformasjon(
  overrides?: Partial<MockPersoninformasjon>,
): MockPersoninformasjon {
  return {
    ...defaultPersoninformasjon,
    ...overrides,
    person: {
      ...defaultPersoninformasjon.person,
      ...overrides?.person,
    },
    barnerelasjoner:
      overrides?.barnerelasjoner || defaultPersoninformasjon.barnerelasjoner,
  };
}

/**
 * Generate mock manual person information with custom overrides
 */
export function generateManuellPersoninformasjon(
  overrides?: Partial<MockManuellPersoninformasjon>,
): MockManuellPersoninformasjon {
  return {
    ...defaultManuellPersoninformasjon,
    ...overrides,
    person: {
      ...defaultManuellPersoninformasjon.person,
      ...overrides?.person,
    },
  };
}

/**
 * Generate mock bidrag calculation with custom overrides
 */
export function generateBidragsutregning(
  overrides?: Partial<MockBidragsutregning>,
): MockBidragsutregning {
  return {
    ...defaultBidragsutregning,
    ...overrides,
    resultater: overrides?.resultater || defaultBidragsutregning.resultater,
  };
}

/**
 * Generate mock manual bidrag calculation with custom overrides
 */
export function generateManuellBidragsutregning(
  overrides?: Partial<MockManuellBidragsutregning>,
): MockManuellBidragsutregning {
  return {
    ...defaultManuellBidragsutregning,
    ...overrides,
    resultater:
      overrides?.resultater || defaultManuellBidragsutregning.resultater,
  };
}
