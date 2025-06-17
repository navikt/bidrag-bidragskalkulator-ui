import { PersonCrossIcon } from "@navikt/aksel-icons";
import {
  Alert,
  BodyLong,
  BodyShort,
  Button,
  Radio,
  RadioGroup,
  ReadMore,
  TextField,
} from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { useMemo, useState } from "react";
import { Slider } from "~/components/ui/slider";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import { usePersoninformasjon } from "../personinformasjon/usePersoninformasjon";
import type { FastBosted, ManueltSkjema } from "../schema";
import {
  kalkulerSamværsklasse,
  SAMVÆR_STANDARDVERDI,
  tilUnderholdskostnadsgruppeMedLabel,
} from "../utils";

const BOSTED_OPTIONS: FastBosted[] = [
  "DELT_FAST_BOSTED",
  "IKKE_DELT_FAST_BOSTED",
];

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const EnkeltbarnSkjema = ({ barnIndex, onFjernBarn }: Props) => {
  const [fremhevUnderholdskostnad, settFremhevUnderholdskostnad] =
    useState(false);
  const { underholdskostnader } = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const alder = barnField.value("alder");
  const samvær = barnField.value("samvær") ?? SAMVÆR_STANDARDVERDI;

  const samværsgradBeskrivelse =
    samvær === "1"
      ? t(tekster.samvær.enNatt)
      : t(tekster.samvær.netter(samvær));

  const bosted = barnField.value("bosted");
  const borHosEnForelder = bosted === "IKKE_DELT_FAST_BOSTED";
  const harAvtaleOmFastDeltBosted = bosted === "DELT_FAST_BOSTED";
  // TODO: Fiks typefeil
  const samværsklasse = kalkulerSamværsklasse(Number(samvær), bosted as any);

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  const handleChangeAlder = () => settFremhevUnderholdskostnad(false);

  const handleBlurAlder = (event: React.FocusEvent<HTMLInputElement>) => {
    const alder = event.target.value;
    if (!!alder) {
      settFremhevUnderholdskostnad(true);
    }
  };

  const underholdskostnadsgrupper = useMemo(
    () =>
      tilUnderholdskostnadsgruppeMedLabel(underholdskostnader, {
        årEntall: t(tekster.år.entall),
        årFlertall: t(tekster.år.flertall),
      }),
    [underholdskostnader, t],
  );

  const visSamværsfradragInformasjon = alder !== "" && borHosEnForelder;
  const visDeltFastBostedInformasjon =
    alder !== "" && harAvtaleOmFastDeltBosted;
  const erBidragspliktig = borHosEnForelder && Number(samvær) > 15;

  return (
    <fieldset className="p-0 space-y-4">
      <legend className="sr-only">{overskrift}</legend>
      <TextField
        {...barnField.field("alder").getInputProps({
          onBlur: handleBlurAlder,
          onChange: handleChangeAlder,
          label: t(tekster.alder.label),
        })}
        error={barnField.field("alder").error()}
        htmlSize={8}
        inputMode="numeric"
        autoComplete="off"
      />

      <ReadMore header={t(tekster.alder.lesMer.tittel)}>
        <BodyLong className="mb-2">
          {t(tekster.alder.lesMer.beskrivelse)}
        </BodyLong>
        <ul>
          {underholdskostnadsgrupper.map(
            ({ label, underholdskostnad, aldre }) => {
              const fremhevGruppe =
                fremhevUnderholdskostnad && aldre.includes(Number(alder));
              return (
                <li key={label}>
                  <span
                    className={fremhevGruppe ? "font-bold" : undefined}
                  >{`${label}: ${formatterSum(underholdskostnad)}`}</span>
                </li>
              );
            },
          )}
        </ul>
      </ReadMore>

      <RadioGroup
        {...barnField.field("bosted").getInputProps()}
        error={barnField.field("bosted").error()}
        legend={t(tekster.bosted.label)}
      >
        {BOSTED_OPTIONS.map((bosted) => {
          return (
            <Radio value={bosted} key={bosted}>
              {t(tekster.bosted.valg[bosted])}
            </Radio>
          );
        })}
      </RadioGroup>

      {borHosEnForelder && (
        <Slider
          {...barnField.field("samvær").getControlProps()}
          label={t(tekster.samvær.label)}
          description={t(tekster.samvær.beskrivelse)}
          error={barnField.field("samvær").error()}
          min={0}
          max={30}
          step={1}
          list={[
            {
              label: t(tekster.samvær.beskrivelser.ingenNetterHosDeg),
              value: 0,
            },
            {
              label: t(tekster.samvær.beskrivelser.halvpartenAvTidenHosDeg),
              value: 15,
            },
            {
              label: t(tekster.samvær.beskrivelser.alleNetterHosDeg),
              value: 30,
            },
          ]}
          valueDescription={
            samværsgradBeskrivelse +
            ` (${t(tekster.samvær.samværsklasse[samværsklasse])})`
          }
        />
      )}
      {visDeltFastBostedInformasjon ? (
        <Alert variant="info">
          <BodyShort>{t(tekster.fradragsinformasjon.deltFastBosted)}</BodyShort>
        </Alert>
      ) : visSamværsfradragInformasjon ? (
        <Alert variant="info">
          <BodyShort>
            {t(
              erBidragspliktig
                ? tekster.fradragsinformasjon.samværsfradrag.mottaker(
                    samværsklasse,
                    "1 000 kr", // TODO: Finn riktig verdi
                  )
                : tekster.fradragsinformasjon.samværsfradrag.pliktig(
                    samværsklasse,
                    "1 000 kr", // TODO: Finn riktig verdi
                  ),
            )}
          </BodyShort>
        </Alert>
      ) : null}
      {onFjernBarn && (
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={onFjernBarn}
          icon={<PersonCrossIcon aria-hidden />}
        >
          {t(tekster.fjernBarn)}
        </Button>
      )}
    </fieldset>
  );
};

const tekster = definerTekster({
  overskrift: {
    barn: (nummer) => ({
      nb: `Barn ${nummer}`,
      en: `Child ${nummer}`,
      nn: `Barn ${nummer}`,
    }),
  },
  alder: {
    label: {
      nb: "Hvor gammelt er barnet?",
      en: "How old is the child?",
      nn: "Hvor gammalt er barnet?",
    },
    lesMer: {
      tittel: {
        nb: "Hvorfor vi spør om alder",
        en: "Why we ask about age",
        nn: "Kvifor vi spør om alder",
      },
      beskrivelse: {
        nb: "Det viktigste grunnlaget for beregningen er hva et barn koster – også kjent som underholdskostnader. Disse summene hentes fra SIFOs referansebudsjetter, og oppdateres hvert år. Underholdskostnaden for barn i ulike aldre er i dag:",
        en: "The most important basis for the calculation is what a child costs – also known as child support costs. These amounts are taken from SIFOs reference budgets and are updated annually. The maintenance cost for children of different ages is currently:",
        nn: "Det viktigaste grunnlaget for berekninga er kva eit barn kostar – også kjent som underhaldskostnader. Desse summane hentar vi frå SIFOs referansebudsjett, og oppdaterer kvart år. Underhaldskostnaden for barn i ulike aldrar er i dag:",
      },
    },
  },
  bosted: {
    label: {
      nb: "Hvor skal barnet bo fast?",
      en: "Where will the child have a permanent address?",
      nn: "Kvar skal barnet bu fast?",
    },
    valg: {
      velg: {
        nb: "Velg hvor barnet skal bo",
        en: "Select where the child will live",
        nn: "Velg kvar barnet skal bu",
      },
      DELT_FAST_BOSTED: {
        nb: "Vi har avtale om fast bosted hos begge (delt fast bosted)",
        en: "We have an agreement on permanent residence with both of us (shared permanent residence)",
        nn: "Vi har avtale om fast bustad hos begge (delt fast bustad)",
      },
      IKKE_DELT_FAST_BOSTED: {
        nb: "Vi har avtale om fast bosted hos én og samvær med den andre",
        en: "We have an agreement on permanent residence with one and visitation with the other",
        nn: "Vi har avtale om fast bustad hos éin og samvær med den andre",
      },
      hosDenAndre: (navn) => ({
        nb: `Barnet bor hos ${navn}`,
        en: `The child lives with ${navn}`,
        nn: `Barnet bur hos ${navn}`,
      }),
    },
  },
  samvær: {
    label: {
      nb: "Hvor mye vil barnet være sammen med deg?",
      en: "How much will the child stay with you?",
      nn: "Kor mykje vil barnet vere saman med deg?",
    },
    beskrivelse: {
      nb: "Estimer hvor mange netter barnet vil være hos deg i snitt per måned",
      en: "Estimate how many nights the child will stay with you on average per month",
      nn: "Estimer kor mange netter barnet vil vere hos deg i snitt per månad",
    },
    netter: (antall) => ({
      nb: `${antall} netter hos deg`,
      en: `${antall} nights with you`,
      nn: `${antall} netter hos deg`,
    }),
    enNatt: {
      nb: "1 natt hos deg",
      en: "1 night with you",
      nn: "1 natt hos deg",
    },
    beskrivelser: {
      ingenNetterHosDeg: {
        nb: "Ingen netter hos deg",
        en: "No nights with you",
        nn: "Ingen netter hos deg",
      },
      halvpartenAvTidenHosDeg: {
        nb: "Halvparten av nettene hos deg",
        en: "Half the nights with you",
        nn: "Halvparten av nettene hos deg",
      },
      alleNetterHosDeg: {
        nb: "Alle netter hos deg",
        en: "All the nights with you",
        nn: "Alle netter hos deg",
      },
    },
    samværsklasse: {
      SAMVÆRSKLASSE_0: {
        nb: "samværsklasse 0",
        en: "visitation class 0",
        nn: "samværsklasse 0",
      },
      SAMVÆRSKLASSE_1: {
        nb: "samværsklasse 1",
        en: "visitation class 1",
        nn: "samværsklasse 1",
      },
      SAMVÆRSKLASSE_2: {
        nb: "samværsklasse 2",
        en: "visitation class 2",
        nn: "samværsklasse 2",
      },
      SAMVÆRSKLASSE_3: {
        nb: "samværsklasse 3",
        en: "visitation class 3",
        nn: "samværsklasse 3",
      },
      SAMVÆRSKLASSE_4: {
        nb: "samværsklasse 4",
        en: "visitation class 4",
        nn: "samværsklasse 4",
      },
      DELT_BOSTED: {
        nb: "delt bosted",
        en: "shared residence",
        nn: "delt bustad",
      },
    },
  },
  fradragsinformasjon: {
    deltFastBosted: {
      nb: "Når man har avtale om delt fast bosted, baseres ikke barnebidraget på hvor mye man bor sammen med barnet, men heller forskjellen i inntekt mellom foreldrene.",
      en: "When there is an agreement on shared permanent residence, child support is not based on how much one lives with the child, but rather the difference in income between the parents.",
      nn: "Når ein har avtale om delt fast bustad, er ikkje barnebidraget basert på kor mykje ein bur saman med barnet, men heller forskjellen i inntekt mellom foreldra.",
    },
    samværsfradrag: {
      mottaker: (samværsklasse, fradrag) => ({
        nb: `Når barnet bor fast hos deg, kan medforelderen ha rett til et samværsfradrag. Dette fradraget er ${fradrag} i ${samværsklasse}.`,
        en: `When the child lives permanently with you, the other parent may be entitled to a visitation deduction. This deduction is ${fradrag} in ${samværsklasse}.`,
        nn: `Når barnet bur fast hos deg, kan medforelderen ha rett til eit samværsfradrag. Dette frådraget er ${fradrag} i ${samværsklasse}.`,
      }),
      pliktig: (samværsklasse, fradrag) => ({
        nb: `Når barnet bor fast hos den andre forelderen, kan du ha rett til et samværsfradrag. Dette fradraget er ${fradrag} i ${samværsklasse}.`,
        en: `When the child lives permanently with the other parent, you may be entitled to a visitation deduction. This deduction is ${fradrag} in ${samværsklasse}.`,
        nn: `Når barnet bur fast hos den andre forelderen, kan du ha rett til eit samværsfradrag. Dette frådraget er ${fradrag} i ${samværsklasse}.`,
      }),
    },
  },
  år: {
    entall: {
      nb: "år",
      en: "year",
      nn: "år",
    },
    flertall: {
      nb: "år",
      en: "years",
      nn: "år",
    },
  },
  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
});
