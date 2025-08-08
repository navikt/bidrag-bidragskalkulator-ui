import { definerTekster, useOversettelse } from "~/utils/i18n";

import { TextField } from "@navikt/ds-react";
import { NAVN_TEXT_FIELD_HTML_SIZE } from "~/utils/ui";
import { usePrivatAvtaleForm } from "./PrivatAvtaleFormProvider";
import { sporPrivatAvtaleSpørsmålBesvart } from "./utils";

type Props = {
  part: "medforelder";
};

export const Avtalepart = ({ part }: Props) => {
  const { form } = usePrivatAvtaleForm();
  const { t } = useOversettelse();

  return (
    <div className="space-y-6">
      <TextField
        {...form.field(`steg1.${part}.fulltNavn`).getInputProps({
          label: t(tekster[part].fulltNavn.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(
            t(tekster[part].fulltNavn.label),
          ),
        })}
        error={form.field(`steg1.${part}.fulltNavn`).error()}
        autoComplete="off"
        htmlSize={NAVN_TEXT_FIELD_HTML_SIZE}
      />

      <TextField
        {...form.field(`steg1.${part}.ident`).getInputProps({
          label: t(tekster[part].ident.label),
          onBlur: sporPrivatAvtaleSpørsmålBesvart(t(tekster[part].ident.label)),
        })}
        error={form.field(`steg1.${part}.ident`).error()}
        htmlSize={13}
        inputMode="numeric"
        autoComplete="off"
      />
    </div>
  );
};

const tekster = definerTekster({
  deg: {
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
