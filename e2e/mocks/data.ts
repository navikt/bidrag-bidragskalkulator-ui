import type { Barnebidragsutregning } from "~/features/skjema/beregning/schema";

const boOgForbruksutgifter = {
  "0": 6892.0,
  "1": 6892.0,
  "2": 6892.0,
  "3": 6892.0,
  "4": 6892.0,
  "5": 6892.0,
  "6": 8659.0,
  "7": 8659.0,
  "8": 8659.0,
  "9": 8659.0,
  "10": 8659.0,
  "11": 9833.0,
  "12": 9833.0,
  "13": 9833.0,
  "14": 9833.0,
  "15": 10913.0,
  "16": 10913.0,
  "17": 10913.0,
  "18": 12881.0,
  "19": 12881.0,
  "20": 12881.0,
  "21": 12881.0,
  "22": 12881.0,
  "23": 12881.0,
  "24": 12881.0,
  "25": 12881.0,
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

export const kalkulatorGrunnlagsdata = {
  boOgForbruksutgifter,
  samværsfradrag,
};

/**
 * Default mock data for manual bidragkalkuleringsendpoint
 */
export const defaultBidragsutregning: Barnebidragsutregning = {
  resultater: [
    {
      fødselsdato: "2015-06-15",
      sum: 760,
    },
  ],
};

export const genererKalkulatorGrunnlagsdata = () => kalkulatorGrunnlagsdata;

/**
 * Genererer mock bidragsutregning med mulighet for å overstyre verdier
 */
export function genererBidragsutregning(
  overrides?: Partial<Barnebidragsutregning>,
): Barnebidragsutregning {
  return {
    ...defaultBidragsutregning,
    ...overrides,
    resultater: overrides?.resultater || defaultBidragsutregning.resultater,
  };
}
