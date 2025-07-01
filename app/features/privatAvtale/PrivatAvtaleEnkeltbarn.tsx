import { PersonCrossIcon } from "@navikt/aksel-icons";
import { Button, Radio, RadioGroup, TextField } from "@navikt/ds-react";
import { useFormContext, useFormScope } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";
import { BidragstypeSchema } from "../skjema/beregning/schema";
import { FormattertTallTextField } from "../skjema/FormattertTallTextField";
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

  const overskrift = t(tekster.overskrift.barn(barnIndex + 1));

  return (
    <fieldset className="p-0 space-y-4">
      <legend className="sr-only">{overskrift}</legend>
      <TextField
        {...barnField.field("fornavn").getInputProps()}
        error={barnField.field("fornavn").error()}
        label={t(tekster.fornavn.label)}
        htmlSize={30}
        inputMode="numeric"
        autoComplete="off"
      />

      <TextField
        {...barnField.field("etternavn").getInputProps()}
        error={barnField.field("etternavn").error()}
        label={t(tekster.etternavn.label)}
        htmlSize={30}
        inputMode="numeric"
        autoComplete="off"
      />

      <TextField
        {...barnField.field("ident").getInputProps()}
        error={barnField.field("ident").error()}
        label={t(tekster.ident.label)}
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
            <Radio value={bidragstype} key={bidragstype}>
              {t(
                tekster.bidragstype[bidragstype](
                  form.field("medforelder.fornavn").value(),
                ),
              )}
            </Radio>
          );
        })}
      </RadioGroup>

      <FormattertTallTextField
        {...barnField.field("sum").getControlProps()}
        error={barnField.field("sum").error()}
        label={t(tekster.beløp.label)}
        htmlSize={8}
        autoComplete="off"
      />

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
      en: "First name",
      nn: "Fornamn",
    },
  },
  etternavn: {
    label: {
      nb: "Etternavn",
      en: "Last name",
      nn: "Etternamn",
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
  fjernBarn: {
    nb: "Fjern barn",
    en: "Remove child",
    nn: "Fjern barn",
  },
});
