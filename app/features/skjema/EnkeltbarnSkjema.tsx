import { PersonCrossIcon } from "@navikt/aksel-icons";
import { Button, TextField } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { Samvær } from "./samvær/Samvær";
import { type BarnebidragSkjema } from "./schema";
import { sporKalkulatorSpørsmålBesvart } from "./utils";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const EnkeltbarnSkjema = ({ barnIndex, onFjernBarn }: Props) => {
  const { t } = useOversettelse();
  const form = useFormContext<BarnebidragSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

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

      <Samvær barnIndex={barnIndex} />

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
