import { PersonCrossIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, ReadMore, TextField } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { useMemo, useState } from "react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { formatterSum } from "~/utils/tall";
import { FormattertTallTextField } from "../FormattertTallTextField";
import { usePersoninformasjon } from "../personinformasjon/usePersoninformasjon";
import { Samvær } from "../Samvær";
import type { ManueltSkjema } from "../schema";
import { tilUnderholdskostnadsgruppeMedLabel } from "../utils";

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
  const visSpørsmålOmBarnetilsynsutgift = alder !== "" && Number(alder) < 11;

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

      <Samvær barnIndex={barnIndex} />

      {visSpørsmålOmBarnetilsynsutgift && (
        <FormattertTallTextField
          {...barnField.field("barnetilsynsutgift").getControlProps()}
          label={t(tekster.barnetilsynsutgift.label)}
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
  barnetilsynsutgift: {
    label: {
      nb: "Kostnad for barnetilsyn",
      en: "Child care costs",
      nn: "Kostnad for barnetilsyn",
    },
    description: {
      nb: "Barnetilsyn inkluderer barnehage (uten penger til kost, bleier og lignende), SFO, AKS eller dagmamma",
      en: "Childcare includes kindergarten (excluding expenses for food, diapers etc), SFO, AKS or nanny",
      nn: "Barnetilsyn inkluderer barnehage (uten penger til kost, bleier og lignende), SFO, AKS eller dagmamma",
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
