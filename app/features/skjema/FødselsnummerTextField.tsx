import { type TextFieldProps } from "@navikt/ds-react";
import { type Ref } from "react";
import { InternalFormatterbartTextField } from "./InternalFormatterbartTextField";

export type FødselsnummerTextFieldProps = Omit<TextFieldProps, "onChange"> & {
  onChange: (value: string) => void;
  ref?: Ref<HTMLInputElement | null>;
};

/**
 * FødselsnummerTextField er en komponent som formaterer et tall som fødselsnummer.
 * onChange-callbacken blir kalt med den uformatterte verdien.
 *
 * Ellers fungerer det som et vanlig TextField.
 *
 * ```tsx
 * <FødselsnummerTextField
 *   {...form.field("deg.fødselsnummer").getControlProps()}
 *   label="Hva er fødselsnummeret ditt?"
 * />
 * ```
 */
export const FødselsnummerTextField = (props: FødselsnummerTextFieldProps) => {
  return (
    <InternalFormatterbartTextField
      {...props}
      formatterer={formatterTall}
      avformatterer={avformatterTall}
    />
  );
};

FødselsnummerTextField.displayName = "FødselsnummerTextField";

const formatterTall = (verdi: string | number | undefined): string => {
  if (!verdi) return "";

  const renVerdi = String(verdi).replace(/\D/g, "");

  const begrensetVerdi = renVerdi.slice(0, 11);

  if (begrensetVerdi.length <= 6) {
    return begrensetVerdi;
  }
  const dato = begrensetVerdi.slice(0, 6);
  const personnummer = begrensetVerdi.slice(6);
  return `${dato} ${personnummer}`;
};

const avformatterTall = (verdi: string): string => {
  return verdi.replace(/\s/g, "");
};
