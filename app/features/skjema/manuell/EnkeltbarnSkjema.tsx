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
  const [erAlderSatt, setAlderSatt] = useState(false);
  const { underholdskostnader } = usePersoninformasjon();
  const { t } = useOversettelse();
  const form = useFormContext<ManueltSkjema>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const alder = barnField.value("alder");
  const visSpørsmålOmBarnetilsynsutgift = erAlderSatt && Number(alder) < 11;

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  const handleChangeAlder = () => setAlderSatt(false);

  const handleBlurAlder = (event: React.FocusEvent<HTMLInputElement>) => {
    const alder = event.target.value;
    if (!!alder) {
      setAlderSatt(true);
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
        {...barnField.field("navn").getInputProps()}
        label={t(tekster.navn.label)}
        error={barnField.field("navn").error()}
      />
      <TextField
        {...barnField.field("alder").getInputProps({
          onBlur: handleBlurAlder,
          onChange: handleChangeAlder,
          label: t(tekster.alder.label(barnField.field("navn").value())),
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
                erAlderSatt && aldre.includes(Number(alder));
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
  navn: {
    label: {
      nb: "Hva heter barnet?",
      en: "What is the child's name?",
      nn: "Kva heiter barnet?",
    },
  },
  alder: {
    label: (navn) => ({
      nb: `Hvor gammelt er ${navn || "barnet"}?`,
      en: `How old is ${navn || "the child"}?`,
      nn: `Hvor gammalt er ${navn || "barnet"}?`,
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
