import { PersonCrossIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, List, ReadMore, TextField } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { useFormContext, useFormScope } from "@rvf/react";
import { useMemo } from "react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";
import { FormattertTallTextField } from "../FormattertTallTextField";
import { usePersoninformasjon } from "../personinformasjon/usePersoninformasjon";
import { Samvær } from "../samvær/Samvær";
import type { ManueltSkjema } from "../schema";
import {
  sporKalkulatorSpørsmålBesvart,
  tilUnderholdskostnadsgruppeMedLabel,
} from "../utils";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const EnkeltbarnSkjema = ({ barnIndex, onFjernBarn }: Props) => {
  const { underholdskostnader } = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const alder = barnField.value("alder");
  const visSpørsmålOmBarnetilsynsutgift =
    barnField.field("alder").touched() && Number(alder) < 11;

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));
  const navnBarn = barnField.field("navn").touched()
    ? barnField.field("navn").value()
    : "";

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
        {...barnField.field("navn").getInputProps({
          onBlur: sporKalkulatorSpørsmålBesvart(t(tekster.navn.label)),
          label: t(tekster.navn.label),
        })}
        description={t(tekster.navn.description)}
        error={barnField.field("navn").error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />
      <TextField
        {...barnField.field("alder").getInputProps({
          label: t(tekster.alder.label(navnBarn)),
          onBlur: sporKalkulatorSpørsmålBesvart(t(tekster.alder.label(""))),
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
  navn: {
    label: {
      nb: "Hva heter barnet?",
      en: "What is the child's name?",
      nn: "Kva heiter barnet?",
    },
    description: {
      nb: "Skriv inn barnets fulle navn",
      en: "Enter the child's full name",
      nn: "Skriv inn barnets fulle namn",
    },
  },
  alder: {
    label: (navn) => ({
      nb: `Hvor gammel er ${navn || "barnet"}?`,
      en: `How old is ${navn || "the child"}?`,
      nn: `Hvor gammal er ${navn || "barnet"}?`,
    }),
    lesMer: {
      tittel: {
        nb: "Hvorfor vi spør om alder",
        en: "Why we ask about age",
        nn: "Kvifor vi spør om alder",
      },
      beskrivelse: {
        nb: "Det viktigste grunnlaget for beregningen er hvor mye det koster å forsørge et barn – også kjent som underholdskostnaden. Disse summene hentes fra SIFOs referansebudsjetter, og oppdateres hvert år. Underholdskostnaden for barn i ulike aldre er i dag:",
        en: "The main basis for the calculation is how much it costs to support a child – also known as the maintenance cost. These amounts are taken from SIFO's reference budgets and are updated every year. The maintenance cost for children of different ages today is:",
        nn: "Det viktigaste grunnlaget for beregninga er kor mykje det kostar å forsørgje eit barn – også kjent som underhaldskostnaden. Desse summene hentast frå SIFOs referansebudsjett, og oppdaterast kvart år. Underhaldskostnaden for barn i ulike aldrar er i dag:",
      },
    },
  },
  barnetilsynsutgift: {
    label: {
      nb: "Kostnad for barnepass",
      en: "Child care costs",
      nn: "Kostnad for barnepass",
    },
    description: {
      nb: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skolefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma",
      en: "Childcare includes kindergarten (excluding expenses for food, diapers etc), after-school program (SFO), the Activity School (AKS) or nanny",
      nn: "Barnepass inkluderer barnehage (uten penger til kost, bleier og lignende), skulefritidsordning (SFO), Aktivitetsskolen (AKS) eller dagmamma",
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
