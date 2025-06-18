import { PersonCrossIcon } from "@navikt/aksel-icons";
import { Button, TextField } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const PrivatAvtaleEnkeltbarnSkjema = ({
  barnIndex,
  onFjernBarn,
}: Props) => {
  const { t } = useOversettelse();
  const form = useFormContext<PrivatAvtaleSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const alder = barnField.value("alder");

  const overskrift = t(
    tekster.overskrift.barn(barnIndex + 1, alder ?? "uvisst!"),
  );

  return (
    <fieldset className="p-0 space-y-4">
      <legend className="sr-only">{overskrift}</legend>
      <TextField
        {...barnField.field("fornavn").getInputProps()}
        error={barnField.field("fornavn").error()}
        htmlSize={8}
        inputMode="numeric"
        autoComplete="off"
      />

      <TextField
        {...barnField.field("etternavn").getInputProps()}
        error={barnField.field("etternavn").error()}
        htmlSize={8}
        inputMode="numeric"
        autoComplete="off"
      />

      <TextField
        {...barnField.field("ident").getInputProps()}
        error={barnField.field("ident").error()}
        htmlSize={8}
        inputMode="numeric"
        autoComplete="off"
      />

      <TextField
        {...barnField.field("sumBidrag").getInputProps()}
        error={barnField.field("sumBidrag").error()}
        htmlSize={8}
        inputMode="numeric"
        autoComplete="off"
      />

      {barnField.field("bidragstype").value()}

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
    barn: (nummer, alder) => ({
      nb: `Barn ${nummer} (${alder} år)`,
      en: `Child ${nummer} (${alder} years old)`,
      nn: `Barn ${nummer} (${alder} år)`,
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

  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
});
