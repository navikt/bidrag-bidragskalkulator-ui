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
  tilUnderholdskostnadsgruppeMedLabel,
} from "./utils";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const EnkeltbarnSkjema = ({ barnIndex, onFjernBarn }: Props) => {
  const { underholdskostnader } = useKalkulatorgrunnlagsdata();
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const alder = barnField.value("alder");
  const visSpørsmålOmBarnetilsynsutgift =
    barnField.field("alder").touched() &&
    Number(alder) <= MAKS_ALDER_BARNETILSYNSUTGIFT;

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  const underholdskostnadsgrupper = useMemo(
    () =>
      tilUnderholdskostnadsgruppeMedLabel(underholdskostnader, {
        årEntall: t(tekster.år.entall),
        årFlertall: t(tekster.år.flertall),
      }),
    [underholdskostnader, t],
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
          {underholdskostnadsgrupper.map(
            ({ label, underholdskostnad, aldre }) => {
              const fremhevGruppe =
                barnField.field("alder").touched() &&
                aldre.includes(Number(alder));
              return (
                <ListItem key={label}>
                  <span
                    className={fremhevGruppe ? "font-bold" : undefined}
                  >{`${label}: ${formatterSum(underholdskostnad)}`}</span>
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
        nn: "Kvifor vi spør om alder",
      },
      beskrivelse: {
        nb: "Vi spør om alderen til barnet for å vise hvor mye det gjennomsnittlig koster å forsørge et barn. Kalkulatoren bruker faste satser basert på SIFOs referansebudsjett for bo- og forbruksutgifter. Den ordinære barnetrygden trekkes fra, fordi dette er penger som skal bidra til å forsørge barnet. Bo- og forbruksutgiftene oppdateres den 1. juli hvert år, og øker med barnets alder. Satsen for den ordinære barnetrygden oppdateres regelmessig.",
        // TODO: engelsk og nynorsk er ikke oppdatert
        nn: "Når vi reknar ut fostringstilskotet, er det viktig å vite kor mykje det kostar å forsørge eit barn (underhaldskostnaden). Underhaldskostnaden endrar seg med alderen til barnet, og han blir henta frå referansebudsjettet til SIFO som blir oppdatert kvart år. Underhaldskostnaden per månad for barn i ulike aldrar er i dag:",
        en: "When we calculate child support, it is important to know how much it costs to support a child (the maintenance cost). The maintenance cost changes with the child's age, and it is taken from SIFO's reference budgets, which are updated every year. The current maintenance cost per month for children in different ages is:",
      },
      beskrivelse2: {
        nb: "Satsen for bo- og forbruksutgifter, minus ordinær barnetrygd er per i dag:",
        // TODO: engelsk og nynorsk er ikke oppdatert
        en: "",
        nn: "",
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
