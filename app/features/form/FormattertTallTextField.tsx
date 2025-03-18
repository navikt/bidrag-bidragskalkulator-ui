import { TextField, type TextFieldProps } from "@navikt/ds-react";
import { type ChangeEvent, type Ref } from "react";

export type FormattertTallTextFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement | null>;
};

/**
 * FormattertTallTextField er en komponent som formaterer et tall med tusenvis
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
export const FormattertTallTextField = ({
  onChange,
  value,
  ...rest
}: FormattertTallTextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattertVerdi = formatterTall(e.target.value);
    const uformattertVerdi = avformatterTall(formattertVerdi);

    e.target.value = formattertVerdi;
    onChange(uformattertVerdi);
  };

  return (
    <TextField
      type="text"
      value={formatterTall(value)}
      onChange={handleChange}
      inputMode="numeric"
      {...rest}
    />
  );
};

FormattertTallTextField.displayName = "FormattertTallTextField";

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
