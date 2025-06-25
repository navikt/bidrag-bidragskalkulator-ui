import type z from "zod";
import type { Samværsklasse } from "./beregning/schema";
import type {
  Barn,
  ManuellPersoninformasjon,
  Personinformasjon,
} from "./personinformasjon/schema";
import type {
  FastBosted,
  InnloggetBarnSkjema,
  InnloggetSkjema,
  ManueltSkjema,
} from "./schema";

export const SAMVÆR_STANDARDVERDI = "15";

export const tilInnloggetBarnSkjema = (person: Barn): InnloggetBarnSkjema => {
  return {
    ident: person.ident,
    bosted: "",
    samvær: SAMVÆR_STANDARDVERDI,
    barnetilsynsutgift: "",
  };
};

export const getInnloggetSkjemaStandardverdi = (
  personinformasjon: Personinformasjon,
): InnloggetSkjema => {
  const harKunEnMotpart = personinformasjon.barnerelasjoner.length === 1;

  const motpartIdent = harKunEnMotpart
    ? (personinformasjon.barnerelasjoner[0].motpart?.ident ?? "")
    : "";

  const barn = harKunEnMotpart
    ? personinformasjon.barnerelasjoner[0].fellesBarn.map(
        tilInnloggetBarnSkjema,
      )
    : [];

  return {
    motpartIdent,
    barn,
    deg: {
      inntekt: String(personinformasjon.inntekt ?? ""),
      antallBarnBorFast: "",
      antallBarnDeltBosted: "",
      borMedAnnenVoksen: "",
    },
    medforelder: {
      inntekt: "",
      antallBarnBorFast: "",
      antallBarnDeltBosted: "",
      borMedAnnenVoksen: "",
    },
  };
};

type Underholdskostnadsgrupper = {
  underholdskostnad: number;
  aldre: number[];
}[];

const tilUnderholdskostnadsgrupper = (
  underholdskostnader: Record<string, number>,
): Underholdskostnadsgrupper => {
  const underholdskostnadAldreListe = Object.entries(underholdskostnader)
    .map(([alder, underholdskostnad]) => [Number(alder), underholdskostnad])
    .sort(([a], [b]) => a - b);

  const initiellListe: Underholdskostnadsgrupper = [];

  const aldersgrupperOgUnderholdskostnad = underholdskostnadAldreListe.reduce(
    (underholdskostnadsgrupper, [alder, underholdskostnad]) => {
      const forrigeGruppe =
        underholdskostnadsgrupper[underholdskostnadsgrupper.length - 1];

      const harSammeKostnadSomForrige =
        forrigeGruppe?.underholdskostnad === underholdskostnad;

      if (harSammeKostnadSomForrige) {
        return [
          ...underholdskostnadsgrupper.slice(0, -1),
          {
            underholdskostnad: underholdskostnad,
            aldre: [...forrigeGruppe.aldre, alder],
          },
        ];
      }

      return [
        ...underholdskostnadsgrupper,
        {
          underholdskostnad: underholdskostnad,
          aldre: [alder],
        },
      ];
    },
    initiellListe,
  );

  return aldersgrupperOgUnderholdskostnad;
};

export const tilUnderholdskostnadsgruppeMedLabel = (
  underholdskostnader: Record<string, number>,
  tekster: {
    årEntall: string;
    årFlertall: string;
  },
): { label: string; underholdskostnad: number; aldre: number[] }[] => {
  const grupper = tilUnderholdskostnadsgrupper(underholdskostnader);

  return grupper.map(({ aldre, underholdskostnad }) => {
    const lavesteAlder = Math.min(...aldre);
    const høyesteAlder = Math.max(...aldre);

    const label =
      lavesteAlder === høyesteAlder
        ? `${lavesteAlder} ${lavesteAlder === 1 ? tekster.årEntall : tekster.årFlertall}`
        : `${lavesteAlder}-${høyesteAlder} ${tekster.årFlertall}`;

    return {
      label,
      underholdskostnad,
      aldre,
    };
  });
};

export const hentManueltSkjemaStandardverdi = (
  personinformasjon: ManuellPersoninformasjon,
): ManueltSkjema => {
  return {
    barn: [
      {
        navn: "",
        alder: "",
        bosted: "",
        samvær: SAMVÆR_STANDARDVERDI,
        barnetilsynsutgift: "",
      },
    ],
    deg: {
      inntekt: String(personinformasjon.inntekt ?? ""),
      antallBarnBorFast: "",
      antallBarnDeltBosted: "",
      borMedAnnenVoksen: "",
    },
    medforelder: {
      inntekt: "",
      antallBarnBorFast: "",
      antallBarnDeltBosted: "",
      borMedAnnenVoksen: "",
    },
  };
};

/**
 * Kalkulerer samværsklasse basert på hvor mange netter barnet bor hos forelderen
 */
export function kalkulerSamværsklasse(
  samværsgrad: number,
  bostatus: z.infer<typeof FastBosted>,
): Samværsklasse {
  if (bostatus === "DELT_FAST_BOSTED") {
    return "DELT_BOSTED";
  }
  if (samværsgrad === 0 || samværsgrad === 30) {
    return "SAMVÆRSKLASSE_0";
  }
  if (samværsgrad <= 3 || samværsgrad >= 27) {
    return "SAMVÆRSKLASSE_1";
  }
  if (samværsgrad <= 8 || samværsgrad >= 22) {
    return "SAMVÆRSKLASSE_2";
  }
  if (samværsgrad <= 13 || samværsgrad >= 17) {
    return "SAMVÆRSKLASSE_3";
  }
  return "SAMVÆRSKLASSE_4";
}

/**
 * Avgjør om forelderen er mottaker eller pliktig basert på samværsgrad
 */
export function kalkulerBidragstype(
  bostatus: z.infer<typeof FastBosted>,
  inntektForelder1: number,
  inntektForelder2: number,
): "MOTTAKER" | "PLIKTIG" {
  if (bostatus === "DELT_FAST_BOSTED") {
    return inntektForelder1 > inntektForelder2 ? "PLIKTIG" : "MOTTAKER";
  }
  return bostatus === "HOS_MEG" ? "MOTTAKER" : "PLIKTIG";
}

export const finnBarnBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon,
) => {
  return personinformasjon.barnerelasjoner
    .flatMap((relasjon) => relasjon.fellesBarn)
    .find((barn) => barn.ident === ident);
};

export const finnMotpartBasertPåIdent = (
  ident: string,
  personinformasjon: Personinformasjon,
) => {
  return personinformasjon.barnerelasjoner.find(
    (relasjon) => relasjon.motpart?.ident === ident,
  )?.motpart;
};
