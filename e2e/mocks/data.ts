import type {
  Bidragsutregning,
  ManuellBidragsutregning,
} from "~/features/skjema/beregning/schema";
import type {
  ManuellPersoninformasjon,
  Personinformasjon,
} from "~/features/skjema/personinformasjon/schema";

/**
 * Default mock data for personinformasjon endepunkt
 */
export const defaultPersoninformasjon: Personinformasjon = {
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
 * Default mock data for manuell personinformasjon endepunkt
 */
export const defaultManuellPersoninformasjon: ManuellPersoninformasjon = {
  person: {
    ident: "12345678901",
  },
  inntekt: 500000,
  underholdskostnader: {
    default: 3000,
  },
};

/**
 * Default mock data for bidragkalkuleringsendpoint
 */
export const defaultBidragsutregning: Bidragsutregning = {
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
 * Default mock data for manual bidragkalkuleringsendpoint
 */
export const defaultManuellBidragsutregning: ManuellBidragsutregning = {
  resultater: [
    {
      alder: 8,
      sum: 700,
      bidragstype: "MOTTAKER",
    },
  ],
};

/**
 * Genererer mock personinformasjon med mulighet for å overstyre verdier
 */
export function genererPersoninformasjon(
  overrides?: Partial<Personinformasjon>,
): Personinformasjon {
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
 * Genererer mock manuell personinformasjon med mulighet for å overstyre verdier
 */
export function genererManuellPersoninformasjon(
  overrides?: Partial<ManuellPersoninformasjon>,
): ManuellPersoninformasjon {
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
 * Genererer mock autentisert bidragsutregning med mulighet for å overstyre verdier
 */
export function genererBidragsutregning(
  overrides?: Partial<Bidragsutregning>,
): Bidragsutregning {
  return {
    ...defaultBidragsutregning,
    ...overrides,
    resultater: overrides?.resultater || defaultBidragsutregning.resultater,
  };
}

/**
 * Genererer mock manuell bidragsutregning med mulighet for å overstyre verdier
 */
export function genererManuellBidragsutregning(
  overrides?: Partial<ManuellBidragsutregning>,
): ManuellBidragsutregning {
  return {
    ...defaultManuellBidragsutregning,
    ...overrides,
    resultater:
      overrides?.resultater || defaultManuellBidragsutregning.resultater,
  };
}
