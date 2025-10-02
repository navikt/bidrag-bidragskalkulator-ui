import type { Barnebidragsutregning } from "~/features/skjema/beregning/schema";

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

export const kalkulatorGrunnlagsdata = {
  underholdskostnader,
  samværsfradrag,
};

/**
 * Default mock data for manual bidragkalkuleringsendpoint
 */
export const defaultBidragsutregning: Barnebidragsutregning = {
  resultater: [
    {
      alder: 8,
      sum: 760,
      bidragstype: "MOTTAKER",
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
