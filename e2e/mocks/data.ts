import type {
  Bidragsutregning,
  ManuellBidragsutregning,
} from "~/features/skjema/beregning/schema";
import type {
  ManuellPersoninformasjon,
  Personinformasjon,
} from "~/features/skjema/personinformasjon/schema";

const underholdskostnader = {
  "0": 8313,
  "1": 6547,
  "2": 6547,
  "3": 6547,
  "4": 6547,
  "5": 6547,
  "6": 6547,
  "7": 8471,
  "8": 8471,
  "9": 8471,
  "10": 8471,
  "11": 8471,
  "12": 9673,
  "13": 9673,
  "14": 9673,
  "15": 9673,
  "16": 10778,
  "17": 10778,
  "18": 12288,
  "19": 12288,
  "20": 12288,
  "21": 12288,
  "22": 12288,
  "23": 12288,
  "24": 12288,
  "25": 12288,
};
const samværsfradrag = [
  {
    alderFra: 0,
    alderTil: 5,
    beløpFradrag: {
      SAMVÆRSKLASSE_1: 317,
      SAMVÆRSKLASSE_2: 1048,
      SAMVÆRSKLASSE_3: 2847,
      SAMVÆRSKLASSE_4: 3574,
    },
  },
  {
    alderFra: 6,
    alderTil: 10,
    beløpFradrag: {
      SAMVÆRSKLASSE_1: 443,
      SAMVÆRSKLASSE_2: 1467,
      SAMVÆRSKLASSE_3: 3432,
      SAMVÆRSKLASSE_4: 4308,
    },
  },
  {
    alderFra: 11,
    alderTil: 14,
    beløpFradrag: {
      SAMVÆRSKLASSE_1: 547,
      SAMVÆRSKLASSE_2: 1813,
      SAMVÆRSKLASSE_3: 3914,
      SAMVÆRSKLASSE_4: 4913,
    },
  },
  {
    alderFra: 15,
    alderTil: 18,
    beløpFradrag: {
      SAMVÆRSKLASSE_1: 623,
      SAMVÆRSKLASSE_2: 2063,
      SAMVÆRSKLASSE_3: 4262,
      SAMVÆRSKLASSE_4: 5351,
    },
  },
  {
    alderFra: 19,
    alderTil: 99,
    beløpFradrag: {
      SAMVÆRSKLASSE_1: 623,
      SAMVÆRSKLASSE_2: 2063,
      SAMVÆRSKLASSE_3: 4262,
      SAMVÆRSKLASSE_4: 5351,
    },
  },
];

/**
 * Default mock data for personinformasjon endepunkt
 */
export const defaultPersoninformasjon: Personinformasjon = {
  person: {
    ident: "12345678901",
  },
  inntekt: 500000,
  barnerelasjoner: [],
  underholdskostnader,
  samværsfradrag,
};

/**
 * Default mock data for manuell personinformasjon endepunkt
 */
export const defaultManuellPersoninformasjon: ManuellPersoninformasjon = {
  person: {
    ident: "12345678901",
  },
  inntekt: 500000,
  underholdskostnader,
  samværsfradrag,
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
