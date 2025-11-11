import { PersonCrossIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, List, ReadMore, TextField } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useFormContext, useFormScope } from "@rvf/react";
import { useMemo } from "react";
import { useKalkulatorgrunnlagsdata } from "~/routes/kalkulator";
import { sporHendelse } from "~/utils/analytics";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import { FormattertTallTextField } from "../../components/ui/FormattertTallTextField";
import { Samvær } from "./samvær/Samvær";
import {
  MAKS_ALDER_BARNETILSYNSUTGIFT,
  type BarnebidragSkjema,
} from "./schema";
import {
  sporKalkulatorSpørsmålBesvart,
  tilBoOgForbruksutgiftsgrupperMedLabel,
} from "./utils";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const EnkeltbarnSkjema = ({ barnIndex, onFjernBarn }: Props) => {
  const {
    kalkulatorGrunnlagsdata: { boOgForbruksutgifter },
  } = useKalkulatorgrunnlagsdata();
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const alder = barnField.value("alder");
  const visSpørsmålOmBarnetilsynsutgift =
    barnField.field("alder").touched() &&
    Number(alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT;

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  const boOgForbruksutgiftsgrupper = useMemo(
    () =>
      tilBoOgForbruksutgiftsgrupperMedLabel(boOgForbruksutgifter, {
        årEntall: t(tekster.år.entall),
        årFlertall: t(tekster.år.flertall),
      }),
    [boOgForbruksutgifter, t],
  );

  return (
    <fieldset className="p-0 space-y-4">
      <legend className="sr-only">{overskrift}</legend>
      <TextField
        {...barnField.field("alder").getInputProps({
          label: t(tekster.alder.label),
          onBlur: sporKalkulatorSpørsmålBesvart(
            "barn-alder",
            t(tekster.alder.label),
          ),
        })}
        error={barnField.field("alder").error()}
        htmlSize={8}
        inputMode="numeric"
        autoComplete="off"
      />

      <ReadMore
        header={t(tekster.alder.lesMer.tittel)}
        onOpenChange={(open) => {
          if (open) {
            sporHendelse({
              hendelsetype: "les mer utvidet",
              tekst: t(tekster.alder.lesMer.tittel),
              id: "kalkulator-barnets-alder",
            });
          }
        }}
      >
        <BodyLong className="mb-6">
          {t(tekster.alder.lesMer.beskrivelse)}
        </BodyLong>
        <BodyLong className="mb-6" spacing>
          {t(tekster.alder.lesMer.beskrivelse2)}
        </BodyLong>
        <List>
          {boOgForbruksutgiftsgrupper.map(
            ({ label, boOgForbruksutgift, aldre }) => {
              const fremhevGruppe =
                barnField.field("alder").touched() &&
                aldre.includes(Number(alder));
              return (
                <ListItem key={label}>
                  <span
                    className={fremhevGruppe ? "font-bold" : undefined}
                  >{`${label}: ${formatterSum(boOgForbruksutgift)}`}</span>
                </ListItem>
              );
            },
          )}
        </List>
      </ReadMore>

      <Samvær barnIndex={barnIndex} />

      {visSpørsmålOmBarnetilsynsutgift && (
        <FormattertTallTextField
          {...barnField.field("barnetilsynsutgift").getControlProps()}
          label={t(tekster.barnetilsynsutgift.label)}
          onBlur={sporKalkulatorSpørsmålBesvart(
            "barn-barnepass",
            t(tekster.barnetilsynsutgift.label),
          )}
          description={t(tekster.barnetilsynsutgift.description)}
          htmlSize={18}
          error={barnField.field("barnetilsynsutgift").error()}
        />
      )}
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
      nb: `Hvor gammelt er barnet?`,
      en: `How old is the child?`,
      nn: `Kor gammalt er barnet?`,
    },
    lesMer: {
      tittel: {
        nb: "Hvorfor vi spør om alder",
        en: "Why we ask about age",
        nn: "Kvifor spør vi om alder",
      },
      beskrivelse: {
        nb: "Vi spør om alderen til barnet for å vise hvor mye det gjennomsnittlig koster å forsørge et barn. Kalkulatoren bruker faste satser basert på SIFOs referansebudsjett for bo- og forbruksutgifter. Den ordinære barnetrygden trekkes fra, fordi dette er penger som skal bidra til å forsørge barnet. Bo- og forbruksutgiftene oppdateres den 1. juli hvert år, og øker med barnets alder. Satsen for den ordinære barnetrygden oppdateres regelmessig.",
        nn: "Vi spør om alderen til barnet for å vise kor mykje det i gjennomsnitt kostar å forsørge eit barn. Kalkulatoren bruker faste satsar basert på referansebudsjettet til SIFO for bu- og forbrukstutgifter. Den ordinære barnetrygda blir trekt frå, fordi dette er pengar som bidrar til å forsørge barnet. Bu- og forbruksutgiftene blir oppdaterte 1. juli kvart år, og dei aukar med alderen til barnet. Satsen for den ordinære barnetrygda blir oppdatert jamnleg.",
        en: "We ask about the childs age to show how much it costs on average to support a child. The calculator uses fixed rates based on SIFO's reference budget for living and consumption expenses. The ordinary child benefit is deducted, because this is money that is ment to contribute to supporting the child. The living and consumption expenses are updated on July 1st of each year, and increase with the child's age. The rate for the ordinary child benefit is updated regularly.",
      },
      beskrivelse2: {
        nb: "Satsen for bo- og forbruksutgifter, minus ordinær barnetrygd er per i dag:",
        en: "The rate for living and consumption expenses, minus the ordinary child benefit, is currently:",
        nn: "Satsen for bu- og forbruksutgifter, utanom ordinær barnetrygd, er per i dag:",
      },
    },
  },
  barnetilsynsutgift: {
    label: {
      nb: "Hva koster barnepass for barnet per måned?",
      en: "What are the childcare costs for the child per month?",
      nn: "Kva kostar barnepass for barnet per månad?",
    },
    description: {
      nb: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skolefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma. Kostnader for barnepass kalles også tilsynsutgifter.",
      en: "Childcare includes kindergarten (excluding expenses for food, diapers etc), after-school program (SFO), the Activity School (AKS) or nanny. Childcare costs are also referred to as supervision expenses.",
      nn: "Barnepass inkluderer barnehage (utan pengar til kost, bleier og liknande), skulefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma. Kostnadar for barnepass blir óg kalla tilsynsutgifter.",
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
