import type z from "zod";
import type { KalkulatorSpørsmålId } from "~/types/analyse";
import {
  sporHendelse,
  sporSkjemaseksjonFullførtEnGang,
} from "~/utils/analytics";
import { Språk } from "~/utils/i18n";
import type { Samværsklasse } from "./beregning/schema";
import {
  lagBarnSkjema,
  lagBoforholdSkjema,
  lagInntektSkjema,
  type BarnebidragSkjema,
  type FastBostedSchema,
} from "./schema";

export const SAMVÆR_STANDARDVERDI = "15";

type BoOgForbruksutgiftsgrupper = {
  boOgForbruksutgift: number;
  aldre: number[];
}[];

const tilBoOgForbruksutgiftsgrupper = (
  boOgForbruksutgifter: Record<string, number>,
): BoOgForbruksutgiftsgrupper => {
  const boOgForbruksutgifterAldreListe = Object.entries(boOgForbruksutgifter)
    .map(([alder, boOgForbruksutgift]) => [Number(alder), boOgForbruksutgift])
    .sort(([a], [b]) => a - b);

  const initiellListe: BoOgForbruksutgiftsgrupper = [];

  const aldersgrupperOgBoOgForbruksutgift =
    boOgForbruksutgifterAldreListe.reduce(
      (boOgForbruksutgiftsgrupper, [alder, boOgForbruksutgift]) => {
        const forrigeGruppe =
          boOgForbruksutgiftsgrupper[boOgForbruksutgiftsgrupper.length - 1];

        const harSammeKostnadSomForrige =
          forrigeGruppe?.boOgForbruksutgift === boOgForbruksutgift;

        if (harSammeKostnadSomForrige) {
          return [
            ...boOgForbruksutgiftsgrupper.slice(0, -1),
            {
              boOgForbruksutgift: boOgForbruksutgift,
              aldre: [...forrigeGruppe.aldre, alder],
            },
          ];
        }

        return [
          ...boOgForbruksutgiftsgrupper,
          {
            boOgForbruksutgift: boOgForbruksutgift,
            aldre: [alder],
          },
        ];
      },
      initiellListe,
    );

  return aldersgrupperOgBoOgForbruksutgift;
};

export const tilBoOgForbruksutgiftsgrupperMedLabel = (
  boOgForbruksutgifter: Record<string, number>,
  tekster: {
    årEntall: string;
    årFlertall: string;
  },
): { label: string; boOgForbruksutgift: number; aldre: number[] }[] => {
  const grupper = tilBoOgForbruksutgiftsgrupper(boOgForbruksutgifter);

  return grupper.map(({ aldre, boOgForbruksutgift }) => {
    const lavesteAlder = Math.min(...aldre);
    const høyesteAlder = Math.max(...aldre);

    const label =
      lavesteAlder === høyesteAlder
        ? `${lavesteAlder} ${lavesteAlder === 1 ? tekster.årEntall : tekster.årFlertall}`
        : `${lavesteAlder}–${høyesteAlder} ${tekster.årFlertall}`;

    return {
      label,
      boOgForbruksutgift,
      aldre,
    };
  });
};

export const BARNEBIDRAG_SKJEMA_STANDARDVERDI: BarnebidragSkjema = {
  bidragstype: "",
  barn: [
    {
      alder: "",
      bosted: "",
      samvær: SAMVÆR_STANDARDVERDI,
      harBarnetilsynsutgift: "undefined",
      mottarStønadTilBarnetilsyn: "undefined",
      barnetilsynsutgift: "",
      barnepassSituasjon: "",
      inntektPerMåned: "",
    },
  ],
  deg: {
    inntekt: "",
    kapitalinntekt: "",
    harKapitalinntektOver10k: "undefined",
  },
  medforelder: {
    inntekt: "",
    kapitalinntekt: "",
    harKapitalinntektOver10k: "undefined",
  },
  barnHarEgenInntekt: "undefined",
  dittBoforhold: {
    borMedAnnenVoksen: "undefined",
    borMedAndreBarn: "undefined",
    antallBarnBorFast: "",
    borMedAnnenVoksenType: [],
    borMedBarnOver18: "undefined",
    antallBarnOver18: "",
    andreBarnebidragerPerMåned: "",
  },
  medforelderBoforhold: {
    borMedAnnenVoksen: "undefined",
    borMedAndreBarn: "undefined",
    antallBarnBorFast: "",
    borMedAnnenVoksenType: [],
    borMedBarnOver18: "undefined",
    antallBarnOver18: "",
    andreBarnebidragerPerMåned: "",
  },
  ytelser: {
    mottarUtvidetBarnetrygd: "undefined",
    delerUtvidetBarnetrygd: "undefined",
    mottarSmåbarnstillegg: "undefined",
    kontantstøtte: {
      mottar: "undefined",
      deler: "undefined",
      beløp: "",
    },
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
  fastBosted: z.infer<typeof FastBostedSchema>,
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
  bostatus: z.infer<typeof FastBostedSchema>,
  inntektMeg: number,
  inntektMedforelder: number,
): "MOTTAKER" | "PLIKTIG" {
  if (bostatus === "DELT_FAST_BOSTED") {
    return inntektMeg > inntektMedforelder ? "PLIKTIG" : "MOTTAKER";
  }

  return bostatus === "HOS_MEG" ? "MOTTAKER" : "PLIKTIG";
}

export const beregnBidragstypeForAlleBarn = (
  barn: BarnebidragSkjema["barn"],
  degInntekt?: number,
  medforelderInntekt?: number,
): "MOTTAKER" | "PLIKTIG" | "" => {
  if (barn.length === 0 || !barn[0]?.bosted) {
    return "";
  }

  const bidragstyper = barn.map((b) => {
    if (b.bosted === "DELT_FAST_BOSTED") {
      if (degInntekt && medforelderInntekt) {
        return kalkulerBidragstype(b.bosted, degInntekt, medforelderInntekt);
      }
      return "";
    }

    return b.bosted === "HOS_MEG" ? "MOTTAKER" : "PLIKTIG";
  });

  const harMottaker = bidragstyper.includes("MOTTAKER");
  const harPliktig = bidragstyper.includes("PLIKTIG");

  // Hvis begge typer finnes, returner den første som ikke er tom
  // Dette tvinger brukeren til å velge én kategori
  if (harMottaker && harPliktig) {
    return bidragstyper.find((t) => t === "MOTTAKER" || t === "PLIKTIG") || "";
  }

  return bidragstyper[0] || "";
};

export const sporKalkulatorSpørsmålBesvart =
  (spørsmålId: KalkulatorSpørsmålId, spørsmål: string) =>
  (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    if (!!event.target.value) {
      sporHendelse({
        hendelsetype: "skjema spørsmål besvart",
        skjemaId: "barnebidragskalkulator-under-18",
        spørsmålId,
        spørsmål,
      });
    }
  };

const barnSkjemaSchema = lagBarnSkjema(Språk.NorwegianBokmål);
const boforholdSkjema = lagBoforholdSkjema(Språk.NorwegianBokmål);
const inntektSchema = lagInntektSkjema(Språk.NorwegianBokmål);

export const sporSkjemaseksjonFullført = (verdier: BarnebidragSkjema) => {
  const barnParseResult = barnSkjemaSchema.safeParse(verdier.barn?.[0]);
  const dittBoforholdParseResult = boforholdSkjema.safeParse(
    verdier.dittBoforhold,
  );
  const medforelderBoforholdParseResult = boforholdSkjema.safeParse(
    verdier.medforelderBoforhold,
  );
  const inntektDegParseResult = inntektSchema.safeParse(verdier.deg);
  const inntektMedforelderParseResult = inntektSchema.safeParse(
    verdier.medforelder,
  );

  if (barnParseResult.success) {
    sporSkjemaseksjonFullførtEnGang({
      hendelsetype: "skjemaseksjon fullført",
      skjemaId: "barnebidragskalkulator-under-18",
      seksjon: "BARN",
    });
  }

  if (
    dittBoforholdParseResult.success &&
    medforelderBoforholdParseResult.success
  ) {
    sporSkjemaseksjonFullførtEnGang({
      hendelsetype: "skjemaseksjon fullført",
      skjemaId: "barnebidragskalkulator-under-18",
      seksjon: "BOSITUASJON",
    });
  }

  if (inntektDegParseResult.success && inntektMedforelderParseResult.success) {
    sporSkjemaseksjonFullførtEnGang({
      hendelsetype: "skjemaseksjon fullført",
      skjemaId: "barnebidragskalkulator-under-18",
      seksjon: "INNTEKT",
    });
  }
};
