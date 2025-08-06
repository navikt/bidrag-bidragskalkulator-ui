import { definerTekster, useOversettelse } from "~/utils/i18n";

import { TextField } from "@navikt/ds-react";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";
import { sporPrivatAvtaleSpørsmålBesvart } from "./utils";

type Props = {
  part: "deg" | "medforelder";
};

export const Avtalepart = ({ part }: Props) => {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();

  return (
    <fieldset className="p-0 flex flex-col gap-4">
      <legend className="text-xl mb-5" id={`avtalepart-${part}`}>
        {t(tekster[part].tittel)}
      </legend>

      <TextField
        {...form.field(`${part}.fulltNavn`).getInputProps({
          label: t(tekster[part].fulltNavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            t(tekster[part].fulltNavn.label),
          ),
        })}
        error={form.field(`${part}.fulltNavn`).error()}
        autoComplete="off"
        htmlSize={30}
      />

      <TextField
        {...form.field(`${part}.ident`).getInputProps({
          label: t(tekster[part].ident.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(t(tekster[part].ident.label)),
        })}
        error={form.field(`${part}.ident`).error()}
        htmlSize={13}
        inputMode="numeric"
        autoComplete="off"
      />
    </fieldset>
  );
};

const tekster = definerTekster({
  deg: {
    tittel: {
      nb: "Litt om deg",
      nn: "Litt om deg",
      en: "About you",
    },
    fulltNavn: {
      label: {
        nb: "Fullt navn",
        nn: "Heile namnet",
        en: "Full name",
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
    fulltNavn: {
      label: {
        nb: "Fullt navn",
        nn: "Heile namnet",
        en: "Full name",
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
