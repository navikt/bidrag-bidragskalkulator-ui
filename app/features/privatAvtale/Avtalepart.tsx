import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

import { TextField } from "@navikt/ds-react";
import type { PrivatAvtaleSkjema } from "./skjemaSchema";

type Props = {
  part: "deg" | "medforelder";
};

export const Avtalepart = ({ part }: Props) => {
  const form = useFormContext<PrivatAvtaleSkjema>();
  const { t } = useOversettelse();

  return (
    <div className="border p-4 rounded-md">
      <fieldset className="p-0 flex flex-col gap-4">
        <legend className="text-xl mb-5">{t(tekster[part].tittel)}</legend>

        <TextField
          {...form.field(`${part}.fornavn`).getInputProps()}
          label={t(tekster[part].fornavn.label)}
          error={form.field(`${part}.fornavn`).error()}
          autoComplete="off"
          htmlSize={30}
        />
        <TextField
          {...form.field(`${part}.etternavn`).getInputProps()}
          label={t(tekster[part].etternavn.label)}
          error={form.field(`${part}.etternavn`).error()}
          autoComplete="off"
          htmlSize={30}
        />
        <TextField
          {...form.field(`${part}.ident`).getInputProps()}
          label={t(tekster[part].ident.label)}
          error={form.field(`${part}.ident`).error()}
          htmlSize={13}
          inputMode="numeric"
          autoComplete="off"
        />
      </fieldset>
    </div>
  );
};

const tekster = definerTekster({
  deg: {
    tittel: {
      nb: "Litt om deg",
      nn: "Litt om deg",
      en: "About you",
    },
    fornavn: {
      label: {
        nb: "Fornavn",
        nn: "Fornamn",
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
  },
  medforelder: {
    tittel: {
      nb: "Litt om den andre forelderen",
      nn: "Litt om den andre forelderen",
      en: "About the other parent",
    },
    fornavn: {
      label: {
        nb: "Fornavn",
        nn: "Etternamn",
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
        en: "National identity number or D number (11 digits)",
        nn: "Fødselsnummer eller D-nummer (11 siffer)",
      },
    },
  },
});
