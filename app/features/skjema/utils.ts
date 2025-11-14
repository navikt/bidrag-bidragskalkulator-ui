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

export const SAMVÆR_STANDARDVERDI = "0";

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
      barnetilsynsutgift: "",
      harBarnepassutgift: "",
      mottarStønadTilBarnepass: "",
      barnepassPlass: "",
      harEgenInntekt: false,
      inntektPerMåned: "",
    },
  ],
  deg: {
    inntekt: "",
  },
  medforelder: {
    inntekt: "",
  },
  dittBoforhold: {
    borMedAnnenVoksen: "",
    borMedAndreBarn: "",
    antallBarnBorFast: "",
    antallBarnDeltBosted: "",
  },
  medforelderBoforhold: {
    borMedAnnenVoksen: "",
    borMedAndreBarn: "",
    antallBarnBorFast: "",
    antallBarnDeltBosted: "",
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

export const beregnBidragstypeFraNetter = (
  antallNetterHosMeg: number,
): "PLIKTIG" | "MOTTAKER" => (antallNetterHosMeg < 15 ? "PLIKTIG" : "MOTTAKER");

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

  // Finn hvem som er bidragspliktig
  const bidragstype = beregnBidragstypeFraNetter(antallNetterHosMeg);

  // Beregn netter hos bidragspliktig
  const netterHosBidragspliktig =
    bidragstype === "PLIKTIG" ? antallNetterHosMeg : 30 - antallNetterHosMeg;

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
  antallNetterHosMeg: number,
  bostatus: z.infer<typeof FastBostedSchema>,
  inntektMeg: number,
  inntektMedforelder: number,
): "MOTTAKER" | "PLIKTIG" {
  if (bostatus === "DELT_FAST_BOSTED") {
    return inntektMeg > inntektMedforelder ? "PLIKTIG" : "MOTTAKER";
  }

  // HAR_SAMVÆRSAVTALE
  if (antallNetterHosMeg > 15) return "MOTTAKER";
  if (antallNetterHosMeg < 15) return "PLIKTIG";

  // Eksakt 15 netter
  return inntektMeg > inntektMedforelder ? "PLIKTIG" : "MOTTAKER";
}

export const beregnBidragstypeForAlleBarn = (
  barn: BarnebidragSkjema["barn"],
  degInntekt?: number,
  medforelderInntekt?: number,
): "MOTTAKER" | "PLIKTIG" | "BEGGE" | "" => {
  if (barn.length === 0 || !barn[0]?.bosted) {
    return "";
  }

  const bidragstyper = barn.map((b) => {
    if (b.bosted === "DELT_FAST_BOSTED") {
      if (degInntekt && medforelderInntekt) {
        return kalkulerBidragstype(
          15,
          b.bosted,
          degInntekt,
          medforelderInntekt,
        );
      }
      return "";
    }

    return beregnBidragstypeFraNetter(Number(b.samvær));
  });

  const harMottaker = bidragstyper.includes("MOTTAKER");
  const harPliktig = bidragstyper.includes("PLIKTIG");

  if (harMottaker && harPliktig) {
    return "BEGGE";
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
