import { type TextFieldProps } from "@navikt/ds-react";
import { type Ref } from "react";
import { InternalFormatterbartTextField } from "./InternalFormatterbartTextField";

export type FormattertTallTextFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement | null>;
};

/**
 * FormattertTallTextField er en komponent som formaterer et tall med mellomrom som tusenskilletegn
 * og komma som desimaltegn. onChange-callbacken blir kalt med den uformatterte verdien.
 *
 * Ellers fungerer det som et vanlig TextField.
 *
 * ```tsx
 * <FormattertTallTextField
 *   {...form.field("inntektForelder1").getControlProps()}
 *   label="Hva er inntekten din?"
 * />
 * ```
 */
export const FormattertTallTextField = (
  props: FormattertTallTextFieldProps,
) => {
  return (
    <InternalFormatterbartTextField
      {...props}
      formatterer={formatterTall}
      avformatterer={avformatterTall}
    />
  );
};

const formatterTall = (verdi: string | number | undefined): string => {
  if (!verdi) return "";

  const renVerdi = String(verdi)
    .replace(/\s/g, "")
    .replace(/[^\d,.]/g, "");

  const deler = renVerdi.split(/[,.]/);
  const heltall = deler[0];
  const desimaler = deler.length > 1 ? deler[1] : "";

  const formattertHeltall = heltall.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return desimaler ? `${formattertHeltall},${desimaler}` : formattertHeltall;
};

const avformatterTall = (verdi: string): string => {
  return verdi.replace(/\s/g, "").replace(/,/g, ".");
};
