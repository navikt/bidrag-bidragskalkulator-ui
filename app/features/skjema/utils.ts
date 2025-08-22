import type z from "zod";
import { sporHendelse } from "~/utils/analytics";
import type { Samværsklasse } from "./beregning/schema";
import type { Barn, Personinformasjon } from "./personinformasjon/schema";
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
        : `${lavesteAlder}–${høyesteAlder} ${tekster.årFlertall}`;

    return {
      label,
      underholdskostnad,
      aldre,
    };
  });
};

export const MANUELT_SKJEMA_STANDARDVERDI: ManueltSkjema = {
  barn: [
    {
      alder: "",
      bosted: "",
      samvær: SAMVÆR_STANDARDVERDI,
      barnetilsynsutgift: "",
    },
  ],
  deg: {
    inntekt: "",
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

export const SAMVÆRSKLASSE_GRENSER = {
  SAMVÆRSKLASSE_0: {
    min: 0,
    max: 1,
    klassenummer: 0,
  },
  SAMVÆRSKLASSE_1: {
    min: 2,
    max: 3,
    klassenummer: 1,
  },
  SAMVÆRSKLASSE_2: {
    min: 4,
    max: 8,
    klassenummer: 2,
  },
  SAMVÆRSKLASSE_3: {
    min: 9,
    max: 13,
    klassenummer: 3,
  },
  SAMVÆRSKLASSE_4: {
    min: 14,
    max: 15,
    klassenummer: 4,
  },
} as const;

/**
 * Kalkulerer samværsklasse basert på hvor mange netter barnet bor hos forelderen og bosted
 */
export const kalkulerSamværsklasse = (
  antallNetterHosMeg: number,
  fastBosted: z.infer<typeof FastBosted>,
): Samværsklasse => {
  if (fastBosted === "DELT_FAST_BOSTED") {
    return "DELT_BOSTED";
  }

  const netterHosBidragspliktig =
    fastBosted === "HOS_MEG" ? 30 - antallNetterHosMeg : antallNetterHosMeg;

  for (const [klasse, grenser] of Object.entries(SAMVÆRSKLASSE_GRENSER)) {
    if (
      netterHosBidragspliktig >= grenser.min &&
      netterHosBidragspliktig <= grenser.max
    ) {
      return klasse as Samværsklasse;
    }
  }

  return "DELT_BOSTED";
};

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

export const sporKalkulatorSpørsmålBesvart =
  (spørsmål: string) => (event: React.FocusEvent<HTMLInputElement>) => {
    if (!!event.target.value) {
      sporHendelse({
        hendelsetype: "skjema spørsmål besvart",
        skjemaId: "barnebidragskalkulator-under-18",
        spørsmålId: event.target.name,
        spørsmål,
      });
    }
  };
