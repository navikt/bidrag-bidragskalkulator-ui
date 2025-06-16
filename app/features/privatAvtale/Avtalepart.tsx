import { useFormContext } from "@rvf/react";
import { definerTekster, useOversettelse } from "~/utils/i18n";

import { TextField } from "@navikt/ds-react";
import type { PrivatAvtaleSkjema } from "./schema";

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
        />
        <TextField
          {...form.field(`${part}.etternavn`).getInputProps()}
          label={t(tekster[part].etternavn.label)}
          error={form.field(`${part}.etternavn`).error()}
          autoComplete="off"
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
        nb: "Fødselsnummer eller D-nummer",
        nn: "Fødselsnummer eller D-nummer",
        en: "National identity number or D-number",
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
        nb: "Fødselsnummer eller D-nummer",
        nn: "Fødselsnummer eller D-nummer",
        en: "National identity number or D-number",
      },
    },
    antallBarnBorFast: {
      label: {
        nb: "Antall barn som bor fast hos den andre forelderen",
        nn: "Antal barn som bur fast hjå den andre forelderen",
        en: "Number of children living with the other parent",
      },
      beskrivelse: {
        nb: "Oppgi antall barn under 18 som bor fast hos den andre forelderen. Felles barn med den du ønsker å avtale barnebidrag med, skal ikke telles med her.",
        nn: "Oppgi antall barn under 18 som bur fast hjå den andre forelderen. Felles barn med den du ønskjer å avtale barnebidrag med, skal ikkje teljast med her.",
        en: "Enter the number of children under 18 who live with the other parent. Shared children with you should not be included here.",
      },
    },
    antallBarnDeltBosted: {
      label: {
        nb: "Antall barn med delt bosted hos den andre forelderen",
        nn: "Antal barn med delt bustad hjå den andre forelderen",
        en: "Number of children with shared custody living with the other parent",
      },
      beskrivelse: {
        nb: "Oppgi antall barn under 18 som har delt bosted hos den andre forelderen. Felles barn med den du ønsker å avtale barnebidrag med, skal ikke telles med her.",
        nn: "Oppgi antall barn under 18 som har delt bustad hjå den andre forelderen. Felles barn med den du ønskjer å avtale barnebidrag med, skal ikkje teljast med her.",
        en: "Enter the number of children under 18 who have shared custody living with the other parent. Shared children with you should not be included here.",
      },
    },
    borMedAnnenVoksen: {
      label: {
        nb: "Bor den andre forelderen med en annen voksen?",
        nn: "Bur den andre forelderen med ein annan vaksen?",
        en: "Does the other parent live with another adult?",
      },
      true: {
        nb: "Ja",
        nn: "Ja",
        en: "Yes",
      },
      false: {
        nb: "Nei",
        nn: "Nei",
        en: "No",
      },
    },
  },
});
