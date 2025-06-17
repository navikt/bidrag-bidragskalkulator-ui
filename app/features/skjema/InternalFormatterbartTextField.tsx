import { TextField, type TextFieldProps } from "@navikt/ds-react";
import { type ChangeEvent, type Ref } from "react";

export type InternalFormatterbartTextFieldProps = Omit<
  TextFieldProps,
  "onChange"
> & {
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement | null>;
  formatterer: (verdi: string) => string;
  avformatterer: (verdi: string) => string;
};

/**
 * InternalFormatterbartTextField er en komponent som formaterer et tall med den gitte formatterer og avformatterer-funksjonen.
 * onChange-callbacken blir kalt med den uformatterte verdien.
 *
 * Ellers fungerer det som et vanlig TextField.
 *
 * @internal Skal kun brukes av interne komponenter som definerer formatteringsreglene
 *
 * ```tsx
 * <InternalFormatterbartTextField
 *   {...form.field("deg.fødselsnummer").getControlProps()}
 *   label="Hva er fødselsnummeret ditt?"
 *   formatterer={formatterTall}
 *   avformatterer={avformatterTall}
 * />
 * ```
 */
export const InternalFormatterbartTextField = ({
  onChange,
  value,
  formatterer,
  avformatterer,
  ...rest
}: InternalFormatterbartTextFieldProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattertVerdi = formatterer(e.target.value);
    const uformattertVerdi = avformatterer(formattertVerdi);
    onChange(uformattertVerdi);
  };

  return (
    <TextField
      {...rest}
      type="text"
      value={formatterer(value ? String(value) : "")}
      onChange={handleChange}
      inputMode="numeric"
    />
  );
};

InternalFormatterbartTextField.displayName = "InternalFormatterbartTextField";
