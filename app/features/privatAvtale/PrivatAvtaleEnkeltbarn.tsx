import { PersonCrossIcon } from "@navikt/aksel-icons";
import {
  Button,
  DatePicker,
  Radio,
  RadioGroup,
  TextField,
  useDatepicker,
} from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { tilÅrMånedDag } from "~/utils/dato";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";
import { BidragstypeSchema } from "../skjema/beregning/schema";
import { FormattertTallTextField } from "../skjema/FormattertTallTextField";
import { FødselsnummerTextField } from "../skjema/FødselsnummerTextField";
import type { PrivatAvtaleFlerstegsSkjema } from "./skjemaSchema";
import { sporPrivatAvtaleSpørsmålBesvart } from "./utils";

type Props = {
  barnIndex: number;
  onFjernBarn?: () => void;
};

export const PrivatAvtaleEnkeltbarnSkjema = ({
  barnIndex,
  onFjernBarn,
}: Props) => {
  const { t } = useOversettelse();
  const form = useFormContext<PrivatAvtaleFlerstegsSkjema["steg2"]>();

  const barnField = useFormScope(form.scope(`barn[${barnIndex}]`));

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: undefined,
    onDateChange: (dato) => {
      barnField.field("fraDato").setValue(dato ? tilÅrMånedDag(dato) : "");
    },
    defaultSelected: barnField.value("fraDato")
      ? new Date(barnField.value("fraDato"))
      : undefined,
  });

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  return (
    <fieldset className="p-0 space-y-6">
      <legend className="sr-only">{overskrift}</legend>
      <TextField
        {...barnField.field("fornavn").getInputProps({
          label: t(tekster.fornavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(t(tekster.fornavn.label)),
        })}
        error={barnField.field("fornavn").error()}
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
        autoComplete="off"
      />

      <TextField
        {...barnField.field("etternavn").getInputProps({
          label: t(tekster.etternavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(t(tekster.etternavn.label)),
        })}
        error={barnField.field("etternavn").error()}
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
        autoComplete="off"
      />

      <FødselsnummerTextField
        label={t(tekster.ident.label)}
        {...barnField.field("ident").getControlProps()}
        onBlur={sporPrivatAvtaleSpørsmålBesvart(t(tekster.ident.label))}
        error={barnField.field("ident").error()}
        htmlSize={13}
        inputMode="numeric"
        autoComplete="off"
      />

      <RadioGroup
        {...barnField.getControlProps("bidragstype")}
        error={barnField.field("bidragstype").error()}
        legend={t(tekster.bidragstype.label)}
      >
        {BidragstypeSchema.options.map((bidragstype) => {
          return (
            <Radio
              value={bidragstype}
              key={bidragstype}
              onChange={sporPrivatAvtaleSpørsmålBesvart(
                t(tekster.bidragstype.label),
              )}
            >
              {t(tekster.bidragstype[bidragstype](""))}
            </Radio>
          );
        })}
      </RadioGroup>

      <FormattertTallTextField
        {...barnField.field("sum").getControlProps()}
        error={barnField.field("sum").error()}
        label={t(tekster.beløp.label)}
        onBlur={sporPrivatAvtaleSpørsmålBesvart(t(tekster.beløp.label))}
        htmlSize={8}
        autoComplete="off"
      />

      <DatePicker {...datepickerProps}>
        <DatePicker.Input
          {...inputProps}
          label={t(tekster.gjelderFra.label)}
          description={t(tekster.gjelderFra.beskrivelse)}
          error={barnField.error("fraDato")}
          onBlur={sporPrivatAvtaleSpørsmålBesvart(t(tekster.gjelderFra.label))}
        />
      </DatePicker>

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
  fornavn: {
    label: {
      nb: "Fornavn",
      nn: "Førenamn",
      en: "First name",
    },
  },
  etternavn: {
    label: {
      nb: "Etternavn",
      nn: "Etternamn",
      en: "Last name",
    },
  },
  ident: {
    label: {
      nb: "Fødselsnummer eller D-nummer (11 siffer)",
      en: "National ID or D-number (11 digits)",
      nn: "Fødselsnummer eller D-nummer (11 siffer)",
    },
  },
  beløp: {
    label: {
      nb: "Barnebidrag per måned",
      en: "Child support per month",
      nn: "Fostringstilskot per månad",
    },
  },
  bidragstype: {
    label: {
      nb: "Skal du motta eller betale barnebidrag?",
      en: "Will you receive or pay child support?",
      nn: "Skal du motta eller betale barnebidrag?",
    },
    MOTTAKER: (navnMotpart) => ({
      nb: `Jeg skal motta barnebidrag fra ${navnMotpart || "den andre forelderen"}`,
      en: `I will receive child support from ${navnMotpart || "the other parent"}`,
      nn: `Eg skal motta barnebidrag frå ${navnMotpart || "den andre forelderen"}`,
    }),
    PLIKTIG: (navnMotpart) => ({
      nb: `Jeg skal betale barnebidrag til ${navnMotpart || "den andre forelderen"}`,
      en: `I will pay child support to ${navnMotpart || "the other parent"}`,
      nn: `Eg skal betale barnebidrag til ${navnMotpart || "den andre forelderen"}`,
    }),
  },
  gjelderFra: {
    label: {
      nb: "Hvilken dag avtalen skal gjelde fra",
      nn: "Kva dag avtalen skal gjelde frå",
      en: "The day the agreement should apply from",
    },
    beskrivelse: {
      nb: "Oppgi dato med format dd.mm.åååå",
      nn: "Oppgi dato med format dd.mm.åååå",
      en: "Provide the date in the format dd.mm.yyyy",
    },
  },
  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
});
